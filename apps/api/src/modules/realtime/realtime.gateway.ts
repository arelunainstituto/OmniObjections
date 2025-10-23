import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  AudioProcessorService,
  TranscriptionService,
  ObjectionDetectorService,
} from '@omni/ai';
import { CallService } from '../call/call.service';
import { SuggestionService } from '../suggestion/suggestion.service';
import { ObjectionService } from '../objection/objection.service';
import { WebSocketMessage, WebSocketMessageType, Speaker, CallStatus } from '@omni/types';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('RealtimeGateway');
  private audioProcessors = new Map<string, AudioProcessorService>();
  private transcriptionService: TranscriptionService;
  private objectionDetector: ObjectionDetectorService;
  private callSessions = new Map<string, any>();

  constructor(
    private callService: CallService,
    private suggestionService: SuggestionService,
    private objectionService: ObjectionService
  ) {
    this.transcriptionService = new TranscriptionService();
    this.objectionDetector = new ObjectionDetectorService();
    this.loadObjections();
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    this.audioProcessors.set(client.id, new AudioProcessorService());
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    this.audioProcessors.delete(client.id);

    // Finalizar chamada se houver
    const session = this.callSessions.get(client.id);
    if (session?.callId) {
      await this.handleEndCall(client, {
        type: WebSocketMessageType.END_CALL,
        payload: { callId: session.callId },
        timestamp: Date.now(),
      });
    }
  }

  @SubscribeMessage('call.start')
  async handleStartCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: WebSocketMessage
  ) {
    try {
      const { agentId, leadName, leadEmail, leadPhone } = message.payload;

      // Criar chamada no banco
      const call = await this.callService.create({
        agentId,
        leadName,
        leadEmail,
        leadPhone,
      });

      // Atualizar status para ativa
      await this.callService.update(call.id, { status: CallStatus.ACTIVE });

      // Salvar sessão
      this.callSessions.set(client.id, {
        callId: call.id,
        transcriptSegments: [],
        startTime: Date.now(),
      });

      // Responder ao cliente
      this.sendToClient(client, WebSocketMessageType.START_CALL, {
        callId: call.id,
        message: 'Chamada iniciada com sucesso',
      });

      this.logger.log(`Chamada iniciada: ${call.id}`);
    } catch (error: any) {
      this.logger.error(`Erro ao iniciar chamada: ${error.message}`);
      this.sendError(client, 'CALL_START_ERROR', error.message);
    }
  }

  @SubscribeMessage('audio.chunk')
  async handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: WebSocketMessage
  ) {
    try {
      const session = this.callSessions.get(client.id);
      if (!session) {
        throw new Error('Nenhuma chamada ativa');
      }

      const processor = this.audioProcessors.get(client.id);
      if (!processor) {
        throw new Error('Processador de áudio não encontrado');
      }

      // Adicionar chunk ao buffer
      processor.addChunk(message.payload);

      // Verificar se há um segmento completo
      if (processor.hasCompleteSegment()) {
        const segment = processor.extractSegment();
        if (segment) {
          await this.processAudioSegment(client, session, segment);
        }
      }
    } catch (error: any) {
      this.logger.error(`Erro ao processar áudio: ${error.message}`);
      this.sendError(client, 'AUDIO_PROCESSING_ERROR', error.message);
    }
  }

  @SubscribeMessage('call.end')
  async handleEndCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: WebSocketMessage
  ) {
    try {
      const session = this.callSessions.get(client.id);
      if (!session) {
        throw new Error('Nenhuma chamada ativa');
      }

      const { notes, outcome } = message.payload;

      // Atualizar chamada
      await this.callService.update(session.callId, {
        status: CallStatus.COMPLETED,
        endedAt: new Date(),
        notes,
        outcome,
      });

      // Limpar sessão
      this.callSessions.delete(client.id);
      this.audioProcessors.get(client.id)?.clear();

      this.sendToClient(client, WebSocketMessageType.END_CALL, {
        callId: session.callId,
        duration: Date.now() - session.startTime,
      });

      this.logger.log(`Chamada finalizada: ${session.callId}`);
    } catch (error: any) {
      this.logger.error(`Erro ao finalizar chamada: ${error.message}`);
      this.sendError(client, 'CALL_END_ERROR', error.message);
    }
  }

  private async processAudioSegment(client: Socket, session: any, segment: any) {
    try {
      // Transcrever áudio
      const result = await this.transcriptionService.transcribe(segment.buffer);

      if (!result.text || result.text.trim().length === 0) {
        return; // Ignorar segmentos vazios
      }

      // Detectar speaker
      const speaker = this.transcriptionService.detectSpeaker(
        result.text,
        session.transcriptSegments
      );

      // Criar segmento de transcrição
      const transcriptSegment = this.transcriptionService.createSegment(
        result,
        speaker,
        segment.startTime
      );

      // Salvar no banco e na sessão
      session.transcriptSegments.push(transcriptSegment);

      // Enviar transcrição ao cliente
      this.sendToClient(client, WebSocketMessageType.TRANSCRIPT_SEGMENT, {
        callId: session.callId,
        segmentId: transcriptSegment.id,
        text: transcriptSegment.text,
        speaker: transcriptSegment.speaker,
        timestamp: transcriptSegment.timestamp,
        confidence: transcriptSegment.confidence,
      });

      // Se for fala do lead, detectar objeções
      if (speaker === Speaker.LEAD) {
        await this.detectAndSuggest(client, session, transcriptSegment);
      }
    } catch (error: any) {
      this.logger.error(`Erro ao processar segmento: ${error.message}`);
    }
  }

  private async detectAndSuggest(client: Socket, session: any, segment: any) {
    try {
      // Detectar objeção
      const detection = this.objectionDetector.detect(segment.text);

      if (detection.detected && detection.objection) {
        // Enviar alerta de objeção
        this.sendToClient(client, WebSocketMessageType.OBJECTION_ALERT, {
          callId: session.callId,
          category: detection.objection.category,
          text: segment.text,
          confidence: detection.confidence,
        });

        // Gerar sugestão
        const suggestion = await this.suggestionService.generate({
          callId: session.callId,
          context: segment.text,
          objectionDetected: {
            category: detection.objection.category,
            text: segment.text,
          },
          conversationHistory: session.transcriptSegments.slice(-5),
        });

        // Enviar sugestão ao cliente
        this.sendToClient(client, WebSocketMessageType.SUGGESTION, {
          callId: session.callId,
          suggestionId: suggestion.id,
          type: suggestion.type,
          suggestion: suggestion.suggestion,
          sources: suggestion.sources.map((s) => ({
            title: s.title,
            type: s.type,
          })),
          confidence: suggestion.confidence,
        });
      }
    } catch (error: any) {
      this.logger.error(`Erro ao detectar objeção: ${error.message}`);
    }
  }

  private async loadObjections() {
    try {
      const objections = await this.objectionService.findAll();
      this.objectionDetector.loadObjections(objections);
      this.logger.log(`${objections.length} objeções carregadas`);
    } catch (error: any) {
      this.logger.error(`Erro ao carregar objeções: ${error.message}`);
    }
  }

  private sendToClient(client: Socket, type: WebSocketMessageType, payload: any) {
    client.emit('message', {
      type,
      payload,
      timestamp: Date.now(),
    });
  }

  private sendError(client: Socket, code: string, message: string) {
    this.sendToClient(client, WebSocketMessageType.ERROR, {
      code,
      message,
    });
  }
}


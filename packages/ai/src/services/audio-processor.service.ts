/**
 * Audio Processor Service
 * Processa chunks de áudio recebidos via WebSocket
 */

export interface AudioChunk {
  data: Buffer | string; // Buffer ou base64
  format: 'webm' | 'opus' | 'wav';
  sampleRate: number;
  timestamp: number;
  sequence: number;
}

export interface AudioSegment {
  buffer: Buffer;
  duration: number;
  startTime: number;
  endTime: number;
}

export class AudioProcessorService {
  private audioBuffer: Buffer[] = [];
  private segmentDuration = 5000; // 5 segundos
  private lastSegmentTime = 0;

  /**
   * Adiciona um chunk de áudio ao buffer
   */
  addChunk(chunk: AudioChunk): void {
    const buffer = this.convertToBuffer(chunk.data);
    this.audioBuffer.push(buffer);
  }

  /**
   * Verifica se há um segmento completo para processar
   */
  hasCompleteSegment(): boolean {
    const now = Date.now();
    return now - this.lastSegmentTime >= this.segmentDuration && this.audioBuffer.length > 0;
  }

  /**
   * Extrai um segmento completo do buffer
   */
  extractSegment(): AudioSegment | null {
    if (!this.hasCompleteSegment()) {
      return null;
    }

    const now = Date.now();
    const buffer = Buffer.concat(this.audioBuffer);
    
    const segment: AudioSegment = {
      buffer,
      duration: this.segmentDuration,
      startTime: this.lastSegmentTime,
      endTime: now,
    };

    // Limpar buffer e atualizar timestamp
    this.audioBuffer = [];
    this.lastSegmentTime = now;

    return segment;
  }

  /**
   * Limpa o buffer
   */
  clear(): void {
    this.audioBuffer = [];
    this.lastSegmentTime = 0;
  }

  /**
   * Converte dados de áudio para Buffer
   */
  private convertToBuffer(data: Buffer | string): Buffer {
    if (Buffer.isBuffer(data)) {
      return data;
    }
    
    // Assumir que é base64
    return Buffer.from(data, 'base64');
  }

  /**
   * Define a duração do segmento
   */
  setSegmentDuration(duration: number): void {
    this.segmentDuration = duration;
  }

  /**
   * Converte áudio para formato compatível com Whisper
   */
  async convertToWhisperFormat(buffer: Buffer, _format: string): Promise<Buffer> {
    // Em produção, você usaria ffmpeg ou similar
    // Por enquanto, retornar o buffer original
    return buffer;
  }
}


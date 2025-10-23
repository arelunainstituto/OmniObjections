import { Injectable } from '@nestjs/common';
import { getSupabaseClient, SuggestionRepository } from '@omni/db';
import { SuggestionEngineService, ObjectionDetectorService } from '@omni/ai';
import { Suggestion, GenerateSuggestionDto, SuggestionFeedbackDto } from '@omni/types';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { ObjectionService } from '../objection/objection.service';

@Injectable()
export class SuggestionService {
  private suggestionRepository: SuggestionRepository;
  private suggestionEngine: SuggestionEngineService;
  private objectionDetector: ObjectionDetectorService;

  constructor(
    private knowledgeService: KnowledgeService,
    private objectionService: ObjectionService
  ) {
    const supabase = getSupabaseClient();
    this.suggestionRepository = new SuggestionRepository(supabase);
    this.suggestionEngine = new SuggestionEngineService();
    this.objectionDetector = new ObjectionDetectorService();
  }

  async findByCallId(callId: string): Promise<Suggestion[]> {
    return this.suggestionRepository.findByCallId(callId);
  }

  async generate(dto: GenerateSuggestionDto): Promise<Suggestion> {
    // Buscar conhecimento relevante
    const knowledgeItems = await this.knowledgeService.search({
      query: dto.context,
      limit: 5,
    });

    // Carregar objeções se necessário
    let objection = undefined;
    if (dto.objectionDetected) {
      const objections = await this.objectionService.findAll();
      this.objectionDetector.loadObjections(objections);

      const detection = this.objectionDetector.detect(dto.objectionDetected.text);
      if (detection.detected) {
        objection = detection.objection;
      }
    }

    // Gerar sugestão
    const suggestion = await this.suggestionEngine.generate({
      callId: dto.callId,
      objection,
      objectionText: dto.objectionDetected?.text,
      conversationHistory: dto.conversationHistory as any,
      knowledgeItems,
    });

    // Salvar no banco
    const saved = await this.suggestionRepository.create(suggestion);

    return saved;
  }

  async markAsUsed(id: string): Promise<void> {
    return this.suggestionRepository.markAsUsed(id);
  }

  async addFeedback(dto: SuggestionFeedbackDto): Promise<void> {
    return this.suggestionRepository.addFeedback(dto);
  }

  async getStats(callId?: string): Promise<any> {
    return this.suggestionRepository.getStats(callId);
  }
}


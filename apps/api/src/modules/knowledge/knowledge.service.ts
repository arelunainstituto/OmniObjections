import { Injectable } from '@nestjs/common';
import { getSupabaseClient, KnowledgeRepository } from '@omni/db';
import {
  KnowledgeItem,
  KnowledgeType,
  CreateKnowledgeDto,
  UpdateKnowledgeDto,
  SearchKnowledgeDto,
} from '@omni/types';

@Injectable()
export class KnowledgeService {
  private knowledgeRepository: KnowledgeRepository;

  constructor() {
    const supabase = getSupabaseClient();
    this.knowledgeRepository = new KnowledgeRepository(supabase);
  }

  async findById(id: string): Promise<KnowledgeItem | null> {
    return this.knowledgeRepository.findById(id);
  }

  async findAll(type?: KnowledgeType): Promise<KnowledgeItem[]> {
    return this.knowledgeRepository.findAll(type);
  }

  async search(dto: SearchKnowledgeDto): Promise<KnowledgeItem[]> {
    return this.knowledgeRepository.search(dto);
  }

  async create(dto: CreateKnowledgeDto): Promise<KnowledgeItem> {
    return this.knowledgeRepository.create(dto);
  }

  async update(id: string, dto: UpdateKnowledgeDto): Promise<KnowledgeItem> {
    return this.knowledgeRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.knowledgeRepository.delete(id);
  }
}


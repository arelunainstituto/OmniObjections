import { Injectable } from '@nestjs/common';
import { getSupabaseClient, ObjectionRepository } from '@omni/db';
import {
  Objection,
  ObjectionCategory,
  CreateObjectionDto,
  UpdateObjectionDto,
} from '@omni/types';

@Injectable()
export class ObjectionService {
  private objectionRepository: ObjectionRepository;

  constructor() {
    const supabase = getSupabaseClient();
    this.objectionRepository = new ObjectionRepository(supabase);
  }

  async findById(id: string): Promise<Objection | null> {
    return this.objectionRepository.findById(id);
  }

  async findAll(activeOnly = true): Promise<Objection[]> {
    return this.objectionRepository.findAll(activeOnly);
  }

  async findByCategory(category: ObjectionCategory): Promise<Objection[]> {
    return this.objectionRepository.findByCategory(category);
  }

  async searchByKeyword(keyword: string): Promise<Objection[]> {
    return this.objectionRepository.searchByKeyword(keyword);
  }

  async create(dto: CreateObjectionDto): Promise<Objection> {
    return this.objectionRepository.create(dto);
  }

  async update(id: string, dto: UpdateObjectionDto): Promise<Objection> {
    return this.objectionRepository.update(id, dto);
  }

  async delete(id: string): Promise<void> {
    return this.objectionRepository.delete(id);
  }
}


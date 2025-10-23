import { SupabaseClient } from '@supabase/supabase-js';
import {
  KnowledgeItem,
  KnowledgeType,
  CreateKnowledgeDto,
  UpdateKnowledgeDto,
  SearchKnowledgeDto,
} from '@omni/types';

export class KnowledgeRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<KnowledgeItem | null> {
    const { data, error } = await this.supabase
      .from('knowledge_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as KnowledgeItem;
  }

  async findAll(type?: KnowledgeType, activeOnly = true): Promise<KnowledgeItem[]> {
    let query = this.supabase.from('knowledge_items').select('*');

    if (type) {
      query = query.eq('type', type);
    }

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data as KnowledgeItem[];
  }

  async search(dto: SearchKnowledgeDto): Promise<KnowledgeItem[]> {
    const { query, type, limit = 10, includeInactive = false } = dto;

    // Usar Full-Text Search do Supabase
    const { data, error } = await this.supabase.rpc('search_knowledge', {
      search_query: query,
      item_type: type || null,
      result_limit: limit,
      include_inactive: includeInactive,
    });

    if (error) throw error;
    return data as KnowledgeItem[];
  }

  async create(dto: CreateKnowledgeDto): Promise<KnowledgeItem> {
    const item = {
      ...dto,
      active: true,
    };

    const { data, error } = await this.supabase
      .from('knowledge_items')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data as KnowledgeItem;
  }

  async update(id: string, dto: UpdateKnowledgeDto): Promise<KnowledgeItem> {
    const { data, error } = await this.supabase
      .from('knowledge_items')
      .update({ ...dto, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as KnowledgeItem;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('knowledge_items').delete().eq('id', id);

    if (error) throw error;
  }
}


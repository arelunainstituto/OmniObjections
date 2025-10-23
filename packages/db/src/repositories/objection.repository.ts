import { SupabaseClient } from '@supabase/supabase-js';
import { Objection, ObjectionCategory, CreateObjectionDto, UpdateObjectionDto } from '@omni/types';

export class ObjectionRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<Objection | null> {
    const { data, error } = await this.supabase
      .from('objections')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Objection;
  }

  async findAll(activeOnly = true): Promise<Objection[]> {
    let query = this.supabase.from('objections').select('*');

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) throw error;
    return data as Objection[];
  }

  async findByCategory(category: ObjectionCategory, activeOnly = true): Promise<Objection[]> {
    let query = this.supabase.from('objections').select('*').eq('category', category);

    if (activeOnly) {
      query = query.eq('active', true);
    }

    const { data, error } = await query.order('priority', { ascending: false });

    if (error) throw error;
    return data as Objection[];
  }

  async searchByKeyword(keyword: string): Promise<Objection[]> {
    const { data, error } = await this.supabase
      .from('objections')
      .select('*')
      .ilike('keyword', `%${keyword}%`)
      .eq('active', true)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data as Objection[];
  }

  async create(dto: CreateObjectionDto): Promise<Objection> {
    const objection = {
      ...dto,
      priority: dto.priority || 50,
      active: true,
    };

    const { data, error } = await this.supabase
      .from('objections')
      .insert(objection)
      .select()
      .single();

    if (error) throw error;
    return data as Objection;
  }

  async update(id: string, dto: UpdateObjectionDto): Promise<Objection> {
    const { data, error } = await this.supabase
      .from('objections')
      .update({ ...dto, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Objection;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('objections').delete().eq('id', id);

    if (error) throw error;
  }
}


import { SupabaseClient } from '@supabase/supabase-js';
import { Suggestion, SuggestionType, SuggestionFeedbackDto } from '@omni/types';

export class SuggestionRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<Suggestion | null> {
    const { data, error } = await this.supabase
      .from('suggestions')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Suggestion;
  }

  async findByCallId(callId: string): Promise<Suggestion[]> {
    const { data, error } = await this.supabase
      .from('suggestions')
      .select('*')
      .eq('call_id', callId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data as Suggestion[];
  }

  async create(suggestion: Omit<Suggestion, 'id'>): Promise<Suggestion> {
    const { data, error } = await this.supabase
      .from('suggestions')
      .insert({
        call_id: suggestion.callId,
        type: suggestion.type,
        timestamp: suggestion.timestamp,
        objection: suggestion.objection,
        objection_category: suggestion.objectionCategory,
        suggestion: suggestion.suggestion,
        sources: suggestion.sources,
        confidence: suggestion.confidence,
        used: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Suggestion;
  }

  async markAsUsed(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('suggestions')
      .update({ used: true })
      .eq('id', id);

    if (error) throw error;
  }

  async addFeedback(dto: SuggestionFeedbackDto): Promise<void> {
    const { error } = await this.supabase
      .from('suggestions')
      .update({ feedback: dto.feedback })
      .eq('id', dto.suggestionId);

    if (error) throw error;
  }

  async getStats(callId?: string): Promise<any> {
    let query = this.supabase.from('suggestions').select('*');

    if (callId) {
      query = query.eq('call_id', callId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const stats = {
      total: data.length,
      used: data.filter((s: any) => s.used).length,
      helpful: data.filter((s: any) => s.feedback === 'helpful').length,
      notHelpful: data.filter((s: any) => s.feedback === 'not_helpful').length,
      byType: {} as Record<SuggestionType, number>,
    };

    data.forEach((s: any) => {
      stats.byType[s.type as SuggestionType] =
        (stats.byType[s.type as SuggestionType] || 0) + 1;
    });

    return stats;
  }
}


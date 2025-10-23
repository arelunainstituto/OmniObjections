import { SupabaseClient } from '@supabase/supabase-js';
import { Call, CallStatus, CreateCallDto, UpdateCallDto } from '@omni/types';

export class CallRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string): Promise<Call | null> {
    const { data, error } = await this.supabase
      .from('calls')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Call;
  }

  async findByAgentId(agentId: string, limit = 50): Promise<Call[]> {
    const { data, error } = await this.supabase
      .from('calls')
      .select('*')
      .eq('agent_id', agentId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Call[];
  }

  async findActive(): Promise<Call[]> {
    const { data, error } = await this.supabase
      .from('calls')
      .select('*')
      .eq('status', CallStatus.ACTIVE)
      .order('started_at', { ascending: false });

    if (error) throw error;
    return data as Call[];
  }

  async create(dto: CreateCallDto): Promise<Call> {
    const call = {
      agent_id: dto.agentId,
      lead_name: dto.leadName,
      lead_email: dto.leadEmail,
      lead_phone: dto.leadPhone,
      status: CallStatus.PENDING,
      transcript: [],
      suggestions: [],
    };

    const { data, error } = await this.supabase
      .from('calls')
      .insert(call)
      .select()
      .single();

    if (error) throw error;
    return data as Call;
  }

  async update(id: string, dto: UpdateCallDto): Promise<Call> {
    const { data, error } = await this.supabase
      .from('calls')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Call;
  }

  async addTranscriptSegment(callId: string, segment: any): Promise<void> {
    // Primeiro buscar o transcript atual
    const { data: call } = await this.supabase
      .from('calls')
      .select('transcript')
      .eq('id', callId)
      .single();

    const currentTranscript = (call?.transcript as any[]) || [];
    const updatedTranscript = [...currentTranscript, segment];

    const { error } = await this.supabase
      .from('calls')
      .update({ transcript: updatedTranscript })
      .eq('id', callId);

    if (error) throw error;
  }

  async addSuggestion(callId: string, suggestionId: string): Promise<void> {
    const { data: call } = await this.supabase
      .from('calls')
      .select('suggestions')
      .eq('id', callId)
      .single();

    const currentSuggestions = (call?.suggestions as string[]) || [];
    const updatedSuggestions = [...currentSuggestions, suggestionId];

    const { error } = await this.supabase
      .from('calls')
      .update({ suggestions: updatedSuggestions })
      .eq('id', callId);

    if (error) throw error;
  }

  async updateMetrics(callId: string, metrics: any): Promise<void> {
    const { error } = await this.supabase
      .from('calls')
      .update({ metrics })
      .eq('id', callId);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('calls').delete().eq('id', id);

    if (error) throw error;
  }
}


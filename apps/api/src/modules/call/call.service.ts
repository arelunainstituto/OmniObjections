import { Injectable } from '@nestjs/common';
import { getSupabaseClient, CallRepository } from '@omni/db';
import { Call, CreateCallDto, UpdateCallDto } from '@omni/types';

@Injectable()
export class CallService {
  private callRepository: CallRepository;

  constructor() {
    const supabase = getSupabaseClient();
    this.callRepository = new CallRepository(supabase);
  }

  async create(dto: CreateCallDto): Promise<Call> {
    return this.callRepository.create(dto);
  }

  async findById(id: string): Promise<Call | null> {
    return this.callRepository.findById(id);
  }

  async findByAgentId(agentId: string, limit = 50): Promise<Call[]> {
    return this.callRepository.findByAgentId(agentId, limit);
  }

  async findActive(): Promise<Call[]> {
    return this.callRepository.findActive();
  }

  async update(id: string, dto: UpdateCallDto): Promise<Call> {
    return this.callRepository.update(id, dto);
  }

  async getMetrics(id: string): Promise<any> {
    const call = await this.callRepository.findById(id);
    return call?.metrics || null;
  }

  async getTranscript(id: string): Promise<any> {
    const call = await this.callRepository.findById(id);
    return call?.transcript || [];
  }

  async getAgentStats(agentId: string): Promise<any> {
    const calls = await this.callRepository.findByAgentId(agentId, 100);

    const stats = {
      totalCalls: calls.length,
      activeCalls: calls.filter((c) => c.status === 'active').length,
      completedCalls: calls.filter((c) => c.status === 'completed').length,
      successRate: 0,
      averageDuration: 0,
      totalObjections: 0,
      totalSuggestions: 0,
    };

    const completed = calls.filter((c) => c.status === 'completed');
    if (completed.length > 0) {
      const successful = completed.filter((c) => c.outcome === 'success').length;
      stats.successRate = (successful / completed.length) * 100;

      const durations = completed
        .filter((c) => c.endedAt)
        .map((c) => {
          const start = new Date(c.startedAt).getTime();
          const end = new Date(c.endedAt!).getTime();
          return end - start;
        });

      if (durations.length > 0) {
        stats.averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      }
    }

    return stats;
  }
}


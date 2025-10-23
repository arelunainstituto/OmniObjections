export enum CallStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Speaker {
  LEAD = 'lead',
  COMERCIAL = 'comercial',
}

export interface TranscriptSegment {
  id: string;
  text: string;
  speaker: Speaker;
  timestamp: number;
  startTime: number;
  endTime: number;
  confidence?: number;
  objectionDetected?: boolean;
  objectionCategory?: string;
}

export interface CallMetrics {
  duration: number;
  segmentsCount: number;
  objectionsCount: number;
  suggestionsCount: number;
  leadTalkTime: number;
  comercialTalkTime: number;
  sentimentScore?: number;
  interruptionsCount?: number;
}

export interface Call {
  id: string;
  agentId: string;
  agentName: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  status: CallStatus;
  startedAt: Date;
  endedAt?: Date;
  transcript: TranscriptSegment[];
  summary?: string;
  suggestions: string[];
  metrics?: CallMetrics;
  outcome?: 'success' | 'follow_up' | 'rejected' | 'no_show';
  notes?: string;
  recordingUrl?: string;
}

export interface CreateCallDto {
  agentId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
}

export interface UpdateCallDto {
  status?: CallStatus;
  endedAt?: Date;
  summary?: string;
  outcome?: 'success' | 'follow_up' | 'rejected' | 'no_show';
  notes?: string;
}


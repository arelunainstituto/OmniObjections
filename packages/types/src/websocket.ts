export enum WebSocketMessageType {
  // Client -> Server
  AUDIO_CHUNK = 'audio.chunk',
  START_CALL = 'call.start',
  END_CALL = 'call.end',
  PING = 'ping',

  // Server -> Client
  TRANSCRIPT_SEGMENT = 'transcript.segment',
  SUGGESTION = 'suggestion',
  OBJECTION_ALERT = 'objection.alert',
  METRICS_UPDATE = 'metrics.update',
  ERROR = 'error',
  PONG = 'pong',
}

export interface WebSocketMessage<T = any> {
  type: WebSocketMessageType;
  payload: T;
  timestamp: number;
  callId?: string;
}

// Client -> Server Messages
export interface AudioChunkMessage {
  chunk: ArrayBuffer | string; // base64 encoded
  format: 'webm' | 'opus' | 'wav';
  sampleRate: number;
  sequence: number;
}

export interface StartCallMessage {
  agentId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
}

export interface EndCallMessage {
  callId: string;
  notes?: string;
  outcome?: 'success' | 'follow_up' | 'rejected' | 'no_show';
}

// Server -> Client Messages
export interface TranscriptSegmentMessage {
  callId: string;
  segmentId: string;
  text: string;
  speaker: 'lead' | 'comercial';
  timestamp: number;
  confidence: number;
}

export interface SuggestionMessage {
  callId: string;
  suggestionId: string;
  type: string;
  suggestion: string;
  sources: Array<{
    title: string;
    type: string;
  }>;
  confidence: number;
}

export interface ObjectionAlertMessage {
  callId: string;
  category: string;
  text: string;
  confidence: number;
}

export interface MetricsUpdateMessage {
  callId: string;
  duration: number;
  segmentsCount: number;
  objectionsCount: number;
  leadTalkTime: number;
  comercialTalkTime: number;
}

export interface ErrorMessage {
  code: string;
  message: string;
  details?: any;
}


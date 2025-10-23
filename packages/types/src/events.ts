import { TranscriptSegment, CallMetrics } from './call';
import { Suggestion } from './suggestion';

export enum EventType {
  // Call Events
  CALL_STARTED = 'call.started',
  CALL_ENDED = 'call.ended',
  CALL_UPDATED = 'call.updated',

  // Transcription Events
  TRANSCRIPT_SEGMENT = 'transcript.segment',
  TRANSCRIPT_UPDATED = 'transcript.updated',

  // Objection Events
  OBJECTION_DETECTED = 'objection.detected',

  // Suggestion Events
  SUGGESTION_GENERATED = 'suggestion.generated',
  SUGGESTION_USED = 'suggestion.used',

  // Metrics Events
  METRICS_UPDATED = 'metrics.updated',

  // System Events
  ERROR = 'error',
}

export interface BaseEvent {
  type: EventType;
  timestamp: Date;
  callId: string;
}

export interface CallStartedEvent extends BaseEvent {
  type: EventType.CALL_STARTED;
  agentId: string;
  leadName: string;
}

export interface CallEndedEvent extends BaseEvent {
  type: EventType.CALL_ENDED;
  duration: number;
  summary?: string;
}

export interface TranscriptSegmentEvent extends BaseEvent {
  type: EventType.TRANSCRIPT_SEGMENT;
  segment: TranscriptSegment;
}

export interface ObjectionDetectedEvent extends BaseEvent {
  type: EventType.OBJECTION_DETECTED;
  objectionCategory: string;
  text: string;
  confidence: number;
}

export interface SuggestionGeneratedEvent extends BaseEvent {
  type: EventType.SUGGESTION_GENERATED;
  suggestion: Suggestion;
}

export interface MetricsUpdatedEvent extends BaseEvent {
  type: EventType.METRICS_UPDATED;
  metrics: CallMetrics;
}

export interface ErrorEvent extends BaseEvent {
  type: EventType.ERROR;
  error: string;
  details?: any;
}

export type OmniEvent =
  | CallStartedEvent
  | CallEndedEvent
  | TranscriptSegmentEvent
  | ObjectionDetectedEvent
  | SuggestionGeneratedEvent
  | MetricsUpdatedEvent
  | ErrorEvent;


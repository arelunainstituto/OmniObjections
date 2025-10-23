export enum SuggestionType {
  OBJECTION_RESPONSE = 'objection_response',
  INFORMATION = 'information',
  NEXT_STEP = 'next_step',
  WARNING = 'warning',
}

export interface Suggestion {
  id: string;
  callId: string;
  type: SuggestionType;
  timestamp: Date;
  objection?: string;
  objectionCategory?: string;
  suggestion: string;
  sources: SuggestionSource[];
  confidence: number;
  used: boolean;
  feedback?: 'helpful' | 'not_helpful';
}

export interface SuggestionSource {
  type: 'knowledge' | 'objection' | 'context';
  id: string;
  title: string;
  relevanceScore: number;
}

export interface GenerateSuggestionDto {
  callId: string;
  context: string;
  objectionDetected?: {
    category: string;
    text: string;
  };
  conversationHistory: string[];
}

export interface SuggestionFeedbackDto {
  suggestionId: string;
  feedback: 'helpful' | 'not_helpful';
}


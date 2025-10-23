import { create } from 'zustand';

// Tipos locais para evitar problemas de importação
type TranscriptSegment = {
  id: string;
  text: string;
  speaker: 'lead' | 'comercial';
  timestamp: number;
  startTime: number;
  endTime: number;
  confidence?: number;
  objectionDetected?: boolean;
  objectionCategory?: string;
};

type Suggestion = {
  id: string;
  callId: string;
  type: string;
  timestamp: Date;
  objection?: string;
  objectionCategory?: string;
  suggestion: string;
  sources: Array<{
    type: string;
    id: string;
    title: string;
    relevanceScore: number;
  }>;
  confidence: number;
  used: boolean;
  feedback?: 'helpful' | 'not_helpful';
};

type CallMetrics = {
  duration: number;
  segmentsCount: number;
  objectionsCount: number;
  suggestionsCount: number;
  leadTalkTime: number;
  comercialTalkTime: number;
  sentimentScore?: number;
  interruptionsCount?: number;
};

interface CallState {
  // Estado da chamada
  isActive: boolean;
  callId: string | null;
  leadName: string | null;
  startTime: Date | null;

  // Transcrição
  transcript: TranscriptSegment[];

  // Sugestões
  suggestions: Suggestion[];
  activeSuggestion: Suggestion | null;

  // Métricas
  metrics: CallMetrics | null;

  // Ações
  startCall: (agentId: string, leadName: string) => void;
  endCall: () => void;
  addTranscriptSegment: (segment: TranscriptSegment) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  setActiveSuggestion: (suggestion: Suggestion | null) => void;
  updateMetrics: (metrics: CallMetrics) => void;
  reset: () => void;
}

const initialState = {
  isActive: false,
  callId: null,
  leadName: null,
  startTime: null,
  transcript: [],
  suggestions: [],
  activeSuggestion: null,
  metrics: null,
};

export const useCallStore = create<CallState>((set) => ({
  ...initialState,

  startCall: (agentId: string, leadName: string) => {
    set({
      isActive: true,
      callId: `call_${Date.now()}`,
      leadName,
      startTime: new Date(),
      transcript: [],
      suggestions: [],
      metrics: null,
    });
  },

  endCall: () => {
    set({
      isActive: false,
    });
  },

  addTranscriptSegment: (segment: TranscriptSegment) => {
    set((state) => ({
      transcript: [...state.transcript, segment],
    }));
  },

  addSuggestion: (suggestion: Suggestion) => {
    set((state) => ({
      suggestions: [...state.suggestions, suggestion],
      activeSuggestion: suggestion,
    }));
  },

  setActiveSuggestion: (suggestion: Suggestion | null) => {
    set({ activeSuggestion: suggestion });
  },

  updateMetrics: (metrics: CallMetrics) => {
    set({ metrics });
  },

  reset: () => {
    set(initialState);
  },
}));


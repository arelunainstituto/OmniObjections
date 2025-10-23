export interface AIConfig {
  openaiApiKey: string;
  assistantId?: string;
  whisperModel?: string;
  gptModel?: string;
  maxTokens?: number;
  temperature?: number;
  language?: string;
}

export const DEFAULT_AI_CONFIG: Partial<AIConfig> = {
  assistantId: 'asst_7RhlVBzVzK2AEKo0i9pPO67N', // Assistente Areluna
  whisperModel: 'whisper-1',
  gptModel: 'gpt-4-turbo-preview',
  maxTokens: 500,
  temperature: 0.7,
  language: 'pt',
};

export function getAIConfig(): AIConfig {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  // Permitir override do Assistant ID via env
  const assistantId = process.env.OPENAI_ASSISTANT_ID || DEFAULT_AI_CONFIG.assistantId;

  return {
    openaiApiKey: apiKey,
    assistantId,
    ...DEFAULT_AI_CONFIG,
  } as AIConfig;
}


/**
 * Suggestion Engine Service
 * Gera sugestões contextuais para responder objeções
 */

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { AIConfig, getAIConfig } from '../config';
import {
  Suggestion,
  SuggestionType,
  SuggestionSource,
  KnowledgeItem,
  Objection,
  TranscriptSegment,
} from '@omni/types';

export interface GenerateSuggestionInput {
  callId: string;
  objection?: Objection;
  objectionText?: string;
  conversationHistory: TranscriptSegment[];
  knowledgeItems: KnowledgeItem[];
}

export class SuggestionEngineService {
  private openai: OpenAI;
  private config: AIConfig;

  constructor(config?: AIConfig) {
    this.config = config || getAIConfig();
    this.openai = new OpenAI({
      apiKey: this.config.openaiApiKey,
    });
  }

  /**
   * Gera uma sugestão de resposta
   */
  async generate(input: GenerateSuggestionInput): Promise<Suggestion> {
    const { callId, objection, objectionText, conversationHistory, knowledgeItems } = input;

    // Construir o contexto para o GPT
    const context = this.buildContext(conversationHistory, knowledgeItems);
    
    // Construir o prompt
    const prompt = this.buildPrompt(objection, objectionText, context);

    // Gerar sugestão usando GPT
    const suggestion = await this.generateWithGPT(prompt);

    // Identificar fontes relevantes
    const sources = this.identifySources(suggestion, knowledgeItems, objection);

    return {
      id: `sug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      callId,
      type: objection ? SuggestionType.OBJECTION_RESPONSE : SuggestionType.INFORMATION,
      timestamp: new Date(),
      objection: objectionText,
      objectionCategory: objection?.category,
      suggestion,
      sources,
      confidence: this.calculateConfidence(suggestion, sources),
      used: false,
    };
  }

  /**
   * Gera múltiplas sugestões alternativas
   */
  async generateAlternatives(
    input: GenerateSuggestionInput,
    count = 3
  ): Promise<Suggestion[]> {
    const suggestions: Suggestion[] = [];

    for (let i = 0; i < count; i++) {
      const suggestion = await this.generate({
        ...input,
      });
      suggestions.push(suggestion);
    }

    return suggestions;
  }

  /**
   * Constrói o contexto da conversa
   */
  private buildContext(
    history: TranscriptSegment[],
    knowledge: KnowledgeItem[]
  ): string {
    const conversationContext = history
      .slice(-5) // Últimas 5 falas
      .map((seg) => `${seg.speaker === 'lead' ? 'Lead' : 'Comercial'}: ${seg.text}`)
      .join('\n');

    const knowledgeContext = knowledge
      .slice(0, 3) // Top 3 itens mais relevantes
      .map((item) => `[${item.type}] ${item.title}: ${item.content}`)
      .join('\n\n');

    return `
CONVERSA RECENTE:
${conversationContext}

INFORMAÇÕES DA CLÍNICA ARELUNA:
${knowledgeContext}
    `.trim();
  }

  /**
   * Constrói o prompt para o GPT
   */
  private buildPrompt(
    objection?: Objection,
    objectionText?: string,
    context?: string
  ): string {
    if (objection) {
      return `
Você é um assistente especializado em vendas da Clínica Areluna, ajudando comerciais durante videochamadas.

O lead acabou de expressar uma objeção do tipo "${objection.category}":
"${objectionText}"

Resposta padrão para esta objeção:
"${objection.defaultReply}"

Contexto da conversa:
${context}

TAREFA: Gere uma resposta personalizada, natural e persuasiva que:
1. Demonstre empatia com a preocupação do lead
2. Use as informações da clínica mencionadas no contexto
3. Seja conversacional e não soar como um script
4. Conduza a conversa para o próximo passo
5. Tenha no máximo 2-3 frases

Resposta sugerida:
      `.trim();
    }

    return `
Você é um assistente especializado em vendas da Clínica Areluna.

Contexto:
${context}

TAREFA: Gere uma sugestão útil para o comercial continuar a conversa de forma natural.

Sugestão:
    `.trim();
  }

  /**
   * Gera sugestão usando GPT
   */
  private async generateWithGPT(prompt: string): Promise<string> {
    try {
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content:
            'Você é um assistente de vendas especializado em clínicas de estética e dermatologia. Suas respostas devem ser em português, naturais, empáticas e focadas em ajudar o comercial a fechar vendas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.config.gptModel || 'gpt-4-turbo-preview',
        messages,
        max_tokens: this.config.maxTokens || 500,
        temperature: this.config.temperature || 0.7,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      });

      return completion.choices[0]?.message?.content?.trim() || '';
    } catch (error: any) {
      console.error('Erro ao gerar sugestão com GPT:', error);
      throw new Error(`Falha na geração: ${error.message}`);
    }
  }

  /**
   * Identifica as fontes usadas na sugestão
   */
  private identifySources(
    suggestion: string,
    knowledge: KnowledgeItem[],
    objection?: Objection
  ): SuggestionSource[] {
    const sources: SuggestionSource[] = [];
    const suggestionLower = suggestion.toLowerCase();

    // Adicionar objeção como fonte
    if (objection) {
      sources.push({
        type: 'objection',
        id: objection.id,
        title: `Objeção: ${objection.keyword}`,
        relevanceScore: 1.0,
      });
    }

    // Procurar itens de conhecimento mencionados
    knowledge.forEach((item) => {
      const titleLower = item.title.toLowerCase();
      const contentWords = item.content.toLowerCase().split(' ').slice(0, 10);

      let relevanceScore = 0;

      // Verificar se o título é mencionado
      if (suggestionLower.includes(titleLower)) {
        relevanceScore += 0.5;
      }

      // Verificar se palavras do conteúdo são mencionadas
      const matchedWords = contentWords.filter((word) =>
        suggestionLower.includes(word)
      ).length;
      relevanceScore += (matchedWords / contentWords.length) * 0.5;

      if (relevanceScore >= 0.3) {
        sources.push({
          type: 'knowledge',
          id: item.id,
          title: item.title,
          relevanceScore,
        });
      }
    });

    // Ordenar por relevância
    return sources.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
  }

  /**
   * Calcula a confiança da sugestão
   */
  private calculateConfidence(suggestion: string, sources: SuggestionSource[]): number {
    let confidence = 0.5; // Base

    // Aumentar confiança baseado no número de fontes
    confidence += Math.min(sources.length * 0.1, 0.3);

    // Aumentar confiança baseado na relevância das fontes
    const avgRelevance =
      sources.reduce((sum, s) => sum + s.relevanceScore, 0) / (sources.length || 1);
    confidence += avgRelevance * 0.2;

    // Penalizar sugestões muito curtas ou muito longas
    const wordCount = suggestion.split(' ').length;
    if (wordCount < 10 || wordCount > 100) {
      confidence -= 0.1;
    }

    return Math.max(0, Math.min(confidence, 1));
  }
}


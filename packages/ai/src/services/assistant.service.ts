/**
 * OpenAI Assistant Service
 * Integração com o Assistente OpenAI específico da Areluna
 */

import OpenAI from 'openai';
import { AIConfig, getAIConfig } from '../config';

export interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AssistantResponse {
  message: string;
  threadId: string;
  runId: string;
  metadata?: Record<string, any>;
}

export class AssistantService {
  private openai: OpenAI;
  private config: AIConfig;
  private assistantId: string;

  constructor(config?: AIConfig) {
    this.config = config || getAIConfig();
    this.openai = new OpenAI({
      apiKey: this.config.openaiApiKey,
    });
    this.assistantId = this.config.assistantId || '';

    if (!this.assistantId) {
      throw new Error('Assistant ID is required');
    }
  }

  /**
   * Cria uma nova thread de conversa
   */
  async createThread(): Promise<string> {
    try {
      const thread = await this.openai.beta.threads.create();
      return thread.id;
    } catch (error: any) {
      console.error('Erro ao criar thread:', error);
      throw new Error(`Falha ao criar thread: ${error.message}`);
    }
  }

  /**
   * Adiciona uma mensagem à thread
   */
  async addMessage(threadId: string, content: string): Promise<void> {
    try {
      await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content,
      });
    } catch (error: any) {
      console.error('Erro ao adicionar mensagem:', error);
      throw new Error(`Falha ao adicionar mensagem: ${error.message}`);
    }
  }

  /**
   * Executa o assistente e aguarda resposta
   */
  async runAssistant(
    threadId: string,
    instructions?: string
  ): Promise<AssistantResponse> {
    try {
      // Criar run
      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
        instructions: instructions || undefined,
      });

      // Aguardar conclusão
      const completedRun = await this.waitForCompletion(threadId, run.id);

      // Buscar mensagens
      const messages = await this.openai.beta.threads.messages.list(threadId, {
        order: 'desc',
        limit: 1,
      });

      const lastMessage = messages.data[0];
      const messageContent = lastMessage.content[0];

      let responseText = '';
      if (messageContent.type === 'text') {
        responseText = messageContent.text.value;
      }

      return {
        message: responseText,
        threadId,
        runId: completedRun.id,
        metadata: completedRun.metadata,
      };
    } catch (error: any) {
      console.error('Erro ao executar assistente:', error);
      throw new Error(`Falha na execução do assistente: ${error.message}`);
    }
  }

  /**
   * Aguarda a conclusão do run
   */
  private async waitForCompletion(
    threadId: string,
    runId: string,
    maxAttempts = 30
  ): Promise<any> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const run = await this.openai.beta.threads.runs.retrieve(threadId, runId);

      if (run.status === 'completed') {
        return run;
      }

      if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
        throw new Error(`Run falhou com status: ${run.status}`);
      }

      // Aguardar 1 segundo antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    throw new Error('Timeout aguardando resposta do assistente');
  }

  /**
   * Gera sugestão usando o assistente
   * Método específico para o contexto de objeções
   */
  async generateSuggestion(
    objectionText: string,
    conversationContext: string[],
    knowledgeContext: string
  ): Promise<string> {
    try {
      // Criar thread
      const threadId = await this.createThread();

      // Construir prompt contextualizado
      const prompt = this.buildPrompt(objectionText, conversationContext, knowledgeContext);

      // Adicionar mensagem
      await this.addMessage(threadId, prompt);

      // Executar assistente
      const response = await this.runAssistant(
        threadId,
        'Você é um especialista em vendas da Clínica Areluna. Forneça uma resposta prática e empática para a objeção do lead.'
      );

      return response.message;
    } catch (error: any) {
      console.error('Erro ao gerar sugestão:', error);
      throw new Error(`Falha ao gerar sugestão: ${error.message}`);
    }
  }

  /**
   * Constrói o prompt com contexto
   */
  private buildPrompt(
    objectionText: string,
    conversationContext: string[],
    knowledgeContext: string
  ): string {
    return `
CONTEXTO DA CONVERSA:
${conversationContext.slice(-5).join('\n')}

OBJEÇÃO DO LEAD:
"${objectionText}"

INFORMAÇÕES RELEVANTES DA CLÍNICA:
${knowledgeContext}

Por favor, forneça uma resposta:
1. Empática e natural
2. Que aborde diretamente a objeção
3. Use as informações da clínica mencionadas
4. Máximo 2-3 frases
5. Em português do Brasil

Resposta:
    `.trim();
  }

  /**
   * Recupera informações do assistente
   */
  async getAssistantInfo(): Promise<any> {
    try {
      const assistant = await this.openai.beta.assistants.retrieve(this.assistantId);
      return {
        id: assistant.id,
        name: assistant.name,
        model: assistant.model,
        instructions: assistant.instructions,
        tools: assistant.tools,
      };
    } catch (error: any) {
      console.error('Erro ao recuperar informações do assistente:', error);
      throw new Error(`Falha ao recuperar assistente: ${error.message}`);
    }
  }

  /**
   * Testa a conexão com o assistente
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getAssistantInfo();
      return true;
    } catch (error) {
      return false;
    }
  }
}


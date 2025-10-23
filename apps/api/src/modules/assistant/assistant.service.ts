import { Injectable } from '@nestjs/common';
import { AssistantService as AIAssistantService } from '@omni/ai';
import { getDemoResponse, DEMO_ASSISTANT_INFO } from './demo-responses';

@Injectable()
export class AssistantService {
  private aiAssistant: AIAssistantService | null = null;
  private demoMode: boolean = false;

  constructor() {
    try {
      // Tentar inicializar com API real
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey || apiKey.includes('SUBSTITUA')) {
        console.log('⚠️  OpenAI API Key não configurada - usando modo DEMO');
        this.demoMode = true;
      } else {
        this.aiAssistant = new AIAssistantService();
        console.log('✅ OpenAI Assistant configurado com sucesso');
      }
    } catch (error) {
      console.log('⚠️  Erro ao inicializar Assistant - usando modo DEMO');
      this.demoMode = true;
    }
  }

  async getAssistantInfo(): Promise<any> {
    if (this.demoMode) {
      return DEMO_ASSISTANT_INFO;
    }
    return this.aiAssistant!.getAssistantInfo();
  }

  async testConnection(): Promise<boolean> {
    if (this.demoMode) {
      return true; // Demo sempre conecta
    }
    return this.aiAssistant!.testConnection();
  }

  async generateSuggestion(
    objectionText: string,
    conversationContext: string[],
    knowledgeContext: string
  ): Promise<string> {
    if (this.demoMode) {
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return getDemoResponse(objectionText);
    }

    return this.aiAssistant!.generateSuggestion(
      objectionText,
      conversationContext,
      knowledgeContext
    );
  }

  isDemoMode(): boolean {
    return this.demoMode;
  }
}


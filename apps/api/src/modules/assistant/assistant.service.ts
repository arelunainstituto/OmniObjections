import { Injectable } from '@nestjs/common';
import { AssistantService as AIAssistantService } from '@omni/ai';

@Injectable()
export class AssistantService {
  private aiAssistant: AIAssistantService;

  constructor() {
    this.aiAssistant = new AIAssistantService();
  }

  async getAssistantInfo(): Promise<any> {
    return this.aiAssistant.getAssistantInfo();
  }

  async testConnection(): Promise<boolean> {
    return this.aiAssistant.testConnection();
  }

  async generateSuggestion(
    objectionText: string,
    conversationContext: string[],
    knowledgeContext: string
  ): Promise<string> {
    return this.aiAssistant.generateSuggestion(
      objectionText,
      conversationContext,
      knowledgeContext
    );
  }
}


import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('info')
  async getInfo() {
    const info = await this.assistantService.getAssistantInfo();
    return {
      ...info,
      demoMode: this.assistantService.isDemoMode(),
    };
  }

  @Get('test')
  async testConnection() {
    const isConnected = await this.assistantService.testConnection();
    const isDemo = this.assistantService.isDemoMode();

    return {
      connected: isConnected,
      assistantId: process.env.OPENAI_ASSISTANT_ID,
      mode: isDemo ? 'DEMO' : 'PRODUCTION',
      message: isDemo
        ? '🎭 Rodando em modo DEMO. Configure OPENAI_API_KEY para usar a API real.'
        : '✅ Conexão com o Assistente OpenAI estabelecida com sucesso!',
    };
  }

  @Post('generate')
  async generateSuggestion(
    @Body()
    dto: {
      objectionText: string;
      conversationContext: string[];
      knowledgeContext: string;
    }
  ) {
    const suggestion = await this.assistantService.generateSuggestion(
      dto.objectionText,
      dto.conversationContext,
      dto.knowledgeContext
    );

    return {
      suggestion,
      timestamp: new Date(),
      mode: this.assistantService.isDemoMode() ? 'DEMO' : 'PRODUCTION',
    };
  }
}


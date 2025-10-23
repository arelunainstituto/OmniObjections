import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('info')
  async getInfo() {
    return this.assistantService.getAssistantInfo();
  }

  @Get('test')
  async testConnection() {
    const isConnected = await this.assistantService.testConnection();
    return {
      connected: isConnected,
      assistantId: process.env.OPENAI_ASSISTANT_ID,
      message: isConnected
        ? 'Conexão com o Assistente OpenAI estabelecida com sucesso!'
        : 'Falha ao conectar com o Assistente OpenAI',
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
    };
  }
}


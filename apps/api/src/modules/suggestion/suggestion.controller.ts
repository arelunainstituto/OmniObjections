import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { SuggestionService } from './suggestion.service';
import { GenerateSuggestionDto, SuggestionFeedbackDto } from '@omni/types';

@Controller('suggestions')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  @Get('call/:callId')
  async findByCallId(@Param('callId') callId: string) {
    return this.suggestionService.findByCallId(callId);
  }

  @Get('call/:callId/stats')
  async getStats(@Param('callId') callId: string) {
    return this.suggestionService.getStats(callId);
  }

  @Post('generate')
  async generate(@Body() dto: GenerateSuggestionDto) {
    return this.suggestionService.generate(dto);
  }

  @Patch(':id/used')
  async markAsUsed(@Param('id') id: string) {
    return this.suggestionService.markAsUsed(id);
  }

  @Patch(':id/feedback')
  async addFeedback(@Param('id') _id: string, @Body() dto: SuggestionFeedbackDto) {
    return this.suggestionService.addFeedback(dto);
  }
}


import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CallService } from './call.service';
import { CreateCallDto, UpdateCallDto } from '@omni/types';

@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post()
  async create(@Body() dto: CreateCallDto) {
    return this.callService.create(dto);
  }

  @Get()
  async findAll(@Query('agentId') agentId?: string) {
    if (agentId) {
      return this.callService.findByAgentId(agentId);
    }
    return this.callService.findActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.callService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCallDto) {
    return this.callService.update(id, dto);
  }

  @Get(':id/metrics')
  async getMetrics(@Param('id') id: string) {
    return this.callService.getMetrics(id);
  }

  @Get(':id/transcript')
  async getTranscript(@Param('id') id: string) {
    return this.callService.getTranscript(id);
  }

  @Get('agent/:agentId/stats')
  async getAgentStats(@Param('agentId') agentId: string) {
    return this.callService.getAgentStats(agentId);
  }
}


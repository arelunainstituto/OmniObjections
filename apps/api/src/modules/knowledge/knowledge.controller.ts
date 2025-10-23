import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto, UpdateKnowledgeDto, SearchKnowledgeDto } from '@omni/types';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  async findAll(@Query('type') type?: string) {
    return this.knowledgeService.findAll(type as any);
  }

  @Get('search')
  async search(@Query() dto: SearchKnowledgeDto) {
    return this.knowledgeService.search(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.knowledgeService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateKnowledgeDto) {
    return this.knowledgeService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateKnowledgeDto) {
    return this.knowledgeService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.knowledgeService.delete(id);
  }
}


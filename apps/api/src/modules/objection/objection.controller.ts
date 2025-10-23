import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ObjectionService } from './objection.service';
import { CreateObjectionDto, UpdateObjectionDto } from '@omni/types';

@Controller('objections')
export class ObjectionController {
  constructor(private readonly objectionService: ObjectionService) {}

  @Get()
  async findAll(@Query('active') active?: string) {
    const activeOnly = active === 'true';
    return this.objectionService.findAll(activeOnly);
  }

  @Get('category/:category')
  async findByCategory(@Param('category') category: string) {
    return this.objectionService.findByCategory(category as any);
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return this.objectionService.searchByKeyword(keyword);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.objectionService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateObjectionDto) {
    return this.objectionService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateObjectionDto) {
    return this.objectionService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.objectionService.delete(id);
  }
}


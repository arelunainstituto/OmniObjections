import { Module } from '@nestjs/common';
import { SuggestionController } from './suggestion.controller';
import { SuggestionService } from './suggestion.service';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { ObjectionModule } from '../objection/objection.module';

@Module({
  imports: [KnowledgeModule, ObjectionModule],
  controllers: [SuggestionController],
  providers: [SuggestionService],
  exports: [SuggestionService],
})
export class SuggestionModule {}


import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { CallModule } from '../call/call.module';
import { SuggestionModule } from '../suggestion/suggestion.module';
import { KnowledgeModule } from '../knowledge/knowledge.module';
import { ObjectionModule } from '../objection/objection.module';

@Module({
  imports: [CallModule, SuggestionModule, KnowledgeModule, ObjectionModule],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CallModule } from './modules/call/call.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { ObjectionModule } from './modules/objection/objection.module';
import { SuggestionModule } from './modules/suggestion/suggestion.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 100, // 100 requisições
      },
    ]),
    CallModule,
    KnowledgeModule,
    ObjectionModule,
    SuggestionModule,
    RealtimeModule,
    AssistantModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}


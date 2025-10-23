import { Module } from '@nestjs/common';
import { ObjectionController } from './objection.controller';
import { ObjectionService } from './objection.service';

@Module({
  controllers: [ObjectionController],
  providers: [ObjectionService],
  exports: [ObjectionService],
})
export class ObjectionModule {}


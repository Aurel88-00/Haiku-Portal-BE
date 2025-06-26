import { Module } from '@nestjs/common';
import { HaikuController } from 'src/Controllers/haiku/haiku.controller';
import { HaikuService } from 'src/Services/haiku/haiku.service';

@Module({
  imports: [],
  controllers: [HaikuController],
  providers: [HaikuService],
})
export class HaikuModule {}

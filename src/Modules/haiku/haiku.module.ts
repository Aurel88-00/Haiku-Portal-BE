import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HaikuController } from 'src/Controllers/haiku/haiku.controller';
import { AuthorSchema } from 'src/lib/schemas/author.schema';
import { HaikuSchema } from 'src/lib/schemas/haiku.schema';
import { HaikuService } from 'src/Services/haiku/haiku.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Haiku',
        schema: HaikuSchema,
      },
      {
        name: 'Author',
        schema: AuthorSchema,
      },
    ]),
  ],
  controllers: [HaikuController],
  providers: [HaikuService],
})
export class HaikuModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorController } from 'src/Controllers/author/author.controller';
import { AuthorSchema } from 'src/lib/schemas/author.schema';
import { HaikuSchema } from 'src/lib/schemas/haiku.schema';
import { AuthorService } from 'src/Services/author/author.service';

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
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}

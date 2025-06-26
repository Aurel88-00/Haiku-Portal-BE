import { Module } from '@nestjs/common';
import { AuthorController } from 'src/Controllers/author/author.controller';
import { AuthorService } from 'src/Services/author/author.service';

@Module({
  imports: [],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AuthorService } from 'src/Services/author/author.service';
import { AuthorDto } from 'src/lib/dtos/author.dto';

@Controller('/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAuthors(@Query('page') page: number = 1 , @Query('limit') limit: number = 10) {
    try {
      const authors = await this.authorService.findAll(page, limit);
      return {
        message: 'Success',
        noOfAuthors: Array.from(authors).length,
        data: authors,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAuthor(@Param('id') id: Types.ObjectId) {
    try {
      const author = await this.authorService.findOne(id);
      return {
        message: 'Success',
        data: author,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAuthor(@Body() authorDto: AuthorDto) {
    try {
      const author = await this.authorService.create(authorDto);
      return {
        message: 'Success',
        data: author,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAuthor(
    @Param('id') id: Types.ObjectId,
    @Body() authorDto: AuthorDto,
  ) {
    try {
      const author = await this.authorService.update(id, authorDto);
      return {
        message: 'Success',
        data: author,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: Types.ObjectId) {
    try {
      await this.authorService.remove(id);
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}


import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Types } from 'mongoose';
import { HaikuDto } from 'src/lib/dtos/haiku.dto';
import { HaikuService } from 'src/Services/haiku/haiku.service';

@Controller('/haikus')
@UseInterceptors(CacheInterceptor)
export class HaikuController {
  constructor(private readonly haikuService: HaikuService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHaikus(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const haikus = await this.haikuService.findAll(page, limit);
      return {
        message: 'Success',
        noOfHaikus: Array.from(haikus).length,
        data: haikus,
      };
    } catch (error: any) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getHaiku(@Param('id') id: Types.ObjectId) {
    try {
      const haiku = await this.haikuService.findOne(id);
      return {
        message: 'Success',
        data: haiku,
      };
    } catch (error: any) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createHaiku(@Body() haikuDto: HaikuDto) {
    try {
      const haiku = await this.haikuService.create(haikuDto);
      return {
        message: 'Success',
        data: haiku,
      };
    } catch (error: any) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateHaiku(
    @Param('id') id: Types.ObjectId,
    @Body() haikuDto: HaikuDto,
  ) {
    try {
      const haiku = await this.haikuService.update(id, haikuDto);
      return {
        message: 'Success',
        data: haiku,
      };
    } catch (error: any) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteHaiku(@Param('id') id: Types.ObjectId) {
    try {
      return this.haikuService.remove(id);
    } catch (error: any) {
      throw new HttpException(error?.message, error?.status);
    }
  }
}


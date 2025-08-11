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
} from '@nestjs/common';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Types } from 'mongoose';
import { HaikuDto } from 'src/lib/dtos/haiku.dto';
import { HaikuService } from 'src/Services/haiku/haiku.service';

@Controller('/haikus')
export class HaikuController {
  constructor(private readonly haikuService: HaikuService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getHaikus() {
    try {
      const haikus = await this.haikuService.findAll();
      return {
        message: 'Success',
        data: haikus,
      };
    } catch (error) {
      throw new ExceptionsHandler(error);
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
    } catch (error) {
      throw new ExceptionsHandler(error);
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
    } catch (error) {
      throw new ExceptionsHandler(error);
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
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteHaiku(@Param('id') id: Types.ObjectId) {
    try {
      return this.haikuService.remove(id);
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }
}


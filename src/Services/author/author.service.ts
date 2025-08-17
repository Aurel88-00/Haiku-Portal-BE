import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { QueryService } from 'src/lib/common/query-service.class';
import { AuthorDto } from 'src/lib/dtos/author.dto';
import { IAuthor } from 'src/lib/interfaces/author.interface';
import { AuthorDocument } from 'src/lib/schemas/author.schema';
import { HaikuDocument } from 'src/lib/schemas/haiku.schema';

@Injectable()
export class AuthorService extends QueryService<AuthorDocument> {
  constructor(
    @InjectModel('Haiku') private haikuModel: Model<HaikuDocument>,
    @InjectModel('Author') private authorModel: Model<AuthorDocument>,
  ) {
    super(authorModel)
  }

  async findAll(
    page?: number,
    limit?: number,
    populateKey = 'haikus'
  ): Promise<IAuthor[]> {
    return this.PaginationPattern(page, limit, populateKey) as unknown as IAuthor[];
  }

  async findOne(id: Types.ObjectId): Promise<IAuthor> {
    const author = this.authorModel.findById(id).populate('haikus').exec();
    return author as unknown as IAuthor;
  }

  async create(createAuthorDto: AuthorDto): Promise<IAuthor> {
    const createdAuthor = new this.authorModel(createAuthorDto);
    try {
      return (await createdAuthor.save()) as unknown as IAuthor;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Author with name "${createAuthorDto.name}" already exists.`,
        );
      }
      throw new BadRequestException(`Error creating author: ${error.message}`);
    }
  }

  async update(
    id: Types.ObjectId,
    updateAuthorDto: AuthorDto,
  ): Promise<IAuthor> {
    const updatedAuthor = await this.authorModel
      .findByIdAndUpdate(id, updateAuthorDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedAuthor) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }
    return updatedAuthor as unknown as IAuthor;
  }

  async remove(id: Types.ObjectId): Promise<boolean> {
    const author = await this.authorModel.findById(id).exec();
    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found.`);
    }

    if (author.haikus && author.haikus.length > 0) {
      throw new BadRequestException(
        `Author "${author.name}" has ${author.haikus.length} associated haiku(s). Cannot delete author with existing haikus.`,
      );
    }

    const result = await this.authorModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Author with ID "${id}" could not be deleted.`,
      );
    }
    return true;
  }
}


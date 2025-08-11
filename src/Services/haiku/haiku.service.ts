import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { HaikuDto } from 'src/lib/dtos/haiku.dto';
import { IHaiku } from 'src/lib/interfaces/haiku.interface';
import { AuthorDocument } from 'src/lib/schemas/author.schema';
import { HaikuDocument } from 'src/lib/schemas/haiku.schema';

@Injectable()
export class HaikuService {
  constructor(
    @InjectModel('Haiku') private haikuModel: Model<HaikuDocument>,
    @InjectModel('Author') private authorModel: Model<AuthorDocument>,
  ) {}

  async findAll(): Promise<IHaiku[]> {
    const haikus = this.haikuModel.find().populate('author').exec();
    return haikus as unknown as IHaiku[];
  }

  async findOne(id: Types.ObjectId): Promise<IHaiku> {
    const haiku = this.haikuModel.findById(id).populate('author').exec();
    return haiku as unknown as IHaiku;
  }

  async create(haikuDto: HaikuDto) {
    const { author: authorId, ...haikuData } = haikuDto;

    // check if the author exists
    const author = await this.authorModel.findById(authorId);
    if (!author) {
      throw new NotFoundException(`Author with ID "${authorId}" not found.`);
    }

    // create the haiku
    const createdHaiku = new this.haikuModel({
      ...haikuData,
      author: authorId, // Store the ObjectId reference
    });

    try {
      const savedHaiku = await createdHaiku.save();

      // 3. Add the haiku to the author's haikus array
      author.haikus.push(savedHaiku);
      await author.save();

      return savedHaiku;
    } catch (error) {
      // Handle potential errors during save (e.g., validation errors from Mongoose)
      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }
      throw new ConflictException(`Error creating haiku: ${error.message}`);
    }
  }

  async update(id: Types.ObjectId, updateHaikuDto: HaikuDto): Promise<IHaiku> {
    // Prevent updating the author field directly through this method to avoid complex relationship management
    if (updateHaikuDto.author) {
      throw new BadRequestException(
        'Cannot update author directly. Create a new haiku or handle author change explicitly.',
      );
    }

    const updatedHaiku = await this.haikuModel
      .findByIdAndUpdate(id, updateHaikuDto, { new: true, runValidators: true })
      .exec();

    if (!updatedHaiku) {
      throw new NotFoundException(`Haiku with ID "${id}" not found.`);
    }
    return updatedHaiku as unknown as IHaiku;
  }

  async remove(id: Types.ObjectId): Promise<boolean> {
    const haikuToDelete = await this.haikuModel.findById(id).exec();

    if (!haikuToDelete) {
      throw new NotFoundException(`Haiku with ID "${id}" not found.`);
    }

    // Remove the haiku's _id from the associated author's haikus array
    await this.authorModel
      .findByIdAndUpdate(
        haikuToDelete.author,
        { $pull: { haikus: haikuToDelete._id } },
        { new: true },
      )
      .exec();

    const result = await this.haikuModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Haiku with ID "${id}" could not be deleted.`,
      );
    }
    return true;
  }
}


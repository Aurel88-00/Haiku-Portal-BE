import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { Author } from './author.schema';

@Schema({ timestamps: true })
export class Haiku {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author: Author;

  @Prop({
    required: true,
    validate: {
      validator: function (haiku: string[]) {
        return Array.isArray(haiku) && haiku.length === 3;
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid haiku. A haiku must have 3 lines.`,
    },
  })
  lines: string[];

  @Prop({ trim: true, default: 'Japanese' })
  originalLanguage: string;

  @Prop({ required: true, min: 1500, max: new Date().getFullYear() })
  yearWritten: number;
}

export type HaikuDocument = HydratedDocument<Haiku>;

export const HaikuSchema = SchemaFactory.createForClass(Haiku);

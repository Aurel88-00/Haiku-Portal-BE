import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { Haiku } from './haiku.schema';

@Schema({ timestamps: true })
export class Author {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  bio: string;

  @Prop({ required: true, type: Number })
  birthYear: number;

  @Prop({ type: Number })
  deathYear: number;

  @Prop({ default: 'Edo Period', trim: true })
  era: string;

  @Prop({ default: 'Japanese', trim: true })
  nationality: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Haiku' }] })
  haikus: Haiku[];
}

export type AuthorDocument = HydratedDocument<Author>;
export const AuthorSchema = SchemaFactory.createForClass(Author);

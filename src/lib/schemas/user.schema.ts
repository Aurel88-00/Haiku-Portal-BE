import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '../enums/roles.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HaikuController } from 'src/Controllers/haiku/haiku.controller';
import { AuthorSchema } from 'src/lib/schemas/author.schema';
import { HaikuSchema } from 'src/lib/schemas/haiku.schema';
import { RefreshTokenSchema } from 'src/lib/schemas/refresh-token.schema';
import { UserSchema } from 'src/lib/schemas/user.schema';
import { AuthService } from 'src/Services/auth/auth.service';
import { HaikuService } from 'src/Services/haiku/haiku.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'RefreshToken', schema: RefreshTokenSchema },
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
  controllers: [HaikuController],
  providers: [AuthService, HaikuService],
})
export class HaikuModule {}


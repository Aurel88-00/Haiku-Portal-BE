import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorController } from 'src/Controllers/author/author.controller';
import { AuthorSchema } from 'src/lib/schemas/author.schema';
import { HaikuSchema } from 'src/lib/schemas/haiku.schema';
import { AuthService } from 'src/Services/auth/auth.service';
import { AuthorService } from 'src/Services/author/author.service';
import { AuthModule } from '../auth/auth.module';
import { RefreshTokenSchema } from 'src/lib/schemas/refresh-token.schema';
import { UserSchema } from 'src/lib/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
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
  controllers: [AuthorController],
  providers: [AuthService, AuthorService],
})
export class AuthorModule {}


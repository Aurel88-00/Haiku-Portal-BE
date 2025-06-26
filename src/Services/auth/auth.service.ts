import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { IUser } from 'src/lib/interfaces/user.interface';
import * as argon2 from 'argon2';
import { UserDTO } from 'src/lib/dtos/user.dto';
import { LoginDTO } from 'src/lib/dtos/login.dto';
import { IRefreshToken } from 'src/lib/interfaces/refresh-token.interface';
import { generateString } from 'src/utils/generateString';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('RefreshToken')
    private refreshTokenModel: Model<IRefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    user: UserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password, role, username } = user;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new this.userModel({
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const accessTokenPayload = {
      sub: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);

    const refreshTokenString = generateString(32);
    await this.storeRefreshToken(refreshTokenString, newUser._id);

    return { accessToken, refreshToken: refreshTokenString };
  }

  async login(
    user: LoginDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = user;
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) {
      throw new ConflictException(`User with email ${email} not found!`);
    }

    const isValid = await argon2.verify(existingUser.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const accessTokenPayload = {
      sub: existingUser._id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const accessToken = await this.jwtService.signAsync(accessTokenPayload);
    const refreshTokenString = generateString(32);
    await this.storeRefreshToken(refreshTokenString, existingUser._id);

    return { accessToken, refreshToken: refreshTokenString };
  }

  async storeRefreshToken(token: string, userId: mongoose.Types.ObjectId) {
    await this.refreshTokenModel.create({
      token,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
  }

  async refreshToken(oldRefreshTokenString: string): Promise<{
    accessToken: string;
    refreshToken: string;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    userPayload: IUser | any;
  }> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: oldRefreshTokenString,
    });

    if (!refreshTokenDoc) {
      throw new UnauthorizedException('Refresh token not found or invalid.');
    }

    if (refreshTokenDoc.expiresAt < new Date()) {
      // Delete expired token to prevent reuse
      await this.refreshTokenModel.deleteOne({ _id: refreshTokenDoc._id });
      throw new UnauthorizedException('Refresh token expired.');
    }

    // Fetch the user associated with the token
    const user = await this.userModel.findById(refreshTokenDoc.userId);
    if (!user) {
      // Orphaned token, should be cleaned up
      await this.refreshTokenModel.deleteOne({ _id: refreshTokenDoc._id });
      throw new UnauthorizedException(
        'User associated with refresh token not found.',
      );
    }

    // Generate new access token
    const newAccessTokenPayload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    const newAccessToken = await this.jwtService.signAsync(
      newAccessTokenPayload,
    );

    // Rotate refresh token: Invalidate old, create new
    await this.refreshTokenModel.deleteOne({ _id: refreshTokenDoc._id });

    const newRefreshTokenString = generateString(32); // Generate a new refresh token
    await this.storeRefreshToken(newRefreshTokenString, user._id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenString,
      userPayload: newAccessTokenPayload,
    };
  }
}

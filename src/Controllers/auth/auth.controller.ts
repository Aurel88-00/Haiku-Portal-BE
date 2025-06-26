import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDTO } from 'src/lib/dtos/login.dto';
import { UserDTO } from 'src/lib/dtos/user.dto';
import { SignupPipe } from 'src/Pipes/signup.pipe';
import { AuthService } from 'src/Services/auth/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(SignupPipe)
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() user: UserDTO,
  ) {
    try {
      const registerToken = await this.authService.register(user);

      return response
        .cookie('access_token', registerToken.accessToken, {
          httpOnly: true,
          secure: false,
          path: '/',
        })
        .status(201)
        .json({ message: 'Signup successful' });
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    } catch (error: string | Record<string, any> | unknown) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        (error as any)?.message ?? 'Internal Server Error',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        (error as any)?.status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() user: LoginDTO,
  ) {
    try {
      const loginToken = await this.authService.login(user);
      // set cookies for access and refresh tokens
      return response
        .cookie('access_token', String(loginToken.accessToken), {
          httpOnly: true,
          secure: false,
          path: '/',
        })
        .cookie('refresh_token', String(loginToken.refreshToken), {
          httpOnly: true,
          secure: false,
          path: '/',
        })
        .status(200)
        .json({
          message: 'Login successful',
        });
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    } catch (error: string | Record<string, any> | unknown) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        (error as any)?.message ?? 'Your credentials are incorrect',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        (error as any)?.status ?? HttpStatus.NOT_FOUND,
      );
    }
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    try {
      // clear cookies
      return response
        .clearCookie('access_token')
        .clearCookie('refresh_token')
        .status(200)
        .json({ message: 'Logout successful' });
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    } catch (error: string | Record<string, any> | unknown) {
      throw new HttpException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        (error as any)?.message ?? 'Internal Server Error',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        (error as any)?.status ?? HttpStatus.NOT_FOUND,
      );
    }
  }
}

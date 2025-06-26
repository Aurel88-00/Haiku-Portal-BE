// auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/lib/interfaces/jwt-payload.interface';
import { AuthService } from 'src/Services/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();
    const accessToken = request.cookies['access_token'];
    const refreshToken = request.cookies['refresh_token'];

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      path: '/',
    };

    if (accessToken) {
      this.logger.debug('Access token found in cookies.');
      try {
        const payload = await this.jwtService.verifyAsync<JwtPayload>(
          accessToken,
          {
            secret: process.env.JWT_SECRET,
          },
        );
        request.user = payload; // Attach payload to request
        this.logger.debug('Access token is valid.');
        return true;
      } catch (error) {
        this.logger.warn(
          `Access token verification failed: ${error.name} - ${error.message}`,
        );
        // If access token is expired, try to refresh it using the refresh token
        if (error.name === 'TokenExpiredError' && refreshToken) {
          this.logger.log(
            'Access token expired. Attempting to refresh using refresh token...',
          );
          return this.handleTokenRefresh(
            refreshToken,
            request,
            response,
            cookieOptions,
          );
        } else if (error.name === 'TokenExpiredError' && !refreshToken) {
          this.logger.warn('Access token expired, but no refresh token found.');
          throw new UnauthorizedException(
            'Access token expired and no refresh token provided.',
          );
        } else {
          // Other JWT errors (e.g., malformed, invalid signature)
          this.logger.error(
            `Invalid access token: ${error.message}. Clearing potentially compromised tokens.`,
          );

          throw new UnauthorizedException('Invalid access token.');
        }
      }
    } else if (refreshToken) {
      // No access token, but refresh token exists. Try to refresh.
      this.logger.log(
        'No access token found. Attempting to refresh using refresh token...',
      );
      return this.handleTokenRefresh(
        refreshToken,
        request,
        response,
        cookieOptions,
      );
    } else {
      // No access token and no refresh token
      this.logger.warn('No access token or refresh token found.');
      throw new UnauthorizedException(
        'Authentication required. No token provided.',
      );
    }
  }

  private async handleTokenRefresh(
    refreshTokenString: string,
    request: any,
    response: Response,
    cookieOptions: any,
  ): Promise<boolean> {
    try {
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userPayload,
      } = await this.authService.refreshToken(refreshTokenString);

      // Set new tokens in cookies
      response.cookie('access_token', newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      }); // e.g., 15 minutes
      response.cookie('refresh_token', newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }); // e.g., 7 days

      request.user = userPayload; // Attach new user payload to request
      this.logger.log('Tokens refreshed successfully.');
      return true;
    } catch (refreshError) {
      this.logger.error(
        `Refresh token validation failed: ${refreshError.message}`,
      );
      // Clear cookies if refresh fails (e.g., refresh token is invalid or revoked)
      response.clearCookie('access_token', cookieOptions);
      response.clearCookie('refresh_token', cookieOptions);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }
}

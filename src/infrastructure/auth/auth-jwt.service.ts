import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import authEnvConfig from './auth-env.config';
import {
  AccessTokenPayload,
  JWTPayload,
  RefreshTokenPayload,
} from './base-auth.interface';

@Injectable()
export class AuthJwtService {
  constructor(
    @Inject(authEnvConfig.KEY)
    private readonly authConfig: ConfigType<typeof authEnvConfig>,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(payload: JWTPayload) {
    const secret = this.authConfig.AUTH_ACCESS_TOKEN_SECRET;
    const expiresIn: number = this.authConfig.accessTokenExpiresInMs;
    if (!secret)
      throw new InternalServerErrorException(
        '.env: JWT_ACCESS_SECRET is not defined',
      );
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
    const expiresAt = new Date(Date.now() + expiresIn);
    return {
      access_token: token,
      access_token_expires_at: expiresAt,
    };
  }

  async generateRefreshToken(payload: JWTPayload) {
    const secret = this.authConfig.AUTH_REFRESH_TOKEN_SECRET;
    const expiresIn: number = this.authConfig.refreshTokenExpiresInMs;
    const jti = payload.jti || crypto.randomUUID();

    if (!secret)
      throw new InternalServerErrorException(
        '.env: JWT_REFRESH_SECRET is not defined',
      );
    const token = await this.jwtService.signAsync(
      {
        ...payload,
        jti,
      },
      {
        secret,
        expiresIn,
      },
    );
    const expiresAt = new Date(Date.now() + expiresIn);
    return {
      refresh_token: token,
      refresh_token_jti: jti,
      refresh_token_expires_at: expiresAt,
    };
  }

  async verifyRefreshToken<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload<T>>(
        token,
        {
          secret: this.authConfig.AUTH_REFRESH_TOKEN_SECRET,
          clockTolerance: 60,
        },
      );
      return payload;
    } catch {
      return null;
    }
  }

  async verifyAccessToken<
    T extends Record<string, unknown> = Record<string, unknown>,
  >(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload<T>>(
        token,
        {
          secret: this.authConfig.AUTH_ACCESS_TOKEN_SECRET,
          clockTolerance: 60,
        },
      );
      return payload;
    } catch {
      return null;
    }
  }
}

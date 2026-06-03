import { ConflictException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { AuthJwtService } from 'src/auth/auth-jwt.service';
import { OAuthLoginDTO } from 'src/lib/oauth/oauth.dto';
import { OAuthService } from 'src/lib/oauth/oauth.service';
import { AuthRegisterDTO } from './auth.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly authJwtService: AuthJwtService,
    private readonly oauthService: OAuthService,
  ) {}

  async register(payload: AuthRegisterDTO) {
    try {
      const username = `user${Date.now()}`;
      const hashedPw = await bcrypt.hash(payload.password!, 10);
      await this.repo.createUser({
        username: username,
        email: payload.email!,
        password: hashedPw,
      });
    } catch (error: any) {
      const {
        cause: { code },
      } = error;
      throw new ConflictException(
        code === 'ER_DUP_ENTRY'
          ? 'User already exists'
          : 'Something went wrong',
      );
    }
    return {
      message: 'New user created!',
    };
  }

  async login(identifier: string, password: string) {
    try {
      const [user] = await this.repo.findUserByIdentifier(identifier);
      if (!user) throw new ConflictException('User not found');

      const isPasswordValid = await bcrypt.compare(password, user.password!);
      if (!isPasswordValid) throw new ConflictException('Invalid password');

      const { id: sub } = user;
      const { access_token, access_token_expires_at } =
        await this.authJwtService.generateAccessToken({
          sub: sub.toString(),
        });

      const { refresh_token, refresh_token_expires_at, refresh_token_jti } =
        await this.authJwtService.generateRefreshToken({
          sub: sub.toString(),
        });

      const token_id = `${sub}-${refresh_token_jti}`;

      const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
      await this.repo.createSession({
        userId: user.id,
        refreshTokenHash: hashedRefreshToken,
        expiresAt: refresh_token_expires_at,
        token_id,
      });

      return {
        access_token,
        access_token_expires_at: access_token_expires_at.toISOString(),
        refresh_token,
        refresh_token_expires_at: refresh_token_expires_at.toISOString(),
      };
    } catch (error) {
      throw new ConflictException('Invalid credentials');
    }
  }

  async generateAccessToken(refreshToken: string) {
    try {
      const refreshTokenPayload =
        await this.authJwtService.verifyRefreshToken(refreshToken);

      if (refreshTokenPayload === null)
        throw new ConflictException('Invalid refresh token');

      const token_id = `${refreshTokenPayload.sub}-${refreshTokenPayload.jti}`;
      const [refreshTokenFound] =
        await this.repo.findActiveSessionByJti(token_id);

      const valid = await bcrypt.compare(
        refreshToken,
        refreshTokenFound.refreshTokenHash!,
      );
      if (!valid) throw new ConflictException('Invalid refresh token');

      const accessToken = await this.authJwtService.generateAccessToken({
        sub: refreshTokenPayload.sub,
      });

      return accessToken;
    } catch (error) {
      throw new ConflictException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    try {
      const refreshTokenPayload =
        await this.authJwtService.verifyRefreshToken(refreshToken);

      if (refreshTokenPayload === null)
        throw new ConflictException('Invalid refresh token');

      const token_id = `${refreshTokenPayload.sub}-${refreshTokenPayload.jti}`;
      await this.repo.revokeSessionByJti(token_id);
      return {
        message: 'Logout successful',
      };
    } catch (error) {
      throw new ConflictException('Invalid refresh token');
    }
  }

  async logoutAll(refreshToken: string) {
    try {
      const refreshTokenPayload =
        await this.authJwtService.verifyRefreshToken(refreshToken);

      if (refreshTokenPayload === null)
        throw new ConflictException('Invalid refresh token');

      const sub = Number(refreshTokenPayload.sub);

      if (typeof sub !== 'number')
        throw new ConflictException('Invalid refresh token');

      await this.repo.revokeSessionByUserId(sub);
      return {
        message: 'Successfully logged out from all devices',
      };
    } catch (error) {
      throw new ConflictException('Invalid refresh token');
    }
  }

  async loginWithGoogle(idToken: OAuthLoginDTO['idToken']) {
    const payload = await this.oauthService.loginWithGoogle(idToken);
    const user = await this.repo.findUserByEmail(payload.email!);

    if (user.length >= 1) {
      return await this.login(payload.email!, '');
    } else {
      await this.register({
        email: payload.email!,
        password: '',
      });

      return await this.login(payload.email!, '');
    }
  }
}

import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthJwtService } from 'src/infrastructure/auth/auth-jwt.service';
import { MAIL_SERVICE } from 'src/infrastructure/mail/constants';
import { GoogleMailService } from 'src/infrastructure/mail/providers/google/google-mail.service';
import { TemplateVerificationContext } from 'src/infrastructure/mail/templates/verification.interface';
import { TokenService } from 'src/modules/token/token.service';
import { AuthRegisterDTO } from '../auth.dto';
import { AuthRepository } from '../auth.repository';
import { HashService } from './hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly authJwtService: AuthJwtService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    @Inject(MAIL_SERVICE) private readonly mailService: GoogleMailService,
  ) {}

  async register(payload: AuthRegisterDTO) {
    try {
      const username = `user${Date.now()}`;
      const hashedPw = await this.hashService.hash(payload.password!);
      const userId = await this.repo.createUser({
        username: username,
        email: payload.email!,
        password: hashedPw,
      });

      const { token, expiresIn } = await this.tokenService.create({
        userId: userId,
        type: 'EMAIL_VERIFICATION',
      });

      const url = new URL(payload.redirectUrl);
      url.searchParams.set('token', token);

      payload.redirectUrl = url.toString();

      this.mailService.send<TemplateVerificationContext>({
        to: payload.email,
        subject: 'Verify your account',
        template: 'verification',
        context: {
          appName: payload.appName,
          verificationUrl: payload.redirectUrl,
          title: 'Verify your account',
          expiresIn,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const {
        cause: { code },
      } = error as any;

      if (code === 'ER_DUP_ENTRY')
        throw new ConflictException('User already exists');

      throw new InternalServerErrorException();
    }
    return {
      message:
        'New user created! Please check your email to verify your account.',
    };
  }

  async login(identifier: string, password: string) {
    try {
      const [user] = await this.repo.findUserByIdentifier(identifier);
      if (!user) throw new ConflictException('User not found');

      const isPasswordValid = await this.hashService.compare(
        password,
        user.password!,
      );

      if (!isPasswordValid) throw new ConflictException('Invalid credentials');

      if (!user.emailVerified) throw new ConflictException('User not verified');

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

      const hashedRefreshToken = await this.hashService.hash(refresh_token);
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
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
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

      const valid = await this.hashService.compare(
        refreshToken,
        refreshTokenFound.refreshTokenHash!,
      );
      if (!valid) throw new ConflictException('Invalid refresh token');

      const accessToken = await this.authJwtService.generateAccessToken({
        sub: refreshTokenPayload.sub,
      });

      return accessToken;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
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
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
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
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async verifyEmail(token: string) {
    try {
      const consumedTokenData = await this.tokenService.consume(
        token,
        'EMAIL_VERIFICATION',
      );

      await this.repo.verifyUserEmail(consumedTokenData.userId);

      return {
        message: 'Email verified successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}

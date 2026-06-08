import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  AuthActivateAccount,
  AuthLoginDTO,
  AuthRefreshTokenDTO,
  AuthRegisterDTO,
  AuthRequestResetPassword,
  AuthResetPassword,
  ResendVerificationDTO,
} from './auth.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() dto: AuthRegisterDTO) {
    return await this.authService.register(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthLoginDTO) {
    return await this.authService.login(dto.identifier!, dto.password!);
  }

  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @Post('verify-email')
  @HttpCode(200)
  async activateAccount(@Body() dto: AuthActivateAccount) {
    return await this.authService.verifyEmail(dto.token!);
  }

  @Post('refresh-token')
  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @HttpCode(200)
  async refreshToken(@Body() dto: AuthRefreshTokenDTO) {
    return await this.authService.generateAccessToken(dto.refresh_token!);
  }

  @Post('logout')
  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @HttpCode(200)
  async logout(@Body() dto: AuthRefreshTokenDTO) {
    return await this.authService.logout(dto.refresh_token!);
  }

  @Post('logout-all')
  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @HttpCode(200)
  async logoutAll(@Body() dto: AuthRefreshTokenDTO) {
    return await this.authService.logoutAll(dto.refresh_token!);
  }

  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() dto: AuthRequestResetPassword) {
    return await this.authService.requestPasswordReset(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() dto: AuthResetPassword) {
    return await this.authService.resetPassword(dto);
  }

  @Throttle({ default: { limit: 1, ttl: 60_000 } })
  @Post('send-verification-email')
  @HttpCode(200)
  async sendVerificationEmail(@Body() dto: ResendVerificationDTO) {
    return await this.authService.resendVerificationEmail(dto);
  }
}

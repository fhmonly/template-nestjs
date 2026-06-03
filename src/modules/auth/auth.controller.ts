import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { OAuthLoginDTO } from 'src/lib/oauth/oauth.dto';
import { AuthLoginDTO, AuthRefreshTokenDTO, AuthRegisterDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Throttle({ default: { limit: 3, ttl: 60_000 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() dto: AuthRegisterDTO) {
    return await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthLoginDTO) {
    return await this.authService.login(dto.identifier!, dto.password!);
  }

  @Post('refresh-token')
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

  @Post('google/login')
  @HttpCode(200)
  async loginWithGoogle(@Body() dto: OAuthLoginDTO) {
    return await this.authService.loginWithGoogle(dto.idToken);
  }
}

import { Module } from '@nestjs/common';
import { BaseAuthModule } from 'src/auth/base-auth.module';
import { OAuthModule } from 'src/lib/oauth/oauth.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [BaseAuthModule, OAuthModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}

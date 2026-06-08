import { Module } from '@nestjs/common';
import { BaseAuthModule } from 'src/infrastructure/auth/base-auth.module';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './services/auth.service';
import { HashService } from './services/hash.service';

@Module({
  imports: [BaseAuthModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, HashService],
  exports: [AuthService],
})
export class AuthModule {}

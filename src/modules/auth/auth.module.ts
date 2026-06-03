import { Module } from '@nestjs/common';
import { BaseAuthModule } from 'src/infrastructure/auth/base-auth.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [BaseAuthModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}

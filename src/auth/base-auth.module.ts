import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import authEnvConfig from './auth-env.config';
import { AuthJwtService } from './auth-jwt.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ConfigModule.forFeature(authEnvConfig),
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthGuard, AuthJwtService],
  exports: [AuthJwtService],
})
export class BaseAuthModule {}

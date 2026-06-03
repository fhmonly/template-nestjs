import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import oauthEnvConfig from './oauth-env.config';
import { OAuthService } from './oauth.service';

@Module({
  imports: [ConfigModule.forFeature(oauthEnvConfig)],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}

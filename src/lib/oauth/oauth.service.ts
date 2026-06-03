import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import oauthEnvConfig from './oauth-env.config';
import { OAuthLoginDTO } from './oauth.dto';

@Injectable()
export class OAuthService {
  private client: OAuth2Client;
  constructor(
    @Inject(oauthEnvConfig.KEY)
    private readonly config: ConfigType<typeof oauthEnvConfig>,
  ) {
    this.client = new OAuth2Client({
      clientId: config.GOOGLE_CLIENT_ID,
    });
  }

  async loginWithGoogle(idToken: OAuthLoginDTO['idToken']) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException('Invalid Google token');

    return payload;
  }
}

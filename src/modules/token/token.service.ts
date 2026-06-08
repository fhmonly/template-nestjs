import { BadRequestException, Injectable } from '@nestjs/common';

import { createHash, randomBytes } from 'crypto';

import ms from 'ms';
import { InsertTokenSchema } from 'src/infrastructure/database/schemas/tokens.schema';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  private readonly TOKEN_SIZE = 32;

  constructor(private readonly repo: TokenRepository) {}

  async create(payload: Pick<InsertTokenSchema, 'userId' | 'type'>) {
    const rawToken = randomBytes(this.TOKEN_SIZE).toString('hex');

    const tokenHash = this.hashToken(rawToken);

    const { expiresAt, expiresIn } = this.getExpiration(payload.type);

    await this.repo.createToken({
      userId: payload.userId,
      type: payload.type,
      token: tokenHash,
      expiresAt,
    });

    return {
      token: rawToken,
      expiresAt,
      expiresIn,
    };
  }

  async consume(rawToken: string, type: InsertTokenSchema['type']) {
    const tokenHash = this.hashToken(rawToken);

    const token = await this.repo.findActiveToken({
      token: tokenHash,
      type,
    });

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    await this.repo.markAsUsed(token.id);

    return token;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private getExpiration(type: InsertTokenSchema['type']): {
    expiresAt: Date;
    expiresIn: string;
  } {
    const now = Date.now();

    switch (type) {
      case 'EMAIL_VERIFICATION':
        return {
          expiresAt: new Date(now + ms('24h')),
          expiresIn: '24 hours',
        };

      case 'PASSWORD_RESET':
        return {
          expiresAt: new Date(now + ms('15m')),
          expiresIn: '15 minutes',
        };

      default:
        throw new Error(`Unsupported token type: ${type}`);
    }
  }
}

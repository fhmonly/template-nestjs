import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { DATABASE_SERVICE } from 'src/infrastructure/database/constants';
import { MySQLDatabaseService } from 'src/infrastructure/database/drivers/mysql/mysql.service';
import {
  InsertTokenSchema,
  tokens,
} from 'src/infrastructure/database/schemas/tokens.schema';

@Injectable()
export class TokenRepository {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly dbService: MySQLDatabaseService,
  ) {}

  private get db() {
    return this.dbService.db;
  }

  async findActiveToken(payload: Pick<InsertTokenSchema, 'token' | 'type'>) {
    const [token] = await this.db
      .select()
      .from(tokens)
      .where(
        and(
          eq(tokens.token, payload.token),
          eq(tokens.type, payload.type),
          isNull(tokens.usedAt),
          gt(tokens.expiresAt, new Date()),
        ),
      )
      .limit(1);
    return token;
  }

  async createToken(payload: InsertTokenSchema) {
    const [token] = await this.db.insert(tokens).values(payload).$returningId();
    return token;
  }

  async markAsUsed(id: number) {
    await this.db
      .update(tokens)
      .set({
        usedAt: new Date(),
      })
      .where(eq(tokens.id, id));
  }

  async revokeAll(userId: number, type: InsertTokenSchema['type']) {
    await this.db
      .update(tokens)
      .set({
        usedAt: new Date(),
      })
      .where(
        and(
          eq(tokens.userId, userId),
          eq(tokens.type, type),
          isNull(tokens.usedAt),
        ),
      );
  }
}

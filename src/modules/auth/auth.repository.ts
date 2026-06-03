import { Injectable } from '@nestjs/common';
import { and, eq, gt, or } from 'drizzle-orm';
import { DatabaseService } from 'src/database/database.service';
import { MySQLDatabaseService } from 'src/database/drivers/mysql/mysql.service';
import {
  InsertSessionSchema,
  sessions,
} from 'src/database/schemas/sessions.schema';
import { InsertUserSchema, users } from 'src/database/schemas/users.schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly dbService: DatabaseService) {}

  private get db() {
    return (this.dbService as MySQLDatabaseService).db;
  }

  async createUser(payload: InsertUserSchema): Promise<number> {
    const [user] = await this.db.insert(users).values(payload).$returningId();
    return user.id;
  }

  async findUserByEmail(email: string) {
    return await this.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async createSession(payload: InsertSessionSchema) {
    const [user] = await this.db
      .insert(sessions)
      .values(payload)
      .$returningId();
    return user.id;
  }

  async findActiveSessionByJti(jti: string) {
    return await this.db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token_id, jti),
          eq(sessions.isRevoked, false),
          gt(sessions.expiresAt, new Date()),
        ),
      )
      .limit(1);
  }

  async revokeSessionByJti(jti: string) {
    await this.db
      .update(sessions)
      .set({ isRevoked: true })
      .where(eq(sessions.token_id, jti));
  }

  async revokeSessionByUserId(userId: number) {
    await this.db
      .update(sessions)
      .set({ isRevoked: true })
      .where(eq(sessions.userId, userId));
  }

  async findUserByIdentifier(identifier: string) {
    return await this.db
      .select()
      .from(users)
      .where(
        or(
          eq(users.email, identifier),
          eq(users.username, identifier),
          // eq(users.phone, identifier),
        ),
      )
      .limit(1);
  }
}

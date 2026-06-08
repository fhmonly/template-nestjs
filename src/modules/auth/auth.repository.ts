import { Inject, Injectable } from '@nestjs/common';
import { and, eq, gt, or } from 'drizzle-orm';
import { DATABASE_SERVICE } from 'src/infrastructure/database/constants';
import { MySQLDatabaseService } from 'src/infrastructure/database/drivers/mysql/mysql.service';
import {
  InsertSessionSchema,
  sessions,
} from 'src/infrastructure/database/schemas/sessions.schema';
import {
  InsertUserSchema,
  users,
} from 'src/infrastructure/database/schemas/users.schema';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DATABASE_SERVICE) private readonly dbService: MySQLDatabaseService,
  ) {}

  private get db() {
    return this.dbService.db;
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

  async findUserById(id: number) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async verifyUserEmail(userId: number) {
    await this.db
      .update(users)
      .set({ emailVerifiedAt: new Date(), emailVerified: true })
      .where(eq(users.id, userId));
  }

  async updatePassword(userId: number, password: string) {
    await this.db.update(users).set({ password }).where(eq(users.id, userId));
  }
}

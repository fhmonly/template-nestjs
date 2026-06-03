import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users.schema';

export const sessions = mysqlTable('sessions', {
  id: int('id').primaryKey().autoincrement(),

  userId: int('user_id')
    .notNull()
    .references(() => users.id),

  token_id: varchar('token_id', { length: 255 }).notNull(),

  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),

  userAgent: varchar('user_agent', { length: 255 }),

  ipAddress: varchar('ip_address', { length: 100 }),

  isRevoked: boolean('is_revoked').default(false),

  expiresAt: timestamp('expires_at').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
});

export type InsertSessionSchema = typeof sessions.$inferInsert;

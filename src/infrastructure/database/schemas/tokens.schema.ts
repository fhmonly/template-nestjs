import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const tokens = mysqlTable('tokens', {
  id: int('id').autoincrement().primaryKey(),

  userId: int('user_id').notNull(),

  token: varchar('token', { length: 255 }).notNull(),

  type: mysqlEnum('type', ['EMAIL_VERIFICATION', 'PASSWORD_RESET']).notNull(),

  isUsed: boolean('is_used').default(false).notNull(),

  expiresAt: timestamp('expires_at').notNull(),

  usedAt: timestamp('used_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type InsertTokenSchema = typeof tokens.$inferInsert;
export type SelectTokenSchema = typeof tokens.$inferSelect;

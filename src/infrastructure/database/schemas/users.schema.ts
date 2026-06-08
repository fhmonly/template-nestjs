import {
  boolean,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),

  username: varchar('username', { length: 120 }).notNull().unique(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  password: varchar('password', { length: 255 }).notNull(),

  emailVerified: boolean('email_verified').default(false).notNull(),

  emailVerifiedAt: timestamp('email_verified_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

export type InsertUserSchema = typeof users.$inferInsert;
export type SelectUserSchema = typeof users.$inferSelect;

import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { useNanoID } from '../../../composables/useNanoID';

export const users = pgTable('users', {
  id: varchar('id', { length: 20 }).primaryKey().$defaultFn(() => useNanoID()),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().$defaultFn(() => new Date()),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: varchar('id', { length: 20 }).primaryKey().$defaultFn(() => useNanoID()),
  token: text('token').notNull(),
  owner: text('owner').references(() => users.id).notNull(),
});

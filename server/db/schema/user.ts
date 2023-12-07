import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { useNanoID } from '../../../composables/useNanoID';

export const users = sqliteTable('users', {
  id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => useNanoID()),
  password: text('password', { mode: 'text' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => useNanoID()),
  token: text('token', { mode: 'text' }).notNull(),
  owner: text('owner', { mode: 'text' }).references(() => users.id).notNull(),
});

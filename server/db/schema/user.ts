import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const users = sqliteTable('users', {
    id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => nanoid(12)),
    password: text('password', { mode: 'text' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});


export const refreshTokens = sqliteTable('refresh_tokens', {
    id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => nanoid(12)),
    token: text('token', { mode: 'text' }).notNull(),
    owner: text('owner', { mode: 'text' }).references(() => users.id).notNull(),
});

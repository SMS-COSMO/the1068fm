import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const times = sqliteTable('times', {
    id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => nanoid(12)),
    name: text('name', { mode: 'text' }).notNull(),
    startAt: integer('start_at', { mode: 'timestamp' }).notNull(),
    endAt: integer('end_at', { mode: 'timestamp' }).notNull(),
    repeats: integer('repeats', { mode: 'boolean' }).notNull().default(false),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

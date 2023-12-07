import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { useNanoID } from '../../../composables/useNanoID';

export const times = sqliteTable('times', {
  id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => useNanoID()),
  name: text('name', { mode: 'text' }).notNull(),
  startAt: integer('start_at', { mode: 'timestamp' }).notNull(),
  endAt: integer('end_at', { mode: 'timestamp' }).notNull(),
  repeats: integer('repeats', { mode: 'boolean' }).notNull().default(false),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

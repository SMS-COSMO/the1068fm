import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const arrangements = sqliteTable('arrangements', {
  date: text('date', { mode: 'text' }).primaryKey(),
  songIds: text('song_ids', { mode: 'json' }).$type<string[]>(),
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
});

import { boolean, json, pgTable, text } from 'drizzle-orm/pg-core';

export const arrangements = pgTable('arrangements', {
  date: text('date').primaryKey(),
  songIds: json('song_ids').$type<string[]>(),
  isPublic: boolean('is_public').notNull().default(false),
});

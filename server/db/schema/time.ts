import { boolean, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { useNanoID } from '../../../composables/useNanoID';

export const times = pgTable('times', {
  id: varchar('id', { length: 20 }).primaryKey().$defaultFn(() => useNanoID()),
  name: text('name').notNull(),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  repeats: boolean('repeats').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
});

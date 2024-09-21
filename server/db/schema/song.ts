import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { useNanoID } from '../../../composables/useNanoID';

export const songs = pgTable('songs', {
  id: varchar('id', { length: 20 }).primaryKey().$defaultFn(() => useNanoID()),
  name: text('name').notNull(),
  creator: text('creator').notNull(),
  submitterName: text('submitter_name').notNull(),
  submitterGrade: integer('submitter_grade').notNull(), // 1: 高一 | 2: 高二 | 3: 国体高一 | 4: 国体高二 | 5: 国体高三
  submitterClass: integer('submitter_class').notNull(),
  status: text('status', { enum: ['unset', 'approved', 'rejected', 'used'] }).notNull().default('unset'),
  type: text('type', { enum: ['normal', 'withMsg'] }).notNull(),
  message: text('message'),
  createdAt: timestamp('created_at').notNull().$defaultFn(() => new Date()),
});

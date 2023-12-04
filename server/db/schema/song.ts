import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { useNanoID } from '~/composables/useNanoID';

export const songs = sqliteTable('songs', {
  id: text('id', { mode: 'text' }).primaryKey().$defaultFn(() => useNanoID()),
  name: text('name', { mode: 'text' }).notNull(),
  creator: text('creator', { mode: 'text' }).notNull(),
  submitterName: text('submitter_name', { mode: 'text' }).notNull(),
  submitterGrade: integer('submitter_grade', { mode: 'number' }).notNull(), // admission year
  submitterClass: integer('submitter_class', { mode: 'number' }).notNull(),
  status: text('status', { enum: ['unset', 'approved', 'rejected', 'used'] }).notNull().default('unset'),
  type: text('type', { enum: ['normal', 'withMsg'] }).notNull(),
  message: text('message', { mode: 'text' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

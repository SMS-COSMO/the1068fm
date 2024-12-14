import type { TPermission } from '~~/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text().primaryKey(),
  name: text(),
  permissions: json().notNull().$type<TPermission[]>().default(['login']),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const arrangements = pgTable('arrangements', {
  date: text().primaryKey(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const songs = pgTable('songs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  creator: text().notNull(),
  ownerId: text().references(() => users.id),
  arrangementDate: text().references(() => arrangements.date),
  state: text({ enum: ['pending', 'approved', 'rejected', 'used', 'dropped'] }).notNull().default('pending'),
  rejectMessage: text(),
  message: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const times = pgTable('times', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  startAt: timestamp({ withTimezone: true }).notNull(),
  endAt: timestamp({ withTimezone: true }).notNull(),
  repeats: boolean().notNull().default(false),
  isActive: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const arrangementsRelations = relations(arrangements, ({ many }) => ({
  songs: many(songs),
}));

export const usersRelations = relations(users, ({ many }) => ({
  songs: many(songs),
}));

export const songsRelations = relations(songs, ({ one }) => ({
  owner: one(users, {
    fields: [songs.ownerId],
    references: [users.id],
  }),
  arrangement: one(arrangements, {
    fields: [songs.arrangementDate],
    references: [arrangements.date],
  }),
}));

export const blockWords = pgTable('block-words', {
  word: text().primaryKey(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '../env';
import type { arrangements, refreshTokens, songs, users } from './schema';
import type { times } from './schema/time';

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client);

export type TRawUser = typeof users.$inferSelect;
export type TNewUser = typeof users.$inferInsert;
export type TRefreshToken = typeof refreshTokens.$inferInsert;

export type TRawSong = typeof songs.$inferSelect;
export type TNewSong = typeof songs.$inferInsert;

export type TRawArrangement = typeof arrangements.$inferSelect;
export type TNewArrangement = typeof arrangements.$inferInsert;

export type TRawTime = typeof times.$inferSelect;
export type TNewTime = typeof times.$inferInsert;

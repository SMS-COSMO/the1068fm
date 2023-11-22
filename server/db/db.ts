import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { env } from '../env';
import { users, refreshTokens, songs } from './schema';

const options = (() => {
    switch (env.DATABASE_CONNECTION_TYPE) {
        case 'local': return { url: 'file:local.sqlite' };
        case 'remote': return { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN };
    }
})();

const client = createClient(options);
export const db = drizzle(client);

export type TRawUser = typeof users.$inferSelect
export type TNewUser = typeof users.$inferInsert
export type TRefreshToken = typeof refreshTokens.$inferInsert

export type TRawSong = typeof songs.$inferSelect
export type TNewSong = typeof songs.$inferInsert

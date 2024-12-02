import { db } from '~~/server/db';
import { songs, users } from '~~/server/db/schema';
import { count } from 'drizzle-orm';
import { adminProcedure, router } from '../trpc';

export const statsRouter = router({
  dashboard: adminProcedure
    .query(async () => {
      const songCount = (await db.select({ count: count() }).from(songs))[0].count;
      const userCount = (await db.select({ count: count() }).from(users))[0].count;

      return {
        songCount,
        userCount,
      };
    }),
});

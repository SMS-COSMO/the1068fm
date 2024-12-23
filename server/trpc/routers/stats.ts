import type { TSongState } from '~~/types';
import { count } from 'drizzle-orm';
import { db } from '~~/server/db';
import { users } from '~~/server/db/schema';
import { adminProcedure, router } from '../trpc';

export const statsRouter = router({
  dashboard: adminProcedure
    .query(async () => {
      const userCount = (await db.select({ count: count() }).from(users))[0]?.count;

      const songs = await db.query.songs.findMany({
        columns: {
          createdAt: true,
          state: true,
        },
      });

      const map = new Map<string, { [key in TSongState]: number }>();
      for (const song of songs) {
        const date = song.createdAt.toLocaleDateString('zh-CN');
        const val = map.get(date) ?? { approved: 0, dropped: 0, pending: 0, rejected: 0, used: 0 };
        val[song.state]++;
        map.set(date, val);
      };

      return {
        songCount: songs.length,
        userCount,
        chart: Array.from(map, ([date, count]) => ({ date, ...count })),
      };
    }),
});

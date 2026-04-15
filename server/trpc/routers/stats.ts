import type { TSongState } from '~~/types';
import { count } from 'drizzle-orm';
import { db } from '~~/server/db';
import { songs, users } from '~~/server/db/schema';
import { adminProcedure, protectedProcedure, router } from '../trpc';

async function getSongMap() {
  const songs = await db.query.songs.findMany({
    columns: {
      createdAt: true,
      state: true,
    },
  });

  const map = new Map<string, { [key in TSongState]: number }>();
  for (const song of songs) {
    const date = song.createdAt.toLocaleDateString('zh-CN');
    const val = map.get(date) ?? { approved: 0, dropped: 0, pending: 0, rejected: 0, used: 0, ghost: 0 };
    val[song.state]++;
    map.set(date, val);
  };

  return { songs, map };
}

export const statsRouter = router({
  dashboard: adminProcedure
    .query(async () => {
      const userCount = (await db.select({ count: count() }).from(users))[0]?.count;

      const { songs, map } = await getSongMap();

      return {
        songCount: songs.length,
        userCount,
        chart: Array.from(map, ([date, count]) => ({ date, ...count })).toSorted((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime()),
      };
    }),

  count: protectedProcedure
    .query(async () => {
      const userCount = (await db.select({ count: count() }).from(users))[0]?.count;
      const songCount = (await db.select({ count: count() }).from(songs))[0]?.count;

      return {
        userCount,
        songCount,
      };
    }),

  song: protectedProcedure
    .query(async () => {
      const { map } = await getSongMap();
      return Array.from(
        map,
        ([date, count]) => ({
          date,
          count: count.approved + count.used + count.ghost + count.dropped + count.pending + count.rejected,
        }),
      ).toSorted((a, b) => ((new Date(b.date)).getTime() - (new Date(a.date)).getTime()));
    }),

  singer: protectedProcedure
    .query(async () => {
      const singers = await db.query.songs.findMany({
        columns: {
          singerId: true,
          singerName: true,
        },
      });

      const map = new Map<string, { singerName: string; count: number }>();
      for (const singer of singers) {
        if (!singer.singerId || !singer.singerName)
          continue;
        const count = map.get(singer.singerId)?.count ?? 0;
        map.set(singer.singerId, { singerName: singer.singerName, count: count + 1 });
      }

      return Array.from(map, ([singerId, count]) => ({ singerId, ...count })).toSorted((a, b) => b.count - a.count);
    }),
});

import { parseDate } from '@internationalized/date';
import { TRPCError } from '@trpc/server';
import { desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~~/server/db';
import { arrangements, songs } from '~~/server/db/schema';
import { adminProcedure, protectedProcedure, requirePermission, router } from '../trpc';
import { fitsInTime } from './time';

async function reviewAll() {
  return (await db.query.songs.findMany({
    where: eq(songs.state, 'pending'),
    columns: { id: true },
  })).length === 0;
}

export const arrangementsRouter = router({
  list: adminProcedure
    .use(requirePermission(['arrange']))
    .query(async () => {
      return await db.query.arrangements.findMany({
        orderBy: desc(arrangements.date),
        columns: {
          date: true,
        },
        with: {
          songs: {
            orderBy: desc(songs.createdAt),
            columns: {
              id: true,
              creator: true,
              name: true,
              rejectMessage: true,
              state: true,
              createdAt: true,
              message: true,
            },
          },
        },
      });
    }),

  listSafe: protectedProcedure
    .query(async () => {
      return await db.query.arrangements.findMany({
        orderBy: desc(arrangements.date),
        columns: {
          date: true,
        },
        with: {
          songs: {
            orderBy: desc(songs.createdAt),
            columns: {
              id: true,
              creator: true,
              name: true,
              rejectMessage: true,
              state: true,
              createdAt: true,
            },
          },
        },
      });
    }),

  reviewAll: adminProcedure
    .use(requirePermission(['arrange']))
    .query(async () => {
      return await reviewAll();
    }),

  arrange: adminProcedure
    .use(requirePermission(['arrange']))
    .input(z.object({
      start: z.string(),
      end: z.string(),
      songCount: z.number().int(),
    }))
    .mutation(async ({ input }) => {
      if (!(await reviewAll()))
        throw new TRPCError({ code: 'FORBIDDEN', message: '请审核全部歌曲' });

      if (await fitsInTime(new Date()))
        throw new TRPCError({ code: 'FORBIDDEN', message: '请在投稿截止后排歌' });

      const start = parseDate(input.start);
      const end = parseDate(input.end);

      await db.transaction(async (tx) => {
        // get unused songs
        const approvedSongs = await tx.query.songs.findMany({
          where: eq(songs.state, 'approved'),
          orderBy: sql`RANDOM()`,
          columns: {
            id: true,
          },
        });

        // get dropped songs
        let droppedSongs: typeof approvedSongs = [];
        // (only when insufficient unused songs is present)
        if ((end.compare(start) + 1) * input.songCount > approvedSongs.length) {
          droppedSongs = await tx.query.songs.findMany({
            where: eq(songs.state, 'dropped'),
            orderBy: sql`RANDOM()`,
            columns: {
              id: true,
            },
          });
        }

        let songIndex = 0;
        let droppedSongIndex = 0;
        for (let date = start; date.compare(end) <= 0; date = date.add({ days: 1 })) {
          const dateString = date.toString();
          await tx.insert(arrangements).values({ date: dateString });

          for (let i = 0; i < input.songCount; i++) {
            if (songIndex < approvedSongs.length) {
              await tx
                .update(songs)
                .set({
                  arrangementDate: dateString,
                  state: 'used',
                })
                .where(eq(songs.id, approvedSongs[songIndex]!.id));

              songIndex++;
            } else if (droppedSongIndex < droppedSongs.length) { // recover dropped songs
              await tx
                .update(songs)
                .set({
                  arrangementDate: dateString,
                  state: 'used',
                })
                .where(eq(songs.id, droppedSongs[droppedSongIndex]!.id));

              droppedSongIndex++;
            }
          }
        }

        // Drop extra songs
        while (songIndex < approvedSongs.length) {
          await tx
            .update(songs)
            .set({ state: 'dropped' })
            .where(eq(songs.id, approvedSongs[songIndex]!.id));

          songIndex++;
        }
      });
    }),
});

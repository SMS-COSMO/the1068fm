import { TRPCError } from '@trpc/server';
import { db } from '~~/server/db';
import { songs } from '~~/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { adminProcedure, protectedProcedure, requirePermission, router } from '../trpc';
import { fitsInTime } from './time';

async function checkCanSubmit(userId: string) {
  if (!(await fitsInTime(new Date())))
    return false;

  const latestSubmission = await db.query.songs.findFirst({
    where: eq(songs.ownerId, userId),
    orderBy: desc(songs.createdAt),
  });

  // no submission
  if (!latestSubmission)
    return true;

  // more than one day
  if (Date.now() - latestSubmission.createdAt.getTime() >= 24 * 60 * 60 * 1000)
    return true;
  return false;
}

export const songRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string()
        .min(1, '请输入歌名')
        .max(50, '歌名长度最大为50'),
      creator: z.string()
        .min(1, '请输入歌手名')
        .max(20, '歌手长度最大为20'),
      message: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!(await checkCanSubmit(ctx.user.id)))
        throw new TRPCError({ code: 'BAD_REQUEST', message: '一天只能提交一首歌曲' });

      await db.insert(songs).values({
        ...input,
        ownerId: ctx.user.id,
      });
    }),

  list: adminProcedure
    .query(async () => {
      return await db.query.songs.findMany({
        orderBy: desc(songs.createdAt),
        columns: {
          id: true,
          name: true,
          creator: true,
          message: true,
          createdAt: true,
          state: true,
          rejectMessage: true,
        },
      });
    }),

  listReview: adminProcedure
    .query(async () => {
      return await db.query.songs.findMany({
        where: eq(songs.state, 'pending'),
        orderBy: desc(songs.createdAt),
        columns: {
          id: true,
          name: true,
          creator: true,
          message: true,
          createdAt: true,
          state: true,
          rejectMessage: true,
        },
      });
    }),

  listSafe: protectedProcedure
    .query(async () => {
      return await db.query.songs.findMany({
        orderBy: desc(songs.createdAt),
        columns: {
          id: true,
          name: true,
          creator: true,
          state: true,
          rejectMessage: true,
          arrangementDate: true,
          createdAt: true,
        },
      });
    }),

  listMine: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.query.songs.findMany({
        orderBy: desc(songs.createdAt),
        where: eq(songs.ownerId, ctx.user.id),
      });
    }),

  canSubmit: protectedProcedure
    .query(async ({ ctx }) => {
      return await checkCanSubmit(ctx.user.id);
    }),

  review: router({
    approve: adminProcedure
      .input(z.object({
        id: z.number(),
      }))
      .use(requirePermission(['review']))
      .mutation(async ({ input }) => {
        await db
          .update(songs)
          .set({ state: 'approved' })
          .where(eq(songs.id, input.id));
      }),

    reject: adminProcedure
      .input(z.object({
        id: z.number(),
        rejectMessage: z.string().min(4, '拒绝理由不得小于4个字符'),
      }))
      .use(requirePermission(['review']))
      .mutation(async ({ input }) => {
        await db
          .update(songs)
          .set({
            state: 'rejected',
            rejectMessage: input.rejectMessage,
          })
          .where(eq(songs.id, input.id));
      }),
  }),

  qqSearch: adminProcedure
    .input(z.object({
      key: z.string(),
    }))
    .use(requirePermission(['review']))
    .query(async ({ input }) => {
      const searchBaseURL = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp';

      interface TSearchDataItem {
        albummid: string;
        singer: { name: string }[];
        songmid: string;
        songname: string;
      }

      interface TSearchResponse {
        code: number;
        data: {
          song: {
            list: TSearchDataItem[];
          };
        };
      }

      const res = await $fetch<TSearchResponse>(searchBaseURL, {
        method: 'GET',
        params: {
          w: input.key,
          n: 5,
          format: 'json',
        },
        parseResponse(responseText) {
          try {
            return JSON.parse(responseText);
          } catch {
            return responseText;
          }
        },
      });

      const songList = res.data.song.list.map(item => ({
        mid: item.songmid,
        name: item.songname,
        singer: item.singer.map(singer => singer.name).join(', ').trim(),
        pic: `https://y.qq.com/music/photo_new/T002R300x300M000${item.albummid}.jpg`,
      }));
      return songList;
    }),
});

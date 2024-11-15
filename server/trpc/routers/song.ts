import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../trpc';
import { db } from '~~/server/db';
import { songs } from '~~/server/db/schema';
import type { TPermission } from '~~/types';

async function checkCanSubmit(userId: string, userPermission: TPermission[]) {
  if (userPermission.includes('admin'))
    return true;

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
      if (!(await checkCanSubmit(ctx.user.id, ctx.user.permissions)))
        throw new TRPCError({ code: 'BAD_REQUEST', message: '一天只能提交一首歌曲' });

      await db.insert(songs).values({
        ...input,
        ownerId: ctx.user.id,
      });
    }),

  list: protectedProcedure
    .query(async () => {
      return await db.query.songs.findMany({
        columns: {
          id: true,
          name: true,
          creator: true,
          message: true,
          createdAt: true,
        },
      });
    }),

  listMine: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.query.songs.findMany({
        where: eq(songs.ownerId, ctx.user.id),
      });
    }),

  canSubmit: protectedProcedure
    .query(async ({ ctx }) => {
      return await checkCanSubmit(ctx.user.id, ctx.user.permissions);
    }),
});

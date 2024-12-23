import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~~/server/db';
import { blockWords } from '~~/server/db/schema';
import { adminProcedure, requirePermission, router } from '../trpc';

export const blockWordsRouter = router({
  create: adminProcedure
    .use(requirePermission(['blockWords']))
    .input(z.object({
      word: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await db.insert(blockWords).values({
        word: input.word,
      });
    }),

  list: adminProcedure
    .use(requirePermission(['blockWords']))
    .query(async () => {
      return await db.query.blockWords.findMany({
        orderBy: desc(blockWords.createdAt),
      });
    }),

  remove: adminProcedure
    .use(requirePermission(['blockWords']))
    .input(z.object({
      word: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await db.delete(blockWords).where(eq(blockWords.word, input.word));
    }),
});

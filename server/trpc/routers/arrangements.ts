import { db } from '~~/server/db';
import { arrangements } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';
import { adminProcedure, requirePermission, router } from '../trpc';

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
});

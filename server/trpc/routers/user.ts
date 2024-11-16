import { z } from 'zod';
import { desc, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { adminProcedure, protectedProcedure, publicProcedure, requirePermission, router } from '../trpc';
import { db } from '~~/server/db';
import { users } from '~~/server/db/schema';

export const userRouter = router({
  login: publicProcedure
    .input(z.object({
      id: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const seiue = await Seiue.init({
        schoolId: input.id,
        password: input.password,
      });

      if (!seiue)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '学号或密码错误' });

      let user = await db.query.users.findFirst({
        where: eq(users.id, input.id),
      });

      // auto register
      if (!user) {
        const me = await seiue.me();

        user = (
          await db
            .insert(users)
            .values({
              id: input.id,
              name: me.name,
              permissions: ['login'],
            }).returning()
        )[0];
      }

      // make sure registration is successful
      if (!user)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: '登录失败' });

      // banned
      if (!user.permissions.includes('login'))
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '无法登录' });

      const accessToken = await produceAccessToken(user.id);
      return {
        ...user,
        accessToken,
      };
    }),

  tokenValidity: protectedProcedure
    .query(() => { }), // protectedProcedure will check if user is logged in

  list: adminProcedure
    .use(requirePermission(['manageUser']))
    .query(async () => {
      return await db.query.users.findMany({
        orderBy: desc(users.createdAt),
        with: {
          songs: {
            columns: {
              id: true,
              name: true,
              creator: true,
              message: true,
            },
          },
        },
      });
    }),

  editPermission: adminProcedure
    .input(z.object({
      id: z.string(),
      permissions: z.enum(['login', 'admin', 'review', 'arrange', 'manageUser', 'time']).array(),
    }))
    .use(requirePermission(['manageUser']))
    .mutation(async ({ input }) => {
      await db
        .update(users)
        .set({ permissions: input.permissions })
        .where(eq(users.id, input.id));
    }),
});

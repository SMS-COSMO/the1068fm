import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { passwordRegex } from '~/constants/index';

export const userRouter = router({

  register: protectedProcedure
    .input(z.object({
      id: z.string().min(4, { message: '用户ID长度应至少为4' }).max(24, { message: '用户ID超出长度范围' }),
      password: z.string().min(8, { message: '用户密码长度应至少为8' }).regex(passwordRegex, '密码必须包含大小写字母、数字与特殊符号'),
    }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.userController.register({
        id: input.id,
        password: input.password,
      });
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res;
    }),

  login: publicProcedure
    .input(z.object({ id: z.string(), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.userController.login(input.id, input.password);
      if (!user)
        throw new TRPCError({ code: 'BAD_REQUEST', message: '用户名或密码错误' });
      return user;
    }),

  tokenValidity: protectedProcedure
    .query(() => { }), // protectedProcedure will check if user is logged in

  refreshAccessToken: publicProcedure
    .input(z.object({ id: z.string(), refreshToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.userController.refreshAccessToken(input.refreshToken, input.id);
      if (!res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Incorrect refresh token.' });
      return res;
    }),

  modifyPassword: protectedProcedure
    .input(z.object({
      oldPassword: z.string(),
      newPassword: z
        .string().min(8, { message: '用户密码长度应至少为8' })
        .regex(passwordRegex, '密码必须包含大小写字母、数字与特殊符号'),
    }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.userController.modifyPassword(ctx.user, input.oldPassword, input.newPassword);
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else
        return res;
    }),
});

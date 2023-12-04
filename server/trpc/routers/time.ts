import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const timeRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string().max(50, '时间段名不能大于50'),
      startAt: z.date(),
      endAt: z.date(),
      repeats: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.timeController.create(input);
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res.res;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().min(1, '时间段不存在') }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.timeController.remove(input.id);
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res;
    }),

  content: publicProcedure
    .input(z.object({ id: z.string().min(1, '时间段不存在') }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.timeController.getContent(input.id);
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res.res;
    }),

  currently: publicProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.timeController.fitsInTime(new Date());
      return res;
    }),

  modify: protectedProcedure
    .input(z.object({
      id: z.string().min(1, '时间段不存在'),
      name: z.string(),
      startAt: z.date(),
      endAt: z.date(),
      repeats: z.boolean(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.timeController.modify(input);
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res;
    }),

  modifyActive: protectedProcedure
    .input(z.object({
      id: z.string().min(1, '时间段不存在'),
      isActive: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.timeController.modifyActive(input.id, input.isActive);
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res;
    }),

  list: publicProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.timeController.getList();
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res.res;
    }),
});

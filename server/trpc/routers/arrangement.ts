import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const arrangementRouter = router({
    create: protectedProcedure
        .input(z.object({
            date: z.string(),
            songIds: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.create(input);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    remove: protectedProcedure
        .input(z.object({ date: z.string().min(1, '排歌表不存在') }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.remove(input.date);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    content: protectedProcedure
        .input(z.object({ date: z.string().min(1, '排歌表不存在') }))
        .query(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.getContent(input.date);
            if (!res.success || !res.res)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res.res;
        }),

    modifySongList: protectedProcedure
        .input(z.object({
            date: z.string().min(1, '排歌表不存在'),
            newSongList: z.array(z.string()),
        }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.modifySongList(input.date, input.newSongList);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    list: protectedProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.arrangementController.getList();
            if (!res.success || !res.res)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res.res;
        }),
});

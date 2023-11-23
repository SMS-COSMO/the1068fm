import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

const dateRegExp = /(202[3-9]|20[3-9]\d)-[01]\d-[0-3]\d/
const dateZod = z.string().min(1, '排歌表日期不能为空').refine((val) => dateRegExp.test(val), '日期格式不正确')

export const arrangementRouter = router({
    create: protectedProcedure
        .input(z.object({
            date: dateZod,
            songIds: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.create(input);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    remove: protectedProcedure
        .input(z.object({ date: dateZod }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.remove(input.date);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    content: protectedProcedure
        .input(z.object({ date: dateZod }))
        .query(async ({ ctx, input }) => {
            const res = await ctx.arrangementController.getContent(input.date);
            if (!res.success || !res.res)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res.res;
        }),

    modifySongList: protectedProcedure
        .input(z.object({
            date: dateZod,
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

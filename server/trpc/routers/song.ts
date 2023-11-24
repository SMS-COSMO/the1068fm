import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export const songRouter = router({
    create: publicProcedure
        .input(z.object({
            name: z.string().min(1, '歌名长度至少为1').max(50, '歌名长度最大为50'),
            creator: z.string().min(1, '歌手名长度至少为1').max(50, '歌手长度最大为50'),
            submitterName: z.string().min(2, '申请者名字长度至少为2').max(15, '申请者名字长度最大为15'),
            submitterGrade: z.number().min(1000).max(5000), // problem for people in 5000s
            submitterClass: z.number().min(0, '班级号应大于0').max(100, '班级号应小于100'),
            type: z.enum(['normal', 'withMsg'], { errorMap: () => ({ message: '提交了不存在的歌曲类型' }) }),
            message: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.songController.create(input);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    remove: protectedProcedure
        .input(z.object({ id: z.string().min(1, '歌曲不存在') }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.songController.remove(input.id);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    content: publicProcedure
        .input(z.object({ id: z.string().min(1, '歌曲不存在') }))
        .query(async ({ ctx, input }) => {
            const res = await ctx.songController.getContent(input.id);
            if (!res.success || !res.res)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res.res;
        }),

    modifyStatus: protectedProcedure
        .input(z.object({
            id: z.string().min(1, '歌曲不存在'),
            status: z.enum(['unset', 'approved', 'rejected', 'used']),
        }))
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.songController.modifyStatus(input.id, input.status);
            if (!res.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res;
        }),

    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.songController.getList();
            if (!res.success || !res.res)
                throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
            else return res.res;
        }),
});

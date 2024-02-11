import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';
import { serializeSong } from '../utils/serializer';

export const songRouter = router({
  create: publicProcedure
    .input(z.object({
      name: z.string({ required_error: '歌名长度至少为1' }).min(1, '歌名长度至少为1').max(50, '歌名长度最大为50'),
      creator: z.string({ required_error: '歌手名长度至少为1' }).min(1, '歌手名长度至少为1').max(50, '歌手长度最大为50'),
      submitterName: z.string({ required_error: '提交者名字长度至少为2' }).min(2, '提交者名字长度至少为2').max(15, '提交者名字长度最大为15'),
      submitterGrade: z.coerce.number({ invalid_type_error: '请填一个数字' }).int('请填一个整数').min(1, '年级为1~5').max(5, '年级为1~5'),
      submitterClass: z.coerce.number({ invalid_type_error: '请填一个数字' }).min(0, '班级号应大于0').max(100, '班级号应小于100'),
      type: z.enum(['normal', 'withMsg'], { errorMap: () => ({ message: '提交了不存在的歌曲类型' }) }),
      message: z.string().nullish(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!await ctx.timeController.fitsInTime(new Date()))
        throw new TRPCError({ code: 'BAD_REQUEST', message: '不在投稿时段内' });
      const res = await ctx.songController.create(input);
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res.res;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string().min(1, '歌曲不存在') }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.songController.remove(input.id);
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res;
    }),

  contentSafe: publicProcedure
    .input(z.object({ id: z.string().min(1, '歌曲不存在') }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.songController.getContent(input.id);
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return serializeSong(res.res);
    }),

  content: protectedProcedure
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

  batchModifyStatus: protectedProcedure
    .input(z.object({
      ids: z.array(z.string().min(1, '歌曲不存在')),
      status: z.enum(['unset', 'approved', 'rejected', 'used']),
    }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.songController.batchModifyStatus(input.ids, input.status);
      if (!res.success)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res;
    }),

  listSafe: publicProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.songController.getList();
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else
        return res.res.map(song => serializeSong(song));
    }),

  listUnused: protectedProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.songController.getList();
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else
        return res.res.filter(item => item.status !== 'used');
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.songController.getList();
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res.res;
    }),

  info: publicProcedure
    .query(async ({ ctx }) => {
      const res = await ctx.songController.getList();
      if (!res.success || !res.res)
        throw new TRPCError({ code: 'BAD_REQUEST', message: res.message });
      else return res.res.length;
    }),
});

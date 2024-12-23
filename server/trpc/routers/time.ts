import { asc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '~~/server/db';
import { times } from '~~/server/db/schema';
import { adminProcedure, protectedProcedure, requirePermission, router } from '../trpc';

export async function fitsInTime(t: Date) {
  const list = await db.query.times.findMany({
    columns: {
      isActive: true,
      startAt: true,
      endAt: true,
      repeats: true,
    },
  });

  for (const time of list) {
    if (!time.isActive)
      continue;
    if (!time.repeats) {
      if (t < time.startAt || time.endAt < t)
        continue;
    } else {
      const dhms = (d: Date) => ({
        d: d.getDay() === 0 ? 7 : d.getDay(),
        h: d.getHours(),
        m: d.getMinutes(),
        s: d.getSeconds(),
      });
      const date2num = (d: ReturnType<typeof dhms>) => d.d * 1000000 + d.h * 10000 + d.m * 100 + d.s;

      const start = dhms(time.startAt);
      const end = dhms(time.endAt);
      const current = dhms(t);

      if ((start.d < end.d && (current.d < start.d || end.d < current.d)) || (start.d > end.d && current.d < start.d))
        continue;
      if (start.d === end.d && (date2num(current) < date2num(start) || date2num(current) > date2num(end)))
        continue;
      if (current.d === start.d && date2num(current) < date2num(start))
        continue;
      if (current.d === end.d && date2num(current) > date2num(end))
        continue;
    }
    return true;
  }
  return false;
}

export const timeRouter = router({
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      startAt: z.date(),
      endAt: z.date(),
      repeats: z.boolean(),
    }))
    .use(requirePermission(['time']))
    .mutation(async ({ input }) => {
      const id = (
        await db.insert(times).values(input).returning({ id: times.id })
      )?.[0]?.id;
      return id;
    }),

  remove: adminProcedure
    .input(z.number().int())
    .use(requirePermission(['time']))
    .mutation(async ({ input }) => {
      await db.delete(times).where(eq(times.id, input));
    }),

  currently: protectedProcedure
    .query(async () => {
      return await fitsInTime(new Date());
    }),

  listSafe: protectedProcedure
    .query(async () => {
      return await db.query.times.findMany({
        where: eq(times.isActive, true),
        columns: {
          isActive: true,
          startAt: true,
          endAt: true,
          repeats: true,
        },
      });
    }),

  list: adminProcedure
    .use(requirePermission(['time']))
    .query(async () => {
      return await db.query.times.findMany({
        orderBy: asc(times.createdAt),
      });
    }),

  modify: adminProcedure
    .input(z.object({
      id: z.number().int(),
      name: z.string(),
      startAt: z.date(),
      endAt: z.date(),
      repeats: z.boolean(),
      isActive: z.boolean(),
    }))
    .use(requirePermission(['time']))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(times).set(data).where(eq(times.id, id));
    }),

  modifyActive: adminProcedure
    .input(z.object({
      id: z.number().int(),
      isActive: z.boolean(),
    }))
    .use(requirePermission(['time']))
    .mutation(async ({ input }) => {
      await db.update(times).set({ isActive: input.isActive }).where(eq(times.id, input.id));
    }),
});

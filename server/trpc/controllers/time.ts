import { LibsqlError } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { type TNewTime, db } from '../../db/db';
import { times } from '~/server/db/schema/time';

export class TimeController {
  async create(newTime: TNewTime) {
    try {
      const id = (await db.insert(times).values(newTime).returning({ id: times.id }))[0].id;
      return { success: true, res: id, message: '创建成功！' };
    } catch (err) {
      if (err instanceof LibsqlError && err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY')
        return { success: false, message: '时间段ID出现重复' };
      else return { success: false, message: '服务器内部错误' };
    }
  }

  async remove(id: string) {
    try {
      await db.delete(times).where(eq(times.id, id));
      return { success: true, message: '删除成功' };
    } catch (err) {
      return { success: false, message: '歌曲不存在' };
    }
  }

  async getContent(id: string) {
    try {
      const res = (await db.select().from(times).where(eq(times.id, id)))[0];
      return { success: true, res, message: '获取成功' };
    } catch (err) {
      return { success: false, message: '时间段不存在' };
    }
  }

  async modify(newTime: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    repeats: boolean;
    isActive: boolean;
  }) {
    try {
      await db.update(times).set({ ...newTime }).where(eq(times.id, newTime.id));
      return { success: true, message: '修改成功' };
    } catch (err) {
      return { success: false, message: '时间段不存在' };
    }
  }

  async modifyActive(id: string, newIsActive: boolean) {
    try {
      await db.update(times).set({ isActive: newIsActive }).where(eq(times.id, id));
      return { success: true, message: '修改成功' };
    } catch (err) {
      return { success: false, message: '时间段不存在' };
    }
  }

  async getList() {
    try {
      const res = await db.select().from(times);
      return { success: true, res, message: '获取成功' };
    } catch (err) {
      return { success: false, message: '时间段不存在' };
    }
  }

  async fitsInTime(t: Date) {
    const listRes = await this.getList();
    if (!listRes.success || !listRes.res)
      return true; // This is to prevent a total shutdown when getList breaks
    const list = listRes.res;

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
}

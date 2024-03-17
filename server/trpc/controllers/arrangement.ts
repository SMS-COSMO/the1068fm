import { LibsqlError } from '@libsql/client';
import { and, eq, gt } from 'drizzle-orm';
import type { TNewArrangement, TRawSong } from '../../db/db';
import { db } from '../../db/db';
import { SongController } from './song';
import { arrangements } from '~/server/db/schema';
import { getDateString } from '~/lib/utils';

export class ArrangementController {
  sc = new SongController();

  async create(newArrangement: TNewArrangement) {
    try {
      await db.insert(arrangements).values(newArrangement);
      return { success: true, message: '创建成功！' };
    } catch (err) {
      if (err instanceof LibsqlError && err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY')
        return { success: false, message: '排歌表ID出现重复' };
      else return { success: false, message: '服务器内部错误' };
    }
  }

  async remove(date: string) {
    try {
      await db.delete(arrangements).where(eq(arrangements.date, date));
      return { success: true, message: '删除成功' };
    } catch (err) {
      return { success: false, message: '排歌表不存在' };
    }
  }

  async getContent(date: string) {
    try {
      const res = (await db.select().from(arrangements).where(eq(arrangements.date, date)))[0];
      return { success: true, res, message: '获取成功' };
    } catch (err) {
      return { success: false, message: '排歌表不存在' };
    }
  }

  async modifySongList(date: string, newSongList: string[]) {
    try {
      await db.update(arrangements).set({ songIds: newSongList }).where(eq(arrangements.date, date));
      return { success: true, message: '修改成功' };
    } catch (err) {
      return { success: false, message: '服务器内部错误' };
    }
  }

  async modifyVisibility(date: string, isPublic: boolean) {
    try {
      await db.update(arrangements).set({ isPublic }).where(eq(arrangements.date, date));
      return { success: true, message: '修改成功' };
    } catch (err) {
      return { success: false, message: '服务器内部错误' };
    }
  }

  async getList(isPublic: boolean) {
    try {
      const arr = isPublic
        ? (await db.select().from(arrangements).where(
            and(
              eq(arrangements.isPublic, true),
              // one month
              gt(arrangements.date, getDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))),
            ),
          ))
        : (await db.select().from(arrangements).where(
          // one month
            gt(arrangements.date, getDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))),
          ));
      const res = await Promise.all(
        arr.map(async (item) => {
          const songs: TRawSong[] = [];
          for (const songId of item.songIds ?? []) {
            const res = await this.sc.getContent(songId);
            if (res.res)
              songs.push(res.res);
          }

          return {
            date: item.date,
            isPublic: item.isPublic,
            songs,
          };
        }),
      );
      return { success: true, res, message: '获取成功' };
    } catch (err) {
      return { success: false, message: '服务器内部错误' };
    }
  }
}

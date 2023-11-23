import { arrangements } from '~/server/db/schema';
import { db, TNewArrangement } from '../../db/db';
import { LibsqlError } from '@libsql/client';
import { eq } from 'drizzle-orm';

export class ArrangementController {
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
            return { success: false, message: '排歌表不存在' }
        }
    }

    async getContent(date: string) {
        try {
            const res = (await db.select().from(arrangements).where(eq(arrangements.date, date)))[0];
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '排歌表不存在' }
        }
    }

    async modifySongList(date: string, newSongList: string[]) {
        try {
            const res = (await db.select().from(arrangements).where(eq(arrangements.date, date)))[0];
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '排歌表不存在' }
        }
    }

    async getList() {
        try {
            const res = await db.select().from(arrangements);
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '排歌表不存在' }
        }
    }
}

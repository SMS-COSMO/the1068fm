import { times } from '~/server/db/schema/time';
import { type TNewTime, db } from '../../db/db';
import { LibsqlError } from '@libsql/client';
import { eq } from 'drizzle-orm';

export class TimeController {
    async create(newTime: TNewTime) {
        try {
            const id = (await db.insert(times).values(newTime).returning({ id: times.id }))[0].id;
            return { success: true, res: id, message: '创建成功！' };
        }
        catch (err) {
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
            return { success: false, message: '歌曲不存在' }
        }
    }

    async getContent(id: string) {
        try {
            const res = (await db.select().from(times).where(eq(times.id, id)))[0];
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '时间段不存在' }
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
            await db.update(times).set({
                name: newTime.name,
                startAt: newTime.startAt,
                endAt: newTime.endAt,
                repeats: newTime.repeats,
                isActive: newTime.isActive,
            }).where(eq(times.id, newTime.id));
            return { success: true, message: '修改成功' };
        } catch (err) {
            return { success: false, message: '时间段不存在' }
        }
    }

    async getList() {
        try {
            const res = await db.select().from(times);
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '时间段不存在' }
        }
    }
}

import { songs } from '~/server/db/schema';
import { type TNewSong, db } from '../../db/db';
import { LibsqlError } from '@libsql/client';
import { eq } from 'drizzle-orm';

export class SongController {
    async create(newSong: TNewSong) {
        try {
            await db.insert(songs).values(newSong);
            return { success: true, message: '创建成功！' };
        }
        catch (err) {
            if (err instanceof LibsqlError && err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY')
                return { success: false, message: '歌曲ID出现重复' };
            else return { success: false, message: '服务器内部错误' };
        }
    }

    async remove(id: string) {
        try {
            await db.delete(songs).where(eq(songs.id, id));
            return { success: true, message: '删除成功' };
        } catch (err) {
            return { success: false, message: '歌曲不存在' }
        }
    }

    async getContent(id: string) {
        try {
            const res = (await db.select().from(songs).where(eq(songs.id, id)))[0];
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '歌曲不存在' }
        }
    }

    async getList() {
        try {
            const res = await db.select().from(songs);
            return { success: true, res, message: '获取成功' };
        } catch (err) {
            return { success: false, message: '歌曲不存在' }
        }
    }
}

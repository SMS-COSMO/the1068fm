import bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import { LibsqlError } from '@libsql/client';
import { type TNewUser, type TRawUser, db } from '../../db/db';
import { refreshTokens, users } from '../../db/schema/';
import { Auth } from '../utils/auth';

export class UserController {
  private auth: Auth;

  constructor() {
    this.auth = new Auth();
  }

  async register(newUser: TNewUser) {
    const { id, password } = newUser;
    const hash = await bcrypt.hash(password, 8);
    const user = { id, password: hash };
    try {
      await db.insert(users).values(user);
      return { success: true, message: '注册成功！' };
    } catch (err) {
      if (err instanceof LibsqlError)
        return { success: false, message: '用户名出现重复' };
      else return { success: false, message: '服务器内部错误' };
    }
  }

  async getUserFromHeader(token: string | undefined) {
    if (!token)
      return undefined;
    const result = await this.auth.getUserFromToken(token);
    if (result.err)
      return undefined;
    return result.user;
  }

  async login(id: string, password: string) {
    const user = (await db.select().from(users).where(eq(users.id, id)))[0];
    if (!(user && (await bcrypt.compare(password, user.password))))
      return;
    const accessToken = await this.auth.produceAccessToken(user.id);
    const refreshToken = await this.auth.produceRefreshToken(user.id);
    return { userId: user.id, accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string, id: string) {
    const token = await db
      .delete(refreshTokens)
      .where(and(eq(refreshTokens.token, refreshToken), eq(refreshTokens.owner, id)))
      .returning();
    if (!token[0])
      return;
    const newRefreshToken = await this.auth.produceRefreshToken(id);
    const newAccessToken = await this.auth.produceAccessToken(id);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async modifyPassword(user: TRawUser, oldPassword: string, newPassword: string) {
    if (!await bcrypt.compare(oldPassword, user.password))
      return { success: false, message: '旧密码不正确' };
    if (newPassword === oldPassword)
      return { success: false, message: '新密码不能与旧密码相同' };

    await db.update(users).set({ password: await bcrypt.hash(newPassword, 8) }).where(eq(users.id, user.id));
    return { success: true, message: '修改成功' };
  }
}

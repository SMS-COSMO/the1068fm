import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

export const formSchema = toTypedSchema(z.object({
name: z.string().min(1, '歌名长度至少为1').max(50, '歌名长度最大为50'),
creator: z.string().min(1, '歌手名长度至少为1').max(50, '歌手长度最大为50'),
submitterName: z.string().min(2, '申请者名字长度至少为2').max(15, '申请者名字长度最大为15'),
// submitterGrade: z.number().min(1000).max(5000), // problem for people in 5000s
submitterClass: z.number().min(0, '班级号应大于0').max(100, '班级号应小于100'),
type: z.enum(['normal', 'withMsg'], { errorMap: () => ({ message: '提交了不存在的歌曲类型' }) }),
}));

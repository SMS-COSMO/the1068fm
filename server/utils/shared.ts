import { TRPCError } from '@trpc/server';

export const TRPCForbidden = new TRPCError({ code: 'FORBIDDEN', message: '超出权限范围' });

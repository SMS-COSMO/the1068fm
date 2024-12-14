import type { TPermission } from '~~/types';
import type { Context } from './context';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.context<Context>().create({
  transformer: superjson,

  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.errors
            : null,
      },
    };
  },
});

export const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user)
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '用户未登录' });
  else if (ctx.user === 'ERR_JWT_EXPIRED')
    throw new TRPCError({ code: 'UNAUTHORIZED', message: '登录已过期' });

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export function requirePermission(permissions: TPermission[]) {
  // `unstable_` means this is a new API but it's safe to use
  //  @see https://trpc.io/docs/server/middlewares#extending-middlewares
  return enforceUserIsAuthed.unstable_pipe(({ ctx, next }) => {
    for (const permission of permissions) {
      if (!ctx.user.permissions.includes(permission))
        throw new TRPCError({ code: 'FORBIDDEN', message: '超出权限范围' });
    }

    return next({
      ctx: {
        user: ctx.user,
      },
    });
  });
}

/**
 * Unprotected procedure
 */
export const router = t.router;
export const middleware = t.middleware;

export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed).use(requirePermission(['login']));
export const adminProcedure = publicProcedure.use(enforceUserIsAuthed).use(requirePermission(['login', 'admin']));

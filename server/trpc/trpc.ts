import { TRPCError, initTRPC } from '@trpc/server'
import { Context } from '~/server/trpc/context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
    transformer: superjson,
})

export const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user)
        throw new TRPCError({ code: 'UNAUTHORIZED', message: '用户未登录' });

    return next({
        ctx: {
            user: ctx.user,
        }
    });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const router = t.router;
export const middleware = t.middleware;

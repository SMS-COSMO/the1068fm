import { userRouter } from './user';
import { publicProcedure, router } from '../trpc';
import { songRouter } from './song';

export const appRouter = router({
  status: publicProcedure.query(() => 'Hola! This is working'),
  user: userRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter

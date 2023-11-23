import { userRouter } from './user';
import { publicProcedure, router } from '../trpc';
import { songRouter } from './song';
import { arrangementRouter } from './arrangement';

export const appRouter = router({
  status: publicProcedure.query(() => 'Hola! This is working'),
  user: userRouter,
  song: songRouter,
  arrangement: arrangementRouter,
});

export type AppRouter = typeof appRouter;

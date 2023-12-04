import { publicProcedure, router } from '../trpc';
import { userRouter } from './user';
import { songRouter } from './song';
import { timeRouter } from './time';
import { arrangementRouter } from './arrangement';

export const appRouter = router({
  status: publicProcedure.query(() => 'Hola! This is working'),
  user: userRouter,
  song: songRouter,
  time: timeRouter,
  arrangement: arrangementRouter,
});

export type AppRouter = typeof appRouter;

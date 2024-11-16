import { router } from '../trpc';
import { songRouter } from './song';
import { timeRouter } from './time';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  song: songRouter,
  time: timeRouter,
});

export type AppRouter = typeof appRouter;

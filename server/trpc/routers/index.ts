import { router } from '../trpc';
import { songRouter } from './song';
import { statsRouter } from './stats';
import { timeRouter } from './time';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  song: songRouter,
  time: timeRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;

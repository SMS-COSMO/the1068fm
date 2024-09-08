import { router } from '../trpc';
import { arrangementRouter } from './arrangement';
import { songRouter } from './song';
import { timeRouter } from './time';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  song: songRouter,
  time: timeRouter,
  arrangement: arrangementRouter,
});

export type AppRouter = typeof appRouter;

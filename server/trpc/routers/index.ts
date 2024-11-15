import { router } from '../trpc';
import { songRouter } from './song';
import { userRouter } from './user';

export const appRouter = router({
  user: userRouter,
  song: songRouter,
});

export type AppRouter = typeof appRouter;

import process from 'node:process';
import type { inferAsyncReturnType } from '@trpc/server';
import type { H3Event } from 'h3';
import { db } from '../db/db';
import type { TRawArrangement, TRawSong, TRawTime, TRawUser } from '../db/db';

import { UserController } from './controllers/user';
import { SongController } from './controllers/song';
import { ArrangementController } from './controllers/arrangement';
import { TimeController } from './controllers/time';

const newGlobal = globalThis as unknown as {
  userController: UserController | undefined;
  songController: SongController | undefined;
  timeController: TimeController | undefined;
  arrangementController: ArrangementController | undefined;
};

const userController = newGlobal.userController ?? new UserController();
const songController = newGlobal.songController ?? new SongController();
const timeController = newGlobal.timeController ?? new TimeController();
const arrangementController = newGlobal.arrangementController ?? new ArrangementController();

if (process.env.NODE_ENV !== 'production') {
  newGlobal.userController = userController;
  newGlobal.songController = songController;
  newGlobal.timeController = timeController;
  newGlobal.arrangementController = arrangementController;
}

interface CreateContextOptions {
  user?: TRawUser;
  song?: TRawSong;
  time?: TRawTime;
  arrangement?: TRawArrangement;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 * @credits https://create.t3.gg/en/usage/trpc#-servertrpccontextts'
 */
export function createInnerContext(opts: CreateContextOptions) {
  return {
    user: opts.user,
    db,
    userController,
    songController,
    timeController,
    arrangementController,
  };
}

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  const authorization = getRequestHeader(event, 'authorization');
  const user = await userController.getUserFromHeader(authorization);
  return createInnerContext({ user });
}

export type Context = inferAsyncReturnType<typeof createContext>;

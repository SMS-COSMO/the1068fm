import type { inferAsyncReturnType } from '@trpc/server';
import type { H3Event } from 'h3';
import { getUserFromHeader } from '../utils/auth';

export async function createContext(event: H3Event) {
  const header = getRequestHeader(event, 'Authorization');
  const user = await getUserFromHeader(header);

  return {
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

import { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '~/server/trpc/routers';

export function useIsTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

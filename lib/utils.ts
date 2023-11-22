import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TRPCClientError } from '@trpc/client';
import type { AppRouter } from '~/server/trpc/routers'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

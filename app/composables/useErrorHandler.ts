import type { AppRouter } from '~~/server/trpc/routers';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'vue-sonner';

export function useIsTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

export async function useErrorHandler(err: unknown) {
  if (useIsTRPCClientError(err)) {
    if (err.data?.zodError) {
      for (const issue of err.data.zodError)
        toast.error(issue.message);
    } else {
      toast.error(err.message);
      if (err.message === '用户未登录') {
        useUserStore().logout();
        onNuxtReady(() => navigateTo('/login'));
      } else if (err.message === '登录已过期') {
        onNuxtReady(() => {
          useUserStore().logout();
          navigateTo('/login');
        });
      }
    }
  } else {
    toast.error('未知错误');
  }
}

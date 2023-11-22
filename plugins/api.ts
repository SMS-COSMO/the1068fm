import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '~/server/trpc/routers'
import superjson from 'superjson'


export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const api = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers() {
          const userStore = useUserStore();
          return {
            Authorization: userStore.accessToken,
          };
        },
      }),
    ],
    transformer: superjson
  })

  return {
    provide: {
      api,
    },
  }
})

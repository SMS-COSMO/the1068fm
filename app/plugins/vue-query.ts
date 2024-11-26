import type {
  DehydratedState,
  VueQueryPluginOptions,
} from '@tanstack/vue-query';
import {
  dehydrate,
  hydrate,
  QueryCache,
  QueryClient,
  VueQueryPlugin,
} from '@tanstack/vue-query';
// Nuxt 3 app aliases

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query');

  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5000, retry: false } },
    queryCache: new QueryCache({
      onError: async (error) => {
        await useErrorHandler(error);
      },
    }),
  });
  const options: VueQueryPluginOptions = { queryClient };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }
});
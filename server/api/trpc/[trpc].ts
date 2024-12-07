import { createNuxtApiHandler } from 'trpc-nuxt';
import { createContext } from '../../trpc/context';
import { appRouter } from '../../trpc/routers';

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext,
});

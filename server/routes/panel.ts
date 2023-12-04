import { renderTrpcPanel } from 'trpc-panel';
import { env } from '../env';
import { appRouter } from '../trpc/routers/index';

export default defineEventHandler((_event) => {
  if (env.NODE_ENV === 'development')
    return renderTrpcPanel(appRouter, { url: `${env.SERVER_URL}/api/trpc`, transformer: 'superjson' });
  else
    return 'Not in dev environment.';
});

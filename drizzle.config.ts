import type { Config } from 'drizzle-kit';
import { env } from './server/env';

const dbCredentials = (() => {
  switch (env.DATABASE_CONNECTION_TYPE) {
    case 'local': return { url: 'file:local.sqlite' };
    case 'remote': return { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN };
  }
})();

export default {
  schema: './server/db/schema/index.ts',
  out: './drizzle',
  driver: 'turso',
  dbCredentials,
  tablesFilter: ['!libsql_wasm_func_table'],
} satisfies Config;

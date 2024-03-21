import type { Config } from 'drizzle-kit';

const dbCredentials = { url: 'file:local.sqlite' };

export default {
  schema: './server/db/schema/index.ts',
  out: './drizzle',
  dbCredentials,
  driver: 'libsql',
} satisfies Config;

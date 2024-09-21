import type { Config } from 'drizzle-kit';
import { env } from './server/env';

export default {
  schema: './server/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;

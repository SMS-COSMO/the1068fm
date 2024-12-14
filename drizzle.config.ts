import { defineConfig } from 'drizzle-kit';
import { env } from './server/env';
import 'dotenv/config';

export default defineConfig({
  out: './drizzle',
  schema: './server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

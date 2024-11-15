import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../env';

import * as schema from './schema';

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  schema,
});

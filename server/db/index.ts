import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../env';
import * as schema from './schema';

import 'dotenv/config';

export const db = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
  },
  schema,
});

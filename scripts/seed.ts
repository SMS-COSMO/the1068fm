import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';
import * as schema from '~~/server/db/schema';
import { env } from '~~/server/env';

async function main() {
  const db = drizzle(env.DATABASE_URL);
  await seed(db, schema);
}

main();

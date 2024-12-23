import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
// path to a file with schema you want to reset
import * as schema from '~~/server/db/schema';
import { env } from '~~/server/env';

async function main() {
  const db = drizzle(env.DATABASE_URL);
  await reset(db, schema);
}

main();

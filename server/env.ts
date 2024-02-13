import process from 'node:process';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_CONNECTION_TYPE: z.enum(['remote', 'local']),
  DATABASE_AUTH_TOKEN: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
  SIGN_PUBLIC_KEY: z.string(),
  SIGN_PRIVATE_KEY: z.string(),
  ENC_PUBLIC_KEY: z.string(),
  ENC_PRIVATE_KEY: z.string(),
  SIGN_KID: z.string(),
  ENC_KID: z.string(),
  SERVER_URL: z.string(),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  console.error('[ERROR] Invalid environment variables:', JSON.stringify(envParse.error.format(), null, 4));
  process.exit(1);
}
export const env = envParse.data;

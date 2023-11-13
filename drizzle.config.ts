import {env} from '$/lib/server/env';
import type {Config} from 'drizzle-kit';

export default {
  schema: './src/lib/server/schema.ts',
  out: './migrations',
  driver: 'turso',
  dbCredentials: {
    url: env.NODE_ENV === 'production' ? env.TURSO_URL : 'file:./local.db',
    authToken: env.NODE_ENV === 'production' ? env.TURSO_AUTH_TOKEN : '',
  },
  strict: true,
  verbose: true,
} satisfies Config;

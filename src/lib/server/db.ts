import {createClient} from '@libsql/client';
import {drizzle} from 'drizzle-orm/libsql';

export const dbClient = createClient({
  url: import.meta.env.DEV ? 'file:./local.db' : import.meta.env.TURSO_URL,
  authToken: import.meta.env.DEV ? '' : import.meta.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(dbClient);
import {libsql} from '@lucia-auth/adapter-sqlite';
import {lucia} from 'lucia';
import {astro} from 'lucia/middleware';
import {dbClient} from './db';

export const auth = lucia({
  env: import.meta.env.DEV ? 'DEV' : 'PROD',
  middleware: astro(),
  adapter: libsql(dbClient, {
    user: 'user',
    key: 'user_key',
    session: 'user_session',
  }),
  getUserAttributes: ({avatar, email, forename, surname}) => ({avatar, email, forename, surname}),
});

// TYPES ===================================================================================================================================
export type Auth = typeof auth;

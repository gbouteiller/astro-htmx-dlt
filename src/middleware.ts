import {auth} from '$/lib/server/lucia';
import {defineMiddleware} from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.auth = auth.handleRequest(context);
  return await next();
});

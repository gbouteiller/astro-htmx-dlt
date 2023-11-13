import {LibsqlError} from '@libsql/client';
import type {AstroGlobal} from 'astro';
import {LuciaError, type Session} from 'lucia';
import type {ZodType} from 'zod';
import {SIGNIN, SIGNUP, zSignin, zSignup, type Signin, type Signup} from '../utils';
import {auth} from './lucia';
import {useForm, type UseForm} from './utils.form';

export * from './utils.form';

// METHODS =================================================================================================================================
export async function processSignin(Astro: AstroGlobal) {
  const formy = useForm('signin', SIGNIN);
  if (['PATCH', 'POST'].includes(Astro.request.method)) await validateSignin(Astro, formy);
  if (Astro.request.method === 'POST' && formy.form.valid) await submitSignin(Astro, formy);
  return formy;
}

export async function validateSignin(Astro: AstroGlobal, {addErrors, addFormError, addValues}: UseForm<Signin>) {
  const rUnsafe = await getUnsafe<Signin>(Astro.request);
  if (!rUnsafe.success) return addFormError(rUnsafe.error);
  const rParsed = zSignin.safeParse(rUnsafe.data);
  if (!rParsed.success) return addErrors(rParsed.error.flatten(), rUnsafe.data);
  addValues(rParsed.data);
}

export async function submitSignin(Astro: AstroGlobal, {addFormError, form}: UseForm<Signin>) {
  const rSignin = await signin(form.data);
  if (!rSignin.success) return addFormError(rSignin.error.message, form.data);
  Astro.locals.auth.setSession(rSignin.data);
}

export async function signin({email, password}: Signin) {
  try {
    const {userId} = await auth.useKey('email', email, password);
    const session = await auth.createSession({userId, attributes: {}});
    return {success: true as const, data: session};
  } catch (error_) {
    if (error_ instanceof LuciaError && (error_.message === 'AUTH_INVALID_KEY_ID' || error_.message === 'AUTH_INVALID_PASSWORD'))
      return {success: false as const, error: {message: 'Les identifiants sont invalides.', status: 401 as const}};
    console.error(error_);
    return {success: false as const, error: {message: 'Erreur inconnue! Veuillez réessayer ultérieurement.', status: 500 as const}};
  }
}

export async function processSignout(Astro: AstroGlobal) {
  const formy = useForm<undefined>('signout');
  if (Astro.request.method === 'POST' && formy.form.valid) await submitSignout(Astro);
  return formy;
}

export async function submitSignout(Astro: AstroGlobal) {
  const session = await Astro.locals.auth.validate();
  await signout(session);
  // eslint-disable-next-line unicorn/no-null
  Astro.locals.auth.setSession(null);
}

export async function signout(session: Session | null) {
  if (session) await auth.invalidateSession(session.sessionId);
}

export async function processSignup(Astro: AstroGlobal) {
  const formy = useForm('signup', SIGNUP);
  if (['PATCH', 'POST'].includes(Astro.request.method)) await validateSignup(Astro, formy);
  if (Astro.request.method === 'POST' && formy.form.valid) await submitSignup(Astro, formy);
  return formy;
}

export async function validateSignup(Astro: AstroGlobal, {addErrors, addFormError, addValues}: UseForm<Signup>) {
  const rUnsafe = await getUnsafe<Signup>(Astro.request);
  if (!rUnsafe.success) return addFormError(rUnsafe.error);
  const rParsed = zSignup.safeParse(rUnsafe.data);
  if (!rParsed.success) return addErrors(rParsed.error.flatten(), rUnsafe.data);
  addValues(rParsed.data);
}

export async function submitSignup(Astro: AstroGlobal, {addFormError, form}: UseForm<Signup>) {
  const rSignup = await signup(form.data);
  if (!rSignup.success) return addFormError(rSignup.error.message, form.data);
  Astro.locals.auth.setSession(rSignup.data);
}

export async function signup({avatar, email, forename, password, surname}: Signup) {
  try {
    const {userId} = await auth.createUser({
      key: {providerId: 'email', providerUserId: email, password},
      attributes: {avatar, email, forename, surname},
    });
    const session = await auth.createSession({userId, attributes: {}});
    return {success: true as const, data: session};
  } catch (error_) {
    if (error_ instanceof LibsqlError && error_.code === 'SQLITE_CONSTRAINT_UNIQUE')
      return {success: false as const, error: {message: 'Vous possédez déjà un compte. Veuillez vous connecter', status: 400 as const}};
    console.error(error_);
    return {success: false as const, error: {message: 'Erreur inconnue! Veuillez réessayer ultérieurement.', status: 500 as const}};
  }
}

export async function getUnsafe<D extends Record<string, unknown>>(
  request: Request
): Promise<{success: true; data: D} | {success: false; error: string}> {
  try {
    const data = await request.formData();
    return {success: true as const, data: Object.fromEntries(data.entries()) as D};
  } catch (error) {
    console.error(error);
    return {success: false as const, error: 'Erreur de récupération des données.'};
  }
}

export async function superValidate<D extends Record<string, unknown>>(request: Request, schema: ZodType<D>): Promise<Res<D, Err>> {
  try {
    const data = await request.formData();
    const rParsed = schema.safeParse(Object.fromEntries(data.entries()));
    return rParsed.success ? rParsed : {success: false as const, error: {message: 'Le formulaire est invalide.', status: 400}};
  } catch (error) {
    console.error(error);
    return {success: false as const, error: {message: 'Erreur de récupération des données.', status: 400}};
  }
}

// TYPES ===================================================================================================================================
export type Res<D, E> = {success: true; data: D} | {success: false; error: E};
export type Err = {message: string; status: 400 | 500; };

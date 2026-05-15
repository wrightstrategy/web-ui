/*
 * Stub auth conventions. This file ships the SHAPE of auth — cookie name,
 * session type, redirect-on-no-session helper — without any of the actual
 * infrastructure. It exists so apps have a consistent place to slot real
 * auth into when the homepage/SSO project lands.
 *
 * What this is NOT:
 * - Password hashing (no argon2, bcrypt, or anything else)
 * - Server-side session store (no DB, no KV, no expiry tracking)
 * - Signed cookies (the cookie is base64-encoded plaintext JSON — a user
 *   can craft any session they want)
 * - OAuth / SSO / passkeys
 * - CSRF beyond what SvelteKit defaults give you
 *
 * Real apps replace setSession / getSession with the real auth provider's
 * primitives. The function names and the SESSION_COOKIE constant stay
 * stable so callers (requireSession) don't need to change.
 */

import { redirect, type Cookies } from '@sveltejs/kit';

export const SESSION_COOKIE = 'wf_session';

export type Session = {
  userId: string;
  username: string;
};

export function getSession(cookies: Cookies): Session | null {
  const raw = cookies.get(SESSION_COOKIE);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(atob(raw)) as unknown;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as { userId?: unknown }).userId === 'string' &&
      typeof (parsed as { username?: unknown }).username === 'string'
    ) {
      return parsed as Session;
    }
  } catch {
    /* malformed cookie — treat as no session */
  }
  return null;
}

export function setSession(cookies: Cookies, session: Session): void {
  cookies.set(SESSION_COOKIE, btoa(JSON.stringify(session)), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSession(cookies: Cookies): void {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

/** Throw a redirect to /login if there's no session.
 *  Use from `+page.server.ts` / `+layout.server.ts` load functions:
 *      const session = requireSession(event);
 */
export function requireSession(event: { cookies: Cookies; url: URL }): Session {
  const session = getSession(event.cookies);
  if (!session) redirectToLogin(event.url);
  return session;
}

/** Throw a redirect to /login, preserving the current path as ?next= so
 *  the user lands back here after a successful sign-in. */
export function redirectToLogin(currentUrl: URL): never {
  const next = encodeURIComponent(currentUrl.pathname + currentUrl.search);
  redirect(303, `/login?next=${next}`);
}

/** Read the ?next= param from a URL and redirect there, or fall back to
 *  the home page. Used by the login action after setSession(). */
export function redirectAfterLogin(url: URL, fallback = '/'): never {
  const raw = url.searchParams.get('next');
  // Allow only same-origin paths starting with "/" — prevents open-redirect
  // abuse like ?next=https://evil.example.com.
  const safe = raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : fallback;
  redirect(303, safe);
}

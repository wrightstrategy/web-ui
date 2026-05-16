// templates/app/src/lib/server/auth-policy.ts
import type { AuthPolicy } from './auth';

/**
 * App-local auth policy. The kit ships 'authenticated' as the default — every
 * page requires a Pocket ID-authenticated user via Traefik+TinyAuth.
 *
 * To change the tier, edit this file and restart the dev server.
 *
 *   No Auth      — internal / low-risk apps that don't need identity
 *                  enforcement. event.locals.user may still be populated
 *                  if Traefik provides headers, but is not required.
 *
 *     export const authPolicy: AuthPolicy = { mode: 'none' };
 *
 *   Authenticated (default) — any Pocket ID user may access the app.
 *
 *     export const authPolicy: AuthPolicy = { mode: 'authenticated' };
 *
 *   Authorized   — only explicitly allowed users / groups / subs. Configure
 *                  at least one allowlist; fail-closed if all three are empty.
 *
 *     export const authPolicy: AuthPolicy = {
 *       mode: 'authorized',
 *       allowedGroups: ['admins'],
 *       allowedUsers: ['scott'],
 *       allowedSubs: ['sub-12345'],
 *     };
 */
export const authPolicy: AuthPolicy = {
  mode: 'authenticated',
};

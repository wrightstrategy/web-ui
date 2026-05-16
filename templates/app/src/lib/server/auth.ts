import { error, type RequestEvent } from '@sveltejs/kit';

export type User = {
  /** OIDC stable subject ID (Remote-Sub). Use for foreign keys / audit. */
  sub: string;
  /** Pocket ID preferred_username (Remote-User). Login handle. */
  username: string;
  /** Remote-Email. Empty string if Pocket ID has no email for this user. */
  email: string;
  /** Remote-Name display name. Falls back to username if absent. */
  name: string;
  /** Remote-Groups, comma-split and trimmed. Empty array if none. */
  groups: string[];
};

export function getUser(event: RequestEvent): User | null {
  return event.locals.user;
}

export function requireUser(event: RequestEvent): User {
  if (!event.locals.user) error(401, 'Unauthorized');
  return event.locals.user;
}

export type AuthMode = 'none' | 'authenticated' | 'authorized';

export type AuthPolicy = {
  mode: AuthMode;
  /** Match if user.groups contains any of these. */
  allowedGroups?: string[];
  /** Match if user.username equals any of these. */
  allowedUsers?: string[];
  /** Match if user.sub equals any of these. */
  allowedSubs?: string[];
};

/**
 * Apply an auth policy to a (possibly null) user. Pure-ish: throws 401 or 403
 * via SvelteKit's `error()` for failure cases; otherwise returns the user
 * (or null when mode is 'none' and no user is present).
 *
 * - mode 'none':           passthrough — returns user (or null) without checking.
 * - mode 'authenticated':  null user → 401. Any present user → pass.
 * - mode 'authorized':     null user → 401. User must match at least one of
 *                          allowedSubs / allowedUsers / allowedGroups. With no
 *                          allowlist arrays configured, fail closed → 403.
 *                          A user that doesn't match → 403.
 */
export function authorizeUser(user: User | null, policy: AuthPolicy): User | null {
  if (policy.mode === 'none') return user;
  if (!user) error(401, 'Unauthorized');
  if (policy.mode === 'authenticated') return user;
  // policy.mode === 'authorized'
  const allowedSubs = policy.allowedSubs ?? [];
  const allowedUsers = policy.allowedUsers ?? [];
  const allowedGroups = policy.allowedGroups ?? [];
  if (allowedSubs.length + allowedUsers.length + allowedGroups.length === 0) {
    // Fail closed: 'authorized' with no allowlist is a configuration error.
    error(403, 'Forbidden');
  }
  const subMatch = allowedSubs.includes(user.sub);
  const userMatch = allowedUsers.includes(user.username);
  const groupMatch = user.groups.some((g) => allowedGroups.includes(g));
  if (subMatch || userMatch || groupMatch) return user;
  error(403, 'Forbidden');
}

/**
 * Convenience: read `event.locals.user` and run it through `authorizeUser`.
 * Use this from `+layout.server.ts` / `+page.server.ts` load functions.
 */
export function requireAuthorizedUser(
  event: RequestEvent,
  policy: AuthPolicy,
): User | null {
  return authorizeUser(event.locals.user, policy);
}

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

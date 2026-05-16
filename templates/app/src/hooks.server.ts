import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { User } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = readUser(event.request);
  return resolve(event);
};

function readUser(request: Request): User | null {
  const sub = request.headers.get('Remote-Sub')?.trim();
  const username = request.headers.get('Remote-User')?.trim();
  if (sub && username) {
    return {
      sub,
      username,
      email: request.headers.get('Remote-Email')?.trim() ?? '',
      name: request.headers.get('Remote-Name')?.trim() || username,
      groups: parseGroups(request.headers.get('Remote-Groups')),
    };
  }
  if (dev && env.WRIGHT_DEV_USER) {
    const u = env.WRIGHT_DEV_USER;
    return {
      sub: `dev-${u}`,
      username: u,
      email: `${u}@dev.local`,
      name: u,
      groups: parseGroups(env.WRIGHT_DEV_GROUPS ?? null),
    };
  }
  return null;
}

function parseGroups(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

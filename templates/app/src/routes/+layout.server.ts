import type { LayoutServerLoad } from './$types';
import { requireUser } from '$lib/server/auth';

export const load: LayoutServerLoad = (event) => {
  // Returns the full User including `groups`. Group names are not
  // considered sensitive in this homelab context (values like
  // "admins" / "family") so we ship them to the client for use in
  // group-gated UI. If a future app needs to hide group names from
  // the browser, narrow this to { sub, username, email, name }.
  return { user: requireUser(event) };
};

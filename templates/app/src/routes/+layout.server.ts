import type { LayoutServerLoad } from './$types';
import { requireAuthorizedUser } from '$lib/server/auth';
import { authPolicy } from '$lib/server/auth-policy';

export const load: LayoutServerLoad = (event) => {
  // Returns the full User including `groups`. Group names are not
  // considered sensitive in this homelab context (values like
  // "admins" / "family") so we ship them to the client for use in
  // group-gated UI. If a future app needs to hide group names from
  // the browser, narrow this to { sub, username, email, name }.
  //
  // `user` may be null when authPolicy.mode === 'none'. Consumers
  // (including +layout.svelte) must handle the nullable case.
  return {
    user: requireAuthorizedUser(event, authPolicy),
    authMode: authPolicy.mode,
  };
};

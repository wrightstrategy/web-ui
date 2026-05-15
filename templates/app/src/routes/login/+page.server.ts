import { fail } from '@sveltejs/kit';
import {
  clearSession,
  getSession,
  redirectAfterLogin,
  setSession,
} from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, url }) => {
  // Already signed in? Bounce to the requested destination (or home).
  if (getSession(cookies)) redirectAfterLogin(url);
  return {};
};

export const actions: Actions = {
  signin: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const username = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');

    if (!username || !password) {
      // Re-render the form with the typed username + an inline error.
      return fail(400, {
        username,
        error: 'Enter both a username and a password.',
      });
    }

    // STUB: any non-empty credential pair is accepted. Real auth replaces
    // this block (look up user, verify hash, etc.). Keep the rest of the
    // function intact so the conventions don't drift.
    setSession(cookies, { userId: username, username });
    redirectAfterLogin(url);
  },

  logout: async ({ cookies, url }) => {
    clearSession(cookies);
    redirectAfterLogin(url, '/login');
  },
};

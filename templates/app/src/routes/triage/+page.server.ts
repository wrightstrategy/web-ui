import { fail, redirect } from '@sveltejs/kit';
import {
  approveTriage,
  deferTriage,
  listTriage,
  rejectTriage,
  resetTriage,
} from '$lib/server/mock-queue';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const pending = listTriage();
  // Pop one card at a time, oldest first.
  const current = pending[0] ?? null;
  return {
    current,
    remaining: pending.length,
    lastAction: url.searchParams.get('did'),
    lastId: url.searchParams.get('on'),
  };
};

async function readId(request: Request): Promise<string | null> {
  const data = await request.formData();
  const id = data.get('id');
  return typeof id === 'string' ? id : null;
}

export const actions: Actions = {
  approve: async ({ request }) => {
    const id = await readId(request);
    if (!id) return fail(400, { error: 'Missing id.' });
    approveTriage(id);
    redirect(303, `/triage?did=approved&on=${encodeURIComponent(id)}`);
  },
  reject: async ({ request }) => {
    const id = await readId(request);
    if (!id) return fail(400, { error: 'Missing id.' });
    rejectTriage(id);
    redirect(303, `/triage?did=rejected&on=${encodeURIComponent(id)}`);
  },
  defer: async ({ request }) => {
    const id = await readId(request);
    if (!id) return fail(400, { error: 'Missing id.' });
    deferTriage(id);
    redirect(303, `/triage?did=deferred&on=${encodeURIComponent(id)}`);
  },
  reset: async () => {
    resetTriage();
    redirect(303, '/triage');
  },
};

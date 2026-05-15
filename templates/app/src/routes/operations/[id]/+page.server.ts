import { error, redirect } from '@sveltejs/kit';
import { cancelJob, findJob, retryJob } from '$lib/server/mock-operations';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, depends }) => {
  // Register the invalidation key the page polls against. Calling
  // invalidate('app:operation') from the client re-runs this load.
  depends('app:operation');
  const job = findJob(params.id);
  if (!job) error(404, `Job ${params.id} not found.`);
  return { job };
};

export const actions: Actions = {
  cancel: async ({ params }) => {
    cancelJob(params.id);
    redirect(303, `/operations/${params.id}?cancelled=1`);
  },
  retry: async ({ params }) => {
    retryJob(params.id);
    redirect(303, `/operations/${params.id}?retried=1`);
  },
};

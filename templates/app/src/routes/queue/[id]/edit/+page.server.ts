import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { editSchema } from '$lib/schemas';
import { findRow, updateRow } from '$lib/server/mock-queue';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const row = findRow(params.id);
  if (!row) error(404, `Document ${params.id} not found.`);

  // Seed the form with the row's current values.
  const form = await superValidate(
    {
      title: row.title,
      source: row.source,
      confidence: row.confidence,
      tags: row.tags,
      notes: row.notes,
    },
    zod4(editSchema)
  );

  return {
    row,
    form,
    saved: url.searchParams.get('saved') === '1',
  };
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const row = findRow(params.id);
    if (!row) error(404, 'Document not found.');

    const form = await superValidate(request, zod4(editSchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    updateRow(params.id, {
      title: form.data.title,
      source: form.data.source,
      confidence: form.data.confidence,
      tags: form.data.tags,
      notes: form.data.notes,
    });

    // PRG pattern: redirect on success so a refresh doesn't resubmit.
    // The ?saved=1 drives the server-rendered "Saved" banner — the
    // no-JS coherent fallback that pairs with the client toast.
    redirect(303, `/queue/${params.id}/edit?saved=1`);
  },
};

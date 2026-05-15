import { error } from '@sveltejs/kit';
import { listRows, type QueueStatus } from '$lib/server/mock-queue';
import type { PageServerLoad } from './$types';

// No client-side rendering for this route — pure server-rendered HTML.
// Form submissions are plain GET to /queue?q=...&status=...
export const csr = false;

export type { QueueStatus };

export const load: PageServerLoad = async ({ url }) => {
  // Built-in error-state demo: visit /queue?error=1 to render +error.svelte.
  if (url.searchParams.get('error') === '1') {
    error(503, 'Queue temporarily unavailable.');
  }

  const all = listRows();
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const status = (url.searchParams.get('status') ?? '') as QueueStatus | '';
  const savedId = url.searchParams.get('saved');

  const rows = all.filter((r) => {
    if (q && !(r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))) return false;
    if (status && r.status !== status) return false;
    return true;
  });

  return {
    rows,
    filters: {
      q: url.searchParams.get('q') ?? '',
      status,
    },
    counts: {
      total: all.length,
      filtered: rows.length,
    },
    savedId,
  };
};

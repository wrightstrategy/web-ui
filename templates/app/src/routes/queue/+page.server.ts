import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// No client-side rendering for this route — pure server-rendered HTML.
// Form submissions are plain GET to /queue?q=...&status=...
export const csr = false;

export type QueueStatus = 'needs_review' | 'auto' | 'error';

export type QueueRow = {
  id: string;
  title: string;
  status: QueueStatus;
  confidence: number;
  source: string;
  ts: string;
};

const ALL_ROWS: QueueRow[] = [
  { id: 'DOC-1842', title: 'Rivian Purchase Agreement', status: 'needs_review', confidence: 78, source: 'Paperless', ts: '2h ago' },
  { id: 'DOC-1841', title: 'May Electricity Bill',       status: 'auto',         confidence: 96, source: 'Paperless', ts: '4h ago' },
  { id: 'DOC-1840', title: 'School Permission Slip',     status: 'needs_review', confidence: 81, source: 'Scan-router', ts: '6h ago' },
  { id: 'DOC-1839', title: 'Costco receipt · 5/12',      status: 'auto',         confidence: 92, source: 'Email',       ts: '1d ago' },
  { id: 'DOC-1838', title: 'IRS form 1099-DIV',          status: 'needs_review', confidence: 72, source: 'Paperless', ts: '2d ago' },
  { id: 'DOC-1837', title: 'Costco receipt · 5/9',       status: 'error',        confidence: 0,  source: 'Email',       ts: '2d ago' },
  { id: 'DOC-1836', title: 'HOA quarterly statement',    status: 'auto',         confidence: 99, source: 'Paperless', ts: '3d ago' },
  { id: 'DOC-1835', title: 'Vehicle registration · 2026', status: 'needs_review', confidence: 83, source: 'Scan-router', ts: '4d ago' },
  { id: 'DOC-1834', title: 'AT&T fiber bill · May',      status: 'auto',         confidence: 97, source: 'Paperless', ts: '4d ago' },
  { id: 'DOC-1833', title: 'Dental insurance EOB',       status: 'auto',         confidence: 94, source: 'Paperless', ts: '5d ago' },
];

export const load: PageServerLoad = async ({ url }) => {
  // Built-in error-state demo: visit /queue?error=1 to render +error.svelte.
  if (url.searchParams.get('error') === '1') {
    error(503, 'Queue temporarily unavailable.');
  }

  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const status = (url.searchParams.get('status') ?? '') as QueueStatus | '';

  const rows = ALL_ROWS.filter((r) => {
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
      total: ALL_ROWS.length,
      filtered: rows.length,
    },
  };
};

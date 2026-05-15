// Server-only mock data store. SvelteKit's $lib/server convention keeps
// this out of the client bundle. Shared by /queue and /queue/[id]/edit.

export type QueueStatus = 'needs_review' | 'auto' | 'error';

export type QueueRow = {
  id: string;
  title: string;
  status: QueueStatus;
  confidence: number;
  source: 'Paperless' | 'Scan-router' | 'Email' | 'Other';
  ts: string;
  tags: string;
  notes: string;
};

const ROWS: QueueRow[] = [
  { id: 'DOC-1842', title: 'Rivian Purchase Agreement', status: 'needs_review', confidence: 78, source: 'Paperless', ts: '2h ago', tags: 'vehicle, contract', notes: '' },
  { id: 'DOC-1841', title: 'May Electricity Bill',       status: 'auto',         confidence: 96, source: 'Paperless', ts: '4h ago', tags: 'utility, monthly', notes: '' },
  { id: 'DOC-1840', title: 'School Permission Slip',     status: 'needs_review', confidence: 81, source: 'Scan-router', ts: '6h ago', tags: 'school', notes: '' },
  { id: 'DOC-1839', title: 'Costco receipt · 5/12',      status: 'auto',         confidence: 92, source: 'Email',       ts: '1d ago', tags: 'receipt', notes: '' },
  { id: 'DOC-1838', title: 'IRS form 1099-DIV',          status: 'needs_review', confidence: 72, source: 'Paperless', ts: '2d ago', tags: 'tax, 2025', notes: '' },
  { id: 'DOC-1837', title: 'Costco receipt · 5/9',       status: 'error',        confidence: 0,  source: 'Email',       ts: '2d ago', tags: 'receipt', notes: 'OCR failed, page upside down' },
  { id: 'DOC-1836', title: 'HOA quarterly statement',    status: 'auto',         confidence: 99, source: 'Paperless', ts: '3d ago', tags: 'hoa, statement', notes: '' },
  { id: 'DOC-1835', title: 'Vehicle registration · 2026', status: 'needs_review', confidence: 83, source: 'Scan-router', ts: '4d ago', tags: 'vehicle, dmv', notes: '' },
  { id: 'DOC-1834', title: 'AT&T fiber bill · May',      status: 'auto',         confidence: 97, source: 'Paperless', ts: '4d ago', tags: 'utility, monthly', notes: '' },
  { id: 'DOC-1833', title: 'Dental insurance EOB',       status: 'auto',         confidence: 94, source: 'Paperless', ts: '5d ago', tags: 'insurance, dental', notes: '' },
];

export function listRows(): QueueRow[] {
  return ROWS;
}

export function findRow(id: string): QueueRow | undefined {
  return ROWS.find((r) => r.id === id);
}

export function updateRow(id: string, patch: Partial<QueueRow>): QueueRow | undefined {
  const i = ROWS.findIndex((r) => r.id === id);
  if (i === -1) return undefined;
  ROWS[i] = { ...ROWS[i], ...patch };
  return ROWS[i];
}

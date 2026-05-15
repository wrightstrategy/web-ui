// Server-only mock job store. Jobs progress over wall-clock time so a
// page poll genuinely sees them move queued → running → succeeded
// without anyone calling "start" or "step" explicitly.

export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';

export type LogLine = {
  ts: string; // formatted "HH:MM:SS"
  level: 'info' | 'warn' | 'error';
  text: string;
};

export type Job = {
  id: string;
  title: string;
  kind: 'enrich' | 'export' | 'backup';
  status: JobStatus;
  progress: number; // 0..100
  startedAt: number; // epoch ms
  completedAt: number | null;
  log: LogLine[];
};

// Each scripted job has a deterministic timeline: an offset (ms after
// "start") at which each log line appears. status and progress are
// derived from elapsed time.
type ScriptStep = {
  offsetMs: number;
  status: JobStatus;
  progress: number;
  log?: { level: 'info' | 'warn' | 'error'; text: string };
};

type ScriptedJob = {
  id: string;
  title: string;
  kind: 'enrich' | 'export' | 'backup';
  startedAt: number;
  cancelledAt: number | null;
  script: ScriptStep[];
};

// In-memory mocks. The startedAt is fixed at module load so progress is
// reproducible relative to the dev server's start time.
const startedAt = Date.now();
const JOBS: ScriptedJob[] = [
  {
    id: 'OP-9012',
    title: 'Enrich Paperless documents · batch 14',
    kind: 'enrich',
    startedAt,
    cancelledAt: null,
    script: [
      { offsetMs: 0,      status: 'queued',    progress: 0,   log: { level: 'info', text: 'Job queued.' } },
      { offsetMs: 2000,   status: 'running',   progress: 8,   log: { level: 'info', text: 'Worker picked up job. 142 docs in batch.' } },
      { offsetMs: 6000,   status: 'running',   progress: 24,  log: { level: 'info', text: 'OCR pass · 34/142 documents.' } },
      { offsetMs: 12000,  status: 'running',   progress: 48,  log: { level: 'info', text: 'OCR pass · 69/142 documents.' } },
      { offsetMs: 16000,  status: 'running',   progress: 62,  log: { level: 'warn', text: 'Low confidence on DOC-1842 (78%). Queued for review.' } },
      { offsetMs: 20000,  status: 'running',   progress: 78,  log: { level: 'info', text: 'OCR pass · 110/142 documents.' } },
      { offsetMs: 26000,  status: 'running',   progress: 96,  log: { level: 'info', text: 'OCR pass · 137/142 documents.' } },
      { offsetMs: 30000,  status: 'succeeded', progress: 100, log: { level: 'info', text: 'Batch complete. 142 OK · 3 needs-review · 0 errors.' } },
    ],
  },
  {
    id: 'OP-9011',
    title: 'Sentinel daily backup',
    kind: 'backup',
    // Pretend this one started 25s ago so it's already nearly done by
    // the time anyone opens it.
    startedAt: startedAt - 25_000,
    cancelledAt: null,
    script: [
      { offsetMs: 0,     status: 'queued',    progress: 0,   log: { level: 'info', text: 'Backup queued.' } },
      { offsetMs: 1000,  status: 'running',   progress: 5,   log: { level: 'info', text: 'Snapshotting Postgres.' } },
      { offsetMs: 12000, status: 'running',   progress: 40,  log: { level: 'info', text: 'Snapshot uploaded to B2.' } },
      { offsetMs: 20000, status: 'running',   progress: 80,  log: { level: 'info', text: 'Snapshotting persistent volumes.' } },
      { offsetMs: 28000, status: 'succeeded', progress: 100, log: { level: 'info', text: 'Backup complete. 1.2 GB.' } },
    ],
  },
];

function deriveJob(scripted: ScriptedJob, now: number): Job {
  if (scripted.cancelledAt !== null) {
    const upToCancel = scripted.script.filter((s) => scripted.startedAt + s.offsetMs <= scripted.cancelledAt!);
    const last = upToCancel[upToCancel.length - 1];
    return {
      id: scripted.id,
      title: scripted.title,
      kind: scripted.kind,
      status: 'cancelled',
      progress: last?.progress ?? 0,
      startedAt: scripted.startedAt,
      completedAt: scripted.cancelledAt,
      log: [
        ...upToCancel
          .filter((s) => s.log)
          .map((s) => ({
            ts: fmt(scripted.startedAt + s.offsetMs),
            level: s.log!.level,
            text: s.log!.text,
          })),
        { ts: fmt(scripted.cancelledAt), level: 'warn', text: 'Cancelled by user.' },
      ],
    };
  }

  const elapsed = now - scripted.startedAt;
  const reached = scripted.script.filter((s) => s.offsetMs <= elapsed);
  const last = reached[reached.length - 1] ?? scripted.script[0];
  const completedAt = last.status === 'succeeded' || last.status === 'failed'
    ? scripted.startedAt + last.offsetMs
    : null;

  return {
    id: scripted.id,
    title: scripted.title,
    kind: scripted.kind,
    status: last.status,
    progress: last.progress,
    startedAt: scripted.startedAt,
    completedAt,
    log: reached
      .filter((s) => s.log)
      .map((s) => ({
        ts: fmt(scripted.startedAt + s.offsetMs),
        level: s.log!.level,
        text: s.log!.text,
      })),
  };
}

function fmt(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function listJobs(): Job[] {
  const now = Date.now();
  return JOBS.map((j) => deriveJob(j, now));
}

export function findJob(id: string): Job | undefined {
  const scripted = JOBS.find((j) => j.id === id);
  if (!scripted) return undefined;
  return deriveJob(scripted, Date.now());
}

export function cancelJob(id: string): Job | undefined {
  const scripted = JOBS.find((j) => j.id === id);
  if (!scripted) return undefined;
  // Only cancellable if still running
  const current = deriveJob(scripted, Date.now());
  if (current.status === 'queued' || current.status === 'running') {
    scripted.cancelledAt = Date.now();
  }
  return deriveJob(scripted, Date.now());
}

export function retryJob(id: string): Job | undefined {
  const scripted = JOBS.find((j) => j.id === id);
  if (!scripted) return undefined;
  scripted.startedAt = Date.now();
  scripted.cancelledAt = null;
  return deriveJob(scripted, Date.now());
}

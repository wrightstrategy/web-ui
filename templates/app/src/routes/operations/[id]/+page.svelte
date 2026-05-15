<script lang="ts">
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import type { JobStatus } from '$lib/server/mock-operations';
  import { Badge, Button, Card, PageHeader, toast } from '@wright/ui';

  let { data }: { data: PageData } = $props();

  const POLL_MS = 2000;
  const POLL_KEY = 'app:operation';

  // Re-fetch the page's load on a tick while the job is in motion. When
  // it finishes (succeeded / failed / cancelled), stop polling — there
  // is nothing left to refresh.
  $effect(() => {
    const live = data.job.status === 'queued' || data.job.status === 'running';
    if (!live) return;
    const id = setInterval(() => invalidate(POLL_KEY), POLL_MS);
    return () => clearInterval(id);
  });

  // Translate the URL-driven post-action signals into transient toasts
  // for JS users. The server already redirected; no-JS users see the
  // page reload to the same URL with the new state, which is coherent.
  $effect(() => {
    const cancelled = $page.url.searchParams.get('cancelled');
    const retried = $page.url.searchParams.get('retried');
    if (cancelled) toast.warning('Job cancelled', data.job.id);
    if (retried) toast.success('Job restarted', `${data.job.id} requeued.`);
  });

  function statusTone(s: JobStatus): 'ok' | 'warn' | 'err' | 'info' {
    switch (s) {
      case 'succeeded': return 'ok';
      case 'failed':    return 'err';
      case 'cancelled': return 'warn';
      case 'running':   return 'info';
      case 'queued':    return 'info';
    }
  }

  const isLive = $derived(data.job.status === 'queued' || data.job.status === 'running');
  const isDone = $derived(!isLive);
</script>

<PageHeader
  title={data.job.title}
  crumbs={[
    { label: 'Template' },
    { label: 'Operations', href: '/operations' },
    { label: data.job.id },
  ]}
>
  {#snippet badges()}
    <Badge tone={statusTone(data.job.status)} dot>{data.job.status.toUpperCase()}</Badge>
    {#if isLive}<span class="mono live-tick">· polling every {POLL_MS / 1000}s</span>{/if}
  {/snippet}
  {#snippet actions()}
    {#if isLive}
      <form method="post" action="?/cancel" style="display: inline">
        <Button type="submit" tone="ghost">Cancel</Button>
      </form>
    {:else}
      <form method="post" action="?/retry" style="display: inline">
        <Button type="submit" tone="primary">Retry</Button>
      </form>
    {/if}
  {/snippet}
</PageHeader>

<div class="wf-content">
  <!-- Progress card -->
  <Card>
    {#snippet head()}
      <h3>Progress</h3>
      <span class="wf-meta mono tnum">{data.job.progress}%</span>
    {/snippet}
    <div class="wf-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={data.job.progress}>
      <span style="width: {data.job.progress}%"></span>
    </div>
    <dl class="meta-grid">
      <dt>ID</dt>
      <dd class="mono accent-id">{data.job.id}</dd>
      <dt>Kind</dt>
      <dd>{data.job.kind}</dd>
      <dt>Started</dt>
      <dd class="mono">{new Date(data.job.startedAt).toLocaleTimeString()}</dd>
      {#if data.job.completedAt}
        <dt>Finished</dt>
        <dd class="mono">{new Date(data.job.completedAt).toLocaleTimeString()}</dd>
      {/if}
    </dl>
  </Card>

  <!-- Log card -->
  <Card>
    {#snippet head()}
      <h3>Log</h3>
      <span class="wf-meta mono">{data.job.log.length} {data.job.log.length === 1 ? 'line' : 'lines'}</span>
    {/snippet}
    {#if data.job.log.length === 0}
      <div class="wf-empty">
        <h4>Waiting for the worker</h4>
        <p>Log lines will stream in as the job runs.</p>
      </div>
    {:else}
      <ol class="log-tail">
        {#each data.job.log as line, i (i)}
          <li class={`log-line log-${line.level}`}>
            <span class="mono ts">{line.ts}</span>
            <span class="mono upper level">{line.level}</span>
            <span class="text">{line.text}</span>
          </li>
        {/each}
        {#if isLive}
          <li class="log-line log-pending" aria-live="polite">
            <span class="mono ts">···</span>
            <span class="mono upper level">…</span>
            <span class="text wf-subtle">Waiting for next update.</span>
          </li>
        {/if}
      </ol>
    {/if}
  </Card>

  {#if isDone && data.job.status === 'succeeded'}
    <Card variant="accent">
      <div class="wf-row">
        <Badge tone="ok" dot>DONE</Badge>
        <span>Job finished successfully. Output is available in the destination.</span>
      </div>
    </Card>
  {/if}
</div>

<style>
  .live-tick {
    color: var(--text-subtle);
    font-size: 11px;
    letter-spacing: 0.02em;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 6px 16px;
    margin: 16px 0 0;
    font-size: 13px;
  }
  .meta-grid dt {
    color: var(--text-subtle);
    font-family: var(--font-mono);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .meta-grid dd { margin: 0; color: var(--text); }
  .accent-id { color: var(--accent); }

  .log-tail {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12.5px;
    line-height: 1.45;
    max-height: 320px;
    overflow-y: auto;
  }
  .log-line {
    display: grid;
    grid-template-columns: 72px 56px 1fr;
    gap: 10px;
    padding: 4px 6px;
    border-left: 2px solid transparent;
    align-items: baseline;
  }
  .log-line .ts { color: var(--text-subtle); font-size: 11.5px; }
  .log-line .level {
    color: var(--text-subtle);
    font-size: 10px;
    letter-spacing: 0.16em;
  }
  .log-line .text { color: var(--text); }
  .log-warn { border-left-color: var(--warning); background: color-mix(in srgb, var(--warning) 6%, transparent); }
  .log-warn .level { color: var(--warning); }
  .log-error { border-left-color: var(--danger); background: color-mix(in srgb, var(--danger) 6%, transparent); }
  .log-error .level { color: var(--danger); }
  .log-pending .text { font-style: italic; }
</style>

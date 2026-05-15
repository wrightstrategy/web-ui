<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';
  import type { JobStatus } from '$lib/server/mock-operations';
  import { Badge, Card, PageHeader, Table } from '@wright/ui';

  let { data }: { data: PageData } = $props();

  // Light polling on the list so in-flight jobs visibly progress.
  $effect(() => {
    const id = setInterval(() => invalidate('app:operations-list'), 3000);
    return () => clearInterval(id);
  });

  function statusTone(s: JobStatus): 'ok' | 'warn' | 'err' | 'info' {
    if (s === 'succeeded') return 'ok';
    if (s === 'failed') return 'err';
    if (s === 'cancelled') return 'warn';
    return 'info';
  }
</script>

<PageHeader title="Operations" crumbs={[{ label: 'Template' }, { label: 'Operations' }]} />

<div class="wf-content">
  <Card title="Recent jobs" meta={`${data.jobs.length} total`}>
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Kind</th>
          <th>Status</th>
          <th style="text-align: right;">Progress</th>
        </tr>
      </thead>
      <tbody>
        {#each data.jobs as job (job.id)}
          <tr>
            <td class="id">
              <a class="job-link" href={`/operations/${job.id}`}>{job.id}</a>
            </td>
            <td>{job.title}</td>
            <td>{job.kind}</td>
            <td><Badge tone={statusTone(job.status)} dot>{job.status.toUpperCase()}</Badge></td>
            <td class="mono tnum" style="text-align: right;">{job.progress}%</td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </Card>
</div>

<style>
  .job-link {
    color: var(--accent);
    text-decoration: none;
    border-bottom: 1px dashed transparent;
    transition: border-color var(--duration-fast);
  }
  .job-link:hover { border-bottom-color: var(--accent); }
</style>

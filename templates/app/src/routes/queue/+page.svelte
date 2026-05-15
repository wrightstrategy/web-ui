<script lang="ts">
  import type { PageData } from './$types';
  import type { QueueStatus } from './+page.server';
  import { Badge, Button, Card, FormField, Input, PageHeader, Select, Table } from '@wright/ui';

  let { data }: { data: PageData } = $props();

  function statusTone(s: QueueStatus): 'warn' | 'ok' | 'err' {
    return s === 'needs_review' ? 'warn' : s === 'auto' ? 'ok' : 'err';
  }
  function statusLabel(s: QueueStatus): string {
    return s === 'needs_review' ? 'NEEDS REVIEW' : s === 'auto' ? 'AUTO' : 'ERROR';
  }
</script>

<PageHeader
  title="Queue"
  crumbs={[{ label: 'Template' }, { label: 'Queue' }]}
>
  {#snippet actions()}
    <Button href="/queue?status=needs_review" tone="ghost">Needs review</Button>
    <Button href="/queue?error=1" tone="ghost">Show error</Button>
  {/snippet}
</PageHeader>

<div class="wf-content">
  <!-- Filter bar: plain GET form, no JS needed. -->
  <Card class="filter-card">
    <form method="get" action="/queue" class="filter-bar">
      <FormField label="Search" for="q">
        <Input
          id="q"
          name="q"
          type="search"
          value={data.filters.q}
          placeholder="title or doc id"
        />
      </FormField>
      <FormField label="Status" for="status">
        <Select id="status" name="status" value={data.filters.status}>
          <option value="">All</option>
          <option value="needs_review">Needs review</option>
          <option value="auto">Auto</option>
          <option value="error">Error</option>
        </Select>
      </FormField>
      <div class="filter-actions">
        <Button type="submit" tone="primary">Apply</Button>
        <Button href="/queue" tone="ghost">Reset</Button>
      </div>
    </form>
    <p class="filter-meta mono">
      {data.counts.filtered} of {data.counts.total} documents
    </p>
  </Card>

  {#if data.rows.length === 0}
    <Card>
      <div class="wf-empty">
        <div class="glyph" aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9 L15 15 M15 9 L9 15" stroke-linecap="round" />
          </svg>
        </div>
        <h4>No documents match</h4>
        <p>Try clearing the filters or searching by document id.</p>
        <div style="margin-top: 8px;">
          <Button href="/queue">Clear filters</Button>
        </div>
      </div>
    </Card>
  {:else}
    <!-- Desktop: full table. Hidden on mobile via CSS. -->
    <Card class="queue-table">
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th style="text-align: right;">Conf.</th>
            <th>Source</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {#each data.rows as row (row.id)}
            <tr>
              <td class="id">{row.id}</td>
              <td>{row.title}</td>
              <td><Badge tone={statusTone(row.status)} dot>{statusLabel(row.status)}</Badge></td>
              <td class="mono tnum" style="text-align: right;">
                {row.confidence > 0 ? `${row.confidence}%` : '—'}
              </td>
              <td>{row.source}</td>
              <td class="ts">{row.ts}</td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </Card>

    <!-- Mobile: card list of the same rows. Hidden on desktop via CSS. -->
    <div class="queue-mobile">
      {#each data.rows as row (row.id)}
        <Card>
          <div class="qm-head">
            <span class="mono qm-id">{row.id}</span>
            <Badge tone={statusTone(row.status)} dot>{statusLabel(row.status)}</Badge>
          </div>
          <div class="qm-title">{row.title}</div>
          <div class="qm-meta">
            <span>{row.source}</span>
            <span class="mono tnum">
              {row.confidence > 0 ? `${row.confidence}%` : '—'}
            </span>
            <span class="mono qm-ts">{row.ts}</span>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</div>

<style>
  .filter-bar {
    display: grid;
    grid-template-columns: 1fr 220px auto;
    gap: 12px;
    align-items: end;
  }
  .filter-actions { display: flex; gap: 8px; }
  .filter-meta {
    margin: 12px 0 0;
    font-size: 12px;
    color: var(--text-subtle);
  }

  .queue-mobile {
    display: none;
    flex-direction: column;
    gap: 12px;
  }
  .qm-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
  }
  .qm-id { color: var(--accent); font-size: 12px; }
  .qm-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 10px;
  }
  .qm-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 12px;
    color: var(--text-muted);
  }
  .qm-ts { color: var(--text-subtle); }

  @media (max-width: 767px) {
    .filter-bar { grid-template-columns: 1fr; }
    :global(.queue-table) { display: none; }
    .queue-mobile { display: flex; }
  }
</style>

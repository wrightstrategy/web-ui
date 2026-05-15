<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import { Badge, Button, Card, PageHeader, toast } from '@wright/ui';

  let { data }: { data: PageData } = $props();

  // URL-driven post-action signals: the server redirected, the page
  // re-rendered with the next card; with JS we layer a toast on top so
  // there's visible feedback that the previous decision landed.
  $effect(() => {
    const did = $page.url.searchParams.get('did');
    const on = $page.url.searchParams.get('on');
    if (!did || !on) return;
    switch (did) {
      case 'approved':
        toast.success('Approved', on);
        break;
      case 'rejected':
        toast.warning('Rejected', on);
        break;
      case 'deferred':
        toast.info('Deferred', `${on} · back later`);
        break;
    }
  });
</script>

<PageHeader
  title="Triage"
  crumbs={[{ label: 'Template' }, { label: 'Triage' }]}
>
  {#snippet badges()}
    <Badge tone={data.remaining > 0 ? 'warn' : 'ok'} dot>
      {data.remaining} {data.remaining === 1 ? 'PENDING' : 'PENDING'}
    </Badge>
  {/snippet}
  {#snippet actions()}
    <form method="post" action="?/reset" style="display: inline">
      <Button type="submit" tone="ghost">Reset demo</Button>
    </form>
  {/snippet}
</PageHeader>

<div class="wf-content triage-content">
  {#if data.current}
    {@const doc = data.current}
    <Card class="triage-card">
      <header class="tc-head">
        <span class="mono tc-id">{doc.id}</span>
        <span class="mono tc-source">{doc.source}</span>
      </header>

      <h2 class="tc-title">{doc.title}</h2>

      <dl class="tc-meta">
        <div class="tc-meta-row">
          <dt>Confidence</dt>
          <dd>
            <span class="mono tnum tc-conf">{doc.confidence}%</span>
            <span class="tc-conf-bar" aria-hidden="true">
              <span class="tc-conf-fill" style="width: {doc.confidence}%"></span>
            </span>
          </dd>
        </div>
        {#if doc.tags}
          <div class="tc-meta-row">
            <dt>Tags</dt>
            <dd class="tc-tags">
              {#each doc.tags.split(',').map(t => t.trim()).filter(Boolean) as tag}
                <span class="tc-tag mono">{tag}</span>
              {/each}
            </dd>
          </div>
        {/if}
        {#if doc.notes}
          <div class="tc-meta-row">
            <dt>Notes</dt>
            <dd class="tc-notes">{doc.notes}</dd>
          </div>
        {/if}
      </dl>

      <!-- Three actions anchored at the bottom of the card for one-handed
           thumb reach. Each is its own form so server actions get the
           doc id as form-encoded data — no JS needed to submit. -->
      <div class="tc-actions">
        <form method="post" action="?/reject">
          <input type="hidden" name="id" value={doc.id} />
          <Button type="submit" tone="ghost" class="tc-btn tc-reject">
            Reject
          </Button>
        </form>
        <form method="post" action="?/defer">
          <input type="hidden" name="id" value={doc.id} />
          <Button type="submit" class="tc-btn">
            Defer
          </Button>
        </form>
        <form method="post" action="?/approve">
          <input type="hidden" name="id" value={doc.id} />
          <Button type="submit" tone="primary" class="tc-btn">
            Approve
          </Button>
        </form>
      </div>
    </Card>
  {:else}
    <Card>
      <div class="wf-empty">
        <div class="glyph" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12.5 L11 15.5 L16 9" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h4>All caught up</h4>
        <p>No documents waiting for review.</p>
        <form method="post" action="?/reset" style="margin-top: 12px;">
          <Button type="submit">Reset demo</Button>
        </form>
      </div>
    </Card>
  {/if}
</div>

<style>
  /* Constrain content width on desktop; full-bleed on mobile.
     Recipe targets 375px first; desktop is a graceful upscale. */
  .triage-content {
    max-width: 520px;
    margin: 0 auto;
    width: 100%;
  }

  :global(.triage-card) {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 18px;
  }

  .tc-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--text-subtle);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .tc-id { color: var(--accent); }
  .tc-source { color: var(--text-muted); }

  .tc-title {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text);
    line-height: 1.3;
    margin: 0;
  }

  .tc-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
  }
  .tc-meta-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tc-meta dt {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text-subtle);
  }
  .tc-meta dd { margin: 0; color: var(--text); font-size: 14px; }

  .tc-conf { font-size: 14px; margin-right: 10px; }
  .tc-conf-bar {
    display: inline-block;
    width: 120px;
    height: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    overflow: hidden;
    vertical-align: middle;
  }
  .tc-conf-fill {
    display: block;
    height: 100%;
    background: var(--warning);
    border-radius: 999px;
  }

  .tc-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tc-tag {
    display: inline-flex;
    padding: 3px 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 11px;
    color: var(--text-muted);
  }
  .tc-notes {
    color: var(--text-muted);
    font-size: 13px;
    line-height: 1.5;
    background: var(--surface);
    padding: 10px 12px;
    border-radius: var(--radius-sm);
  }

  .tc-actions {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    margin-top: auto;
    padding-top: 4px;
  }
  .tc-actions form { display: contents; }
  /* Make each action button fill its grid cell and sit at the bottom of
     the card for one-handed thumb reach. */
  .tc-actions :global(.tc-btn) {
    width: 100%;
    min-height: 52px;
    font-size: 14px;
  }
  .tc-actions :global(.tc-reject) {
    color: var(--danger);
  }

  /* Tighten the desktop view; the mobile view above 375px is the canonical
     experience for this recipe. */
  @media (min-width: 768px) {
    :global(.triage-card) {
      padding: 24px;
    }
    .tc-title { font-size: 22px; }
  }
</style>

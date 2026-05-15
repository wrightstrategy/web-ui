<script lang="ts">
  import { page } from '$app/stores';
  import { Button, Card, PageHeader } from '@wright/ui';
</script>

<PageHeader
  title="Queue · unavailable"
  crumbs={[{ label: 'Template' }, { label: 'Queue', href: '/queue' }, { label: 'Error' }]}
/>

<div class="wf-content">
  <Card>
    <div class="wf-empty">
      <div class="glyph" aria-hidden="true">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8 L12 13 M12 16 L12 16.5" stroke-linecap="round" />
        </svg>
      </div>
      <h4>
        {$page.status} · {$page.error?.message ?? 'Something went wrong'}
      </h4>
      <p>The queue couldn't be loaded right now. Try again in a moment.</p>
      <div style="margin-top: 12px;">
        <Button href="/queue" tone="primary">Try again</Button>
      </div>
    </div>
  </Card>
</div>

<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms';
  import { Badge, Button, Card, FormField, Input, PageHeader, Select, toast } from '@wright/ui';

  let { data }: { data: PageData } = $props();
  const rowId = $derived(data.row.id);

  // Progressive enhancement: with JS, superForm intercepts submission to
  // surface inline validation errors and fire a success toast before the
  // server-side redirect completes (the ToastViewport lives in the root
  // layout, so the toast survives the navigation). Without JS, the form
  // POSTs normally and the action redirects with ?saved=1, which renders
  // the server-side "Saved" banner — that's the no-JS coherent fallback.
  const { form, errors, enhance, submitting } = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Saved', `${rowId} updated successfully.`);
      }
    },
  });
</script>

<PageHeader
  title="Edit document"
  crumbs={[
    { label: 'Template' },
    { label: 'Queue', href: '/queue' },
    { label: data.row.id },
    { label: 'Edit' },
  ]}
>
  {#snippet badges()}
    <Badge tone={data.row.status === 'error' ? 'err' : data.row.status === 'auto' ? 'ok' : 'warn'} dot>
      {data.row.status === 'needs_review' ? 'NEEDS REVIEW' : data.row.status.toUpperCase()}
    </Badge>
  {/snippet}
  {#snippet actions()}
    <Button href="/queue" tone="ghost">Back to queue</Button>
  {/snippet}
</PageHeader>

<div class="wf-content">
  {#if data.saved}
    <div class="saved-banner" role="status">
      <span class="dot" aria-hidden="true"></span>
      <span>Saved.</span>
      <span class="mono saved-id">{data.row.id}</span>
    </div>
  {/if}

  <Card>
    <form method="post" use:enhance novalidate class="edit-form">
      <div class="form-grid">
        <FormField label="Title" for="title" hint="The document's display name." error={$errors.title?.[0]}>
          <Input
            id="title"
            name="title"
            bind:value={$form.title}
            error={!!$errors.title}
            placeholder="e.g. May Electricity Bill"
          />
        </FormField>

        <FormField label="Source" for="source" hint="Where this document was ingested from.">
          <Select id="source" name="source" bind:value={$form.source}>
            <option value="Paperless">Paperless</option>
            <option value="Scan-router">Scan-router</option>
            <option value="Email">Email</option>
            <option value="Other">Other</option>
          </Select>
        </FormField>

        <FormField
          label="Confidence"
          for="confidence"
          hint="0–100. Below the auto-triage floor, this document needs review."
          error={$errors.confidence?.[0]}
        >
          <Input
            id="confidence"
            name="confidence"
            type="number"
            min="0"
            max="100"
            bind:value={$form.confidence}
            error={!!$errors.confidence}
            mono
          />
        </FormField>

        <FormField
          label="Tags"
          for="tags"
          hint="Comma-separated. Used for filter chips in the queue."
          error={$errors.tags?.[0]}
        >
          <Input id="tags" name="tags" bind:value={$form.tags} placeholder="utility, monthly" />
        </FormField>
      </div>

      <FormField label="Notes" for="notes" hint="Private notes; not shown to consumers." error={$errors.notes?.[0]}>
        <textarea
          id="notes"
          name="notes"
          class="wf-input edit-notes"
          bind:value={$form.notes}
          placeholder="OCR quality, page orientation, anything to flag for review..."
        ></textarea>
      </FormField>

      <div class="form-actions">
        <Button href="/queue" tone="ghost">Cancel</Button>
        <Button type="submit" tone="primary" loading={$submitting}>
          Save changes
        </Button>
      </div>
    </form>
  </Card>
</div>

<style>
  .saved-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 16px;
    background: color-mix(in srgb, var(--success) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--success) 30%, transparent);
    border-radius: var(--radius-sm);
    color: var(--success);
    font-size: 13px;
    font-weight: 500;
  }
  .saved-banner .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
  }
  .saved-id { color: var(--text-muted); }

  .edit-form { display: flex; flex-direction: column; gap: 18px; }
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
  .edit-notes {
    min-height: 96px;
    font-family: var(--font-sans);
    resize: vertical;
  }
  .form-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  @media (max-width: 767px) {
    .form-grid { grid-template-columns: 1fr; }
    .form-actions { flex-direction: column-reverse; }
  }
</style>

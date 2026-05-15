<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Variant = 'standard' | 'dashed' | 'accent';

  type Props = {
    variant?: Variant;
    title?: string;
    meta?: string;
    head?: Snippet;
    children?: Snippet;
    class?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'title'>;

  let {
    variant = 'standard',
    title,
    meta,
    head,
    children,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  const cls = $derived(
    ['wf-card', variant === 'standard' ? '' : variant, extraClass].filter(Boolean).join(' ')
  );

  const hasHead = $derived(Boolean(head || title || meta));
</script>

<div {...rest} class={cls}>
  {#if hasHead}
    <div class="wf-card-head">
      {#if head}
        {@render head()}
      {:else}
        {#if title}<h3>{title}</h3>{/if}
        {#if meta}<span class="wf-meta mono">{meta}</span>{/if}
      {/if}
    </div>
  {/if}
  {@render children?.()}
</div>

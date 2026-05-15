<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    label: string;
    hint?: string;
    error?: string;
    for?: string;
    children?: Snippet;
    class?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

  let {
    label,
    hint,
    error,
    for: htmlFor,
    children,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  const cls = $derived(['wf-field', extraClass].filter(Boolean).join(' '));
</script>

<div {...rest} class={cls}>
  <label class="wf-field-label" for={htmlFor}>{label}</label>
  {@render children?.()}
  {#if error}
    <span class="wf-field-err" role="alert">{error}</span>
  {:else if hint}
    <span class="wf-field-hint">{hint}</span>
  {/if}
</div>

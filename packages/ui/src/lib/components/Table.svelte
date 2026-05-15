<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLTableAttributes } from 'svelte/elements';

  type Props = {
    children?: Snippet;
    class?: string;
  } & Omit<HTMLTableAttributes, 'children' | 'class'>;

  let { children, class: extraClass = '', ...rest }: Props = $props();

  const cls = $derived(['wf-table', extraClass].filter(Boolean).join(' '));
</script>

<table {...rest} class={cls}>
  {@render children?.()}
</table>

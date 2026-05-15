<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  type Props = {
    value?: string | number | null;
    error?: boolean;
    children?: Snippet;
    class?: string;
  } & Omit<HTMLSelectAttributes, 'value' | 'class'>;

  let {
    value = $bindable(),
    error = false,
    children,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  const cls = $derived(['wf-select', error ? 'err' : '', extraClass].filter(Boolean).join(' '));
</script>

<select {...rest} bind:value class={cls} aria-invalid={error || undefined}>
  {@render children?.()}
</select>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    value?: string | number | null;
    error?: boolean;
    mono?: boolean;
    icon?: Snippet;
    suffix?: Snippet;
    class?: string;
  } & Omit<HTMLInputAttributes, 'value' | 'class'>;

  let {
    value = $bindable(),
    error = false,
    mono = false,
    icon,
    suffix,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  const inputCls = $derived(
    [
      'wf-input',
      error ? 'err' : '',
      mono ? 'mono' : '',
      suffix && !icon ? 'right-pad' : '',
      extraClass,
    ]
      .filter(Boolean)
      .join(' ')
  );

  const hasAffix = $derived(Boolean(icon || suffix));
</script>

{#if hasAffix}
  <span class="wf-input-affix">
    {#if icon}
      <span class="wf-affix-icon" aria-hidden="true">{@render icon()}</span>
    {/if}
    <input {...rest} bind:value class={inputCls} aria-invalid={error || undefined} />
    {#if suffix}
      <span class="wf-affix-suffix" aria-hidden="true">{@render suffix()}</span>
    {/if}
  </span>
{:else}
  <input {...rest} bind:value class={inputCls} aria-invalid={error || undefined} />
{/if}

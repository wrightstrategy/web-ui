<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';

  type Tone = 'default' | 'primary' | 'ghost' | 'danger';
  type Size = 'sm' | 'md' | 'lg';

  type Props = {
    tone?: Tone;
    size?: Size;
    loading?: boolean;
    children?: Snippet;
  } & (
    | ({ href: string } & Omit<HTMLAnchorAttributes, 'children'>)
    | ({ href?: undefined } & Omit<HTMLButtonAttributes, 'children'>)
  );

  let {
    tone = 'default',
    size = 'md',
    loading = false,
    href,
    children,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  const cls = $derived(
    ['wf-btn', tone === 'default' ? '' : tone, size === 'md' ? '' : size, loading ? 'loading' : '', extraClass]
      .filter(Boolean)
      .join(' ')
  );
</script>

{#snippet spinner()}
  <svg class="wf-spinner" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-dasharray="14 30"
      stroke-linecap="round"
    />
  </svg>
{/snippet}

{#if href}
  <a
    {...rest as HTMLAnchorAttributes}
    {href}
    class={cls}
    aria-busy={loading || undefined}
    aria-disabled={loading || undefined}
  >
    {#if loading}{@render spinner()}{/if}
    {@render children?.()}
  </a>
{:else}
  <button
    {...rest as HTMLButtonAttributes}
    type={(rest as HTMLButtonAttributes).type ?? 'button'}
    class={cls}
    disabled={loading || (rest as HTMLButtonAttributes).disabled}
    aria-busy={loading || undefined}
  >
    {#if loading}{@render spinner()}{/if}
    {@render children?.()}
  </button>
{/if}

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Tone = 'default' | 'ok' | 'warn' | 'err' | 'info' | 'accent';

  type Props = {
    tone?: Tone;
    dot?: boolean;
    children?: Snippet;
    class?: string;
  } & Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'class'>;

  let { tone = 'default', dot = false, children, class: extraClass = '', ...rest }: Props = $props();

  const cls = $derived(
    ['wf-badge', tone === 'default' ? '' : tone, extraClass].filter(Boolean).join(' ')
  );
</script>

<span {...rest} class={cls}>
  {#if dot}<span class="dot" aria-hidden="true"></span>{/if}
  {@render children?.()}
</span>

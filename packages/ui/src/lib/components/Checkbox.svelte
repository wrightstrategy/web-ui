<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    checked?: boolean;
    label?: string;
    children?: Snippet;
    class?: string;
  } & Omit<HTMLInputAttributes, 'type' | 'class' | 'checked'>;

  let {
    checked = $bindable(false),
    label,
    children,
    class: extraClass = '',
    ...rest
  }: Props = $props();

  const cls = $derived(['wf-check', extraClass].filter(Boolean).join(' '));
</script>

<label class={cls}>
  <input
    {...rest}
    type="checkbox"
    class="wf-check-native"
    bind:checked
  />
  <span class="box" aria-hidden="true">
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <path
        d="M2.5 6.2l2.4 2.4 4.6-4.8"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
  {#if children}
    {@render children()}
  {:else if label}
    <span class="wf-check-label">{label}</span>
  {/if}
</label>

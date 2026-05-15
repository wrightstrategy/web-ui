<script lang="ts" module>
  export type TabBadgeTone = 'default' | 'ok' | 'warn' | 'err' | 'info' | 'accent';

  export type TabItem = {
    value: string;
    label: string;
    badge?: string | number;
    badgeTone?: TabBadgeTone;
    disabled?: boolean;
    /** When set, the tab renders as <a href={href}> instead of <button>.
        Useful for SvelteKit routing — the app passes `value` to indicate
        which route is active. */
    href?: string;
  };
</script>

<script lang="ts">
  type Props = {
    tabs: TabItem[];
    value?: string;
    onSelect?: (value: string) => void;
    /** ARIA label for the tablist; defaults to "Tabs". */
    label?: string;
  };

  let { tabs, value = $bindable(), onSelect, label = 'Tabs' }: Props = $props();

  let listEl: HTMLDivElement | undefined = $state();

  function select(v: string) {
    value = v;
    onSelect?.(v);
  }

  function onKeydown(e: KeyboardEvent) {
    const usable = tabs.filter((t) => !t.disabled);
    if (usable.length === 0) return;

    const currentIdx = usable.findIndex((t) => t.value === value);
    let nextIdx = currentIdx;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % usable.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIdx = currentIdx <= 0 ? usable.length - 1 : currentIdx - 1;
        break;
      case 'Home':
        nextIdx = 0;
        break;
      case 'End':
        nextIdx = usable.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const next = usable[nextIdx];
    select(next.value);
    // Move focus to the newly-active tab
    const el = listEl?.querySelector<HTMLElement>(`[data-tab-value="${CSS.escape(next.value)}"]`);
    el?.focus();
  }
</script>

<div
  class="wf-tabs"
  role="tablist"
  aria-label={label}
  tabindex={-1}
  bind:this={listEl}
  onkeydown={onKeydown}
>
  {#each tabs as tab (tab.value)}
    {@const isActive = tab.value === value}
    {#if tab.href}
      <a
        href={tab.href}
        role="tab"
        class="tab"
        class:active={isActive}
        aria-selected={isActive}
        aria-disabled={tab.disabled || undefined}
        tabindex={isActive ? 0 : -1}
        data-tab-value={tab.value}
        onclick={() => !tab.disabled && select(tab.value)}
      >
        <span>{tab.label}</span>
        {#if tab.badge !== undefined}
          <span
            class={['wf-badge', tab.badgeTone && tab.badgeTone !== 'default' ? tab.badgeTone : '']
              .filter(Boolean)
              .join(' ')}
            style="margin-left:6px;padding:1px 6px;"
          >
            {tab.badge}
          </span>
        {/if}
      </a>
    {:else}
      <button
        type="button"
        role="tab"
        class="tab"
        class:active={isActive}
        aria-selected={isActive}
        disabled={tab.disabled}
        tabindex={isActive ? 0 : -1}
        data-tab-value={tab.value}
        onclick={() => select(tab.value)}
      >
        <span>{tab.label}</span>
        {#if tab.badge !== undefined}
          <span
            class={['wf-badge', tab.badgeTone && tab.badgeTone !== 'default' ? tab.badgeTone : '']
              .filter(Boolean)
              .join(' ')}
            style="margin-left:6px;padding:1px 6px;"
          >
            {tab.badge}
          </span>
        {/if}
      </button>
    {/if}
  {/each}
</div>

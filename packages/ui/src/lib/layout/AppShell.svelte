<script lang="ts" module>
  import type { Component, Snippet } from 'svelte';

  export type NavIcon = Component<{ size?: number; class?: string }>;

  export type NavItem = {
    href: string;
    label: string;
    icon?: NavIcon;
    active?: boolean;
  };

  export type NavSection = {
    /** Optional section heading (omit for the top group). */
    section?: string;
    items: NavItem[];
  };
</script>

<script lang="ts">
  type Props = {
    brand?: Snippet;
    nav?: NavSection[];
    foot?: Snippet;
    children?: Snippet;
  };

  let { brand, nav = [], foot, children }: Props = $props();

  // The bottom tabbar shows up to the first 5 nav items, flattened across
  // sections. Apps that need a different mobile nav set should add a
  // `mobile-only` section as the first one — these items will be picked up
  // for the tabbar without cluttering the desktop sidebar.
  const tabbarItems = $derived(
    nav.flatMap((s) => s.items).slice(0, 5)
  );
</script>

<div class="wf-root wf-shell">
  <aside class="wf-sidebar">
    {#if brand}
      <div class="wf-brand">{@render brand()}</div>
    {/if}
    <nav class="wf-nav" aria-label="Primary">
      {#each nav as section, si (si)}
        {#if section.section}
          <div class="wf-nav-section">{section.section}</div>
        {/if}
        {#each section.items as item, ii (ii)}
          <a
            href={item.href}
            class:active={item.active}
            aria-current={item.active ? 'page' : undefined}
          >
            {#if item.icon}
              {@const Icon = item.icon}
              <Icon size={16} class="wf-nav-icon" />
            {/if}
            <span>{item.label}</span>
          </a>
        {/each}
      {/each}
    </nav>
    {#if foot}
      <div class="wf-foot">{@render foot()}</div>
    {/if}
  </aside>

  <main class="wf-main">
    {@render children?.()}
  </main>

  {#if tabbarItems.length > 0}
    <nav class="wf-phone-tabbar wf-shell-tabbar" aria-label="Mobile primary">
      {#each tabbarItems as item, i (i)}
        <a
          href={item.href}
          class="wf-tab"
          class:active={item.active}
          aria-current={item.active ? 'page' : undefined}
        >
          {#if item.icon}
            {@const Icon = item.icon}
            <Icon size={22} />
          {/if}
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>
  {/if}
</div>

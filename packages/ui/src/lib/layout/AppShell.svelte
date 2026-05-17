<script lang="ts" module>
  import type { Component, Snippet } from 'svelte';

  // Component generic is loose intentionally — third-party icon libraries
  // (lucide-svelte, @lucide/svelte, heroicons) all use different bindings /
  // slots signatures. Apps pass icons that accept `size` and `class`.
  // biome-ignore lint/suspicious/noExplicitAny: cross-library icon shape
  export type NavIcon = Component<{ size?: number | string; class?: string }, any, any>;

  export type NavItem = {
    href: string;
    label: string;
    icon?: NavIcon;
    active?: boolean;
  };

  export type NavSection = {
    /** Optional section heading (omit for the top group). */
    section?: string;
    /** Skip in the desktop sidebar; only appears in the mobile tabbar. */
    mobileOnly?: boolean;
    /** Skip in the mobile tabbar; only appears in the desktop sidebar. */
    desktopOnly?: boolean;
    items: NavItem[];
  };

  export type AppMeta = {
    /** Human-readable display name, e.g. "Template", "Inbox". */
    name: string;
    /** Semver string with no leading 'v', e.g. "1.2.3". */
    version: string;
  };
</script>

<script lang="ts">
  import { KIT_VERSION } from '../version.js';

  type Props = {
    brand?: Snippet;
    nav?: NavSection[];
    foot?: Snippet;
    meta?: AppMeta;
    children?: Snippet;
  };

  let { brand, nav = [], foot, meta, children }: Props = $props();

  const sidebarSections = $derived(nav.filter((s) => !s.mobileOnly));

  // Mobile tabbar shows up to the first 5 items, flattened from sections
  // that aren't desktop-only. Apps can use `mobileOnly: true` on a leading
  // section to put dedicated tabbar items there without cluttering the
  // desktop sidebar.
  const tabbarItems = $derived(
    nav.filter((s) => !s.desktopOnly).flatMap((s) => s.items).slice(0, 5)
  );
</script>

<div class="wf-root wf-shell">
  <aside class="wf-sidebar">
    {#if brand}
      <div class="wf-brand">{@render brand()}</div>
    {/if}
    <nav class="wf-nav" aria-label="Primary">
      {#each sidebarSections as section, si (si)}
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
    {#if meta}
      <div class="wf-version-block">
        <div class="wf-version-name">{meta.name}</div>
        {#if meta.version}
          <div class="wf-version-app">v{meta.version}</div>
        {/if}
        <div class="wf-version-kit">ui v{KIT_VERSION}</div>
      </div>
    {/if}
    {#if foot}
      <div class="wf-foot">
        {@render foot()}
      </div>
    {/if}
  </aside>

  <main class="wf-main">
    {@render children?.()}
  </main>

  {#if meta}
    <div class="wf-shell-version-strip">
      <span class="wf-version-name">{meta.name}</span>
      {#if meta.version}
        <span class="wf-sep" aria-hidden="true">·</span>
        <span class="wf-version-app">v{meta.version}</span>
      {/if}
      <span class="wf-sep" aria-hidden="true">·</span>
      <span class="wf-version-kit">ui v{KIT_VERSION}</span>
    </div>
  {/if}

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

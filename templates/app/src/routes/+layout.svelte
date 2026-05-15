<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { AppShell, ToastViewport, type NavSection } from '@wright/ui';
  import {
    Home,
    Inbox,
    Settings,
    Activity,
    LogIn,
    LayoutDashboard,
    UserCircle,
  } from '@lucide/svelte';

  let { children } = $props();

  const nav: NavSection[] = $derived([
    {
      items: [
        { href: '/', label: 'Overview', icon: LayoutDashboard, active: $page.url.pathname === '/' },
        {
          href: '/queue',
          label: 'Queue',
          icon: Inbox,
          active: $page.url.pathname.startsWith('/queue'),
        },
        {
          href: '/operations',
          label: 'Operations',
          icon: Activity,
          active: $page.url.pathname.startsWith('/operations'),
        },
        {
          href: '/triage',
          label: 'Triage',
          icon: Home,
          active: $page.url.pathname.startsWith('/triage'),
        },
      ],
    },
    {
      section: 'System',
      desktopOnly: true,
      items: [
        {
          href: '/settings',
          label: 'Settings',
          icon: Settings,
          active: $page.url.pathname.startsWith('/settings'),
        },
        {
          href: '/login',
          label: 'Sign in',
          icon: LogIn,
          active: $page.url.pathname === '/login',
        },
      ],
    },
  ]);
</script>

<AppShell {nav}>
  {#snippet brand()}
    <div style="display: flex; align-items: center; gap: 10px;">
      <span
        style="
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        "
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="currentColor">
          <rect x="2" y="2" width="24" height="24" rx="4" />
          <text
            x="14"
            y="20"
            text-anchor="middle"
            font-family="'IBM Plex Sans Condensed', sans-serif"
            font-size="16"
            font-weight="700"
            fill="var(--accent-on)"
          >W</text>
        </svg>
      </span>
      <div style="line-height: 1.05;">
        <div
          class="mono"
          style="font-size: 9.5px; letter-spacing: 0.2em; color: var(--text-subtle);"
        >
          WRIGHT FAMILY
        </div>
        <div style="font-weight: 600; font-size: 14px; letter-spacing: -0.005em; margin-top: 2px;">
          Template
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet foot()}
    <div
      style="
        width: 28px; height: 28px;
        border-radius: 50%;
        background: var(--surface-raised);
        border: 1px solid var(--border);
        display: flex; align-items: center; justify-content: center;
        font-family: var(--font-mono); font-weight: 600; font-size: 11px;
        color: var(--text-muted);
      "
    >
      <UserCircle size={16} />
    </div>
    <div class="wf-grow">
      <div style="font-size: 13px; color: var(--text);">Scott</div>
      <div class="mono" style="font-size: 11px; color: var(--text-subtle);">wrightfamily.org</div>
    </div>
  {/snippet}

  {@render children?.()}
</AppShell>

<ToastViewport />

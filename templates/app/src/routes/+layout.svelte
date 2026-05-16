<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { AppShell, ToastViewport, type NavSection } from '@wright/ui';
  import pkg from '../../package.json' with { type: 'json' };
  import {
    Home,
    Inbox,
    Settings,
    Activity,
    LayoutDashboard,
    UserCircle,
  } from '@lucide/svelte';

  let { children, data } = $props();

  const meta = { name: 'Template', version: pkg.version };

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
      ],
    },
  ]);
</script>

<AppShell {nav} {meta}>
  {#snippet brand()}
    <div style="display: flex; align-items: center; gap: 12px;">
      <span
        style="color: var(--accent); display: inline-flex; align-items: center;"
        aria-hidden="true"
      >
        <!-- Canonical Wright stencil mark: rounded plate with W, bar, and
             five-point star cut from the surface. From design v1.0. -->
        <svg width="22" height="36" viewBox="0 0 62 100" fill="currentColor" role="img" aria-label="Wright Family">
          <defs>
            <mask id="wf-brand-stencil-w">
              <rect width="62" height="100" fill="white" />
              <text
                x="31"
                y="48"
                text-anchor="middle"
                font-family="'IBM Plex Sans Condensed', 'IBM Plex Sans', system-ui, sans-serif"
                font-weight="700"
                font-size="40"
                letter-spacing="-1.5"
                fill="black"
              >W</text>
              <rect x="14" y="58" width="34" height="1.6" fill="black" />
              <path
                d="M31,66 L33.962,73.923 L42.413,74.292 L35.793,79.557 L38.053,87.708 L31,83.04 L23.947,87.708 L26.207,79.557 L19.587,74.292 L28.038,73.923 Z"
                fill="black"
              />
            </mask>
          </defs>
          <rect x="2" y="2" width="58" height="96" rx="6" mask="url(#wf-brand-stencil-w)" />
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
      <div style="font-size: 13px; color: var(--text);">
        {data.user.name || data.user.username}
      </div>
      <div class="mono" style="font-size: 11px; color: var(--text-subtle);">
        {data.user.email || data.user.username}
      </div>
    </div>
  {/snippet}

  {@render children?.()}
</AppShell>

<ToastViewport />

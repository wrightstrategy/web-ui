# App version display — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make app name + app version + `@wright/ui` kit version glanceable on every page of every homelab web app, on both desktop and mobile, via a typed `meta` prop on `AppShell`.

**Architecture:** `@wright/ui` gains an exported `KIT_VERSION` constant sourced from its own `package.json` via a Vite JSON import. `AppShell` gains a `meta: { name, version }` prop. When supplied, AppShell renders a version block inside `.wf-foot` on desktop and a single-line strip above the mobile tabbar (or pinned at the bottom edge when no tabbar exists). The template app wires `meta` from its own `package.json`; the `homelab-web-ui` skill documents the standard.

**Tech Stack:** Svelte 5 (`$props`, `$derived`, module-script types, snippets), SvelteKit, Vite (native JSON import via `with { type: 'json' }`), Bun workspaces. Existing theme tokens (`--text-muted`, `--text-subtle`, `--border`, `--font-mono`, `--surface`).

**Spec:** [`docs/superpowers/specs/2026-05-15-app-version-display-design.md`](../specs/2026-05-15-app-version-display-design.md)

**Testing note:** This repo has no Svelte component test runner today. Each task verifies via `bun run check` (svelte-check / type errors) and visual inspection in the template app's dev server at `http://localhost:5173`. Adding a JS test runner is out of scope and has not earned its place for a footer label.

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `packages/ui/src/lib/version.ts` | Create | Exports `KIT_VERSION` derived from kit's `package.json`. One JSON import, one re-export. |
| `packages/ui/src/lib/index.ts` | Modify | Re-export `KIT_VERSION` and the new `AppMeta` type. |
| `packages/ui/src/lib/layout/AppShell.svelte` | Modify | Add `AppMeta` type to module script, add `meta` prop, render desktop version block in `.wf-foot`, render mobile version strip above `.wf-phone-tabbar`. |
| `packages/ui/src/lib/theme/styles.css` | Modify | Convert `.wf-foot` to a column container with a new `.wf-foot-row` wrapper for legacy horizontal layout; add `.wf-version-block` (desktop) and `.wf-shell-version-strip` (mobile) rules; add the strip as a grid row in the mobile shell layout. |
| `templates/app/src/routes/+layout.svelte` | Modify | Import `package.json` and pass `meta={{ name: 'Template', version: pkg.version }}` to `AppShell`. |
| `skills/homelab-web-ui/SKILL.md` | Modify | Add the `meta` rule under "Layout primitives" and a corresponding line to the mobile-first / quality checklist. |

---

## Task 1: Add `KIT_VERSION` to `@wright/ui` and export it

**Files:**
- Create: `packages/ui/src/lib/version.ts`
- Modify: `packages/ui/src/lib/index.ts`

- [ ] **Step 1: Create `packages/ui/src/lib/version.ts`**

```ts
import pkg from '../../package.json' with { type: 'json' };

export const KIT_VERSION: string = pkg.version;
```

- [ ] **Step 2: Re-export `KIT_VERSION` from `packages/ui/src/lib/index.ts`**

Open `packages/ui/src/lib/index.ts`. Find the existing export block (immediately after the last component export, before `export { toast }`). Add this export line so it sits alongside the other top-level re-exports:

```ts
export { KIT_VERSION } from './version.js';
```

The final ordering of the file should be (preserving everything that already exists):

```ts
export { default as Badge } from './components/Badge.svelte';
// ... all existing component exports unchanged ...
export { default as ToastViewport } from './components/ToastViewport.svelte';

export { default as AppShell } from './layout/AppShell.svelte';
export { default as PageHeader } from './layout/PageHeader.svelte';

export { KIT_VERSION } from './version.js';

export { toast } from './stores/toast.svelte.js';
export type { Toast, ToastAction, ToastInput, ToastTone } from './stores/toast.svelte.js';

export type { NavIcon, NavItem, NavSection } from './layout/AppShell.svelte';
export type { Crumb } from './layout/PageHeader.svelte';
export type { TabBadgeTone, TabItem } from './components/Tabs.svelte';
```

- [ ] **Step 3: Verify with svelte-check from the template app**

Run from the repo root:

```bash
cd templates/app && bun run check
```

Expected: passes with no new errors. (The kit is consumed as source via the workspace protocol, so this validates the kit's TypeScript end-to-end.)

- [ ] **Step 4: Sanity-check the runtime value**

Run from the repo root:

```bash
bun -e "import('./packages/ui/src/lib/version.ts').then(m => console.log(m.KIT_VERSION))"
```

Expected: prints `0.0.0` (the current version in `packages/ui/package.json`).

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/lib/version.ts packages/ui/src/lib/index.ts
git commit -m "feat(ui): export KIT_VERSION from @wright/ui"
```

---

## Task 2: Add `AppMeta` type and `meta` prop to AppShell (no rendering yet)

**Goal of this task:** Land the typed prop and its re-export without changing any rendered output. This isolates "does the API compile end-to-end" from "does the layout render correctly", so the next two tasks fail loudly if something visual is off.

**Files:**
- Modify: `packages/ui/src/lib/layout/AppShell.svelte`
- Modify: `packages/ui/src/lib/index.ts`

- [ ] **Step 1: Add `AppMeta` to the AppShell module script and `meta` to `Props`**

Open `packages/ui/src/lib/layout/AppShell.svelte`. In the existing `<script lang="ts" module>` block (lines 1–26), add the `AppMeta` type alongside the existing `NavIcon` / `NavItem` / `NavSection` exports. The block becomes:

```svelte
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
```

Then, in the per-instance `<script lang="ts">` block (lines 28–46), extend the `Props` type and the destructured props. Replace the block with:

```svelte
<script lang="ts">
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
```

Do **not** touch the markup template in this task.

- [ ] **Step 2: Re-export `AppMeta` from `packages/ui/src/lib/index.ts`**

Open `packages/ui/src/lib/index.ts`. Extend the existing AppShell type re-export to include `AppMeta`:

```ts
export type { AppMeta, NavIcon, NavItem, NavSection } from './layout/AppShell.svelte';
```

- [ ] **Step 3: Verify with svelte-check**

```bash
cd templates/app && bun run check
```

Expected: passes. The `meta` prop is optional, so the template's existing `<AppShell {nav}>` call site keeps compiling.

- [ ] **Step 4: Verify dev server renders unchanged**

```bash
cd templates/app && bun run dev
```

Open `http://localhost:5173` in a desktop-width browser. Confirm: the sidebar foot still shows the "Scott / wrightfamily.org" identity row, exactly as before. Resize to ≤767px width and confirm the mobile tabbar still renders. Kill the server (Ctrl-C) before committing.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/lib/layout/AppShell.svelte packages/ui/src/lib/index.ts
git commit -m "feat(ui): add AppMeta type and meta prop to AppShell"
```

---

## Task 3: Render the desktop version block

**Goal of this task:** When `meta` is provided, render the three-line version block inside `.wf-foot`, below any user-provided `foot` snippet. No inner divider. The existing `.wf-foot` top border separates the whole footer area from the nav.

**Files:**
- Modify: `packages/ui/src/lib/layout/AppShell.svelte`
- Modify: `packages/ui/src/lib/theme/styles.css`

- [ ] **Step 1: Import `KIT_VERSION` inside the AppShell instance script**

In `packages/ui/src/lib/layout/AppShell.svelte`, add the import at the top of the per-instance `<script lang="ts">` block (the one without `module`):

```svelte
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
  // ... rest unchanged from Task 2 ...
</script>
```

- [ ] **Step 2: Update the sidebar footer markup in AppShell**

In the same file, replace the existing `{#if foot}` block (currently lines 74–76) with this combined block. The wrapper `<div class="wf-foot">` now renders when either `foot` OR `meta` is provided; the legacy horizontal layout moves into a new `.wf-foot-row` child so it survives the column switch in the CSS step:

```svelte
{#if foot || meta}
  <div class="wf-foot">
    {#if foot}
      <div class="wf-foot-row">{@render foot()}</div>
    {/if}
    {#if meta}
      <div class="wf-version-block">
        <div class="wf-version-name">{meta.name}</div>
        {#if meta.version}
          <div class="wf-version-app">v{meta.version}</div>
        {/if}
        <div class="wf-version-kit">ui v{KIT_VERSION}</div>
      </div>
    {/if}
  </div>
{/if}
```

The `{#if meta.version}` guard implements the spec's defensive edge case:
when `meta.version` is an empty string, the app-version line is omitted
but the name and kit-version lines still render. This case shouldn't
occur in practice since the value comes from `package.json`, but the
guard is one Svelte directive and prevents an awkward bare `v` from
appearing if something upstream goes wrong.

- [ ] **Step 3: Update CSS for `.wf-foot`, add `.wf-foot-row` and `.wf-version-block`**

Open `packages/ui/src/lib/theme/styles.css`. Replace the existing `.wf-sidebar .wf-foot` rule (lines 124–130) with the following. This switches the outer container to a column, preserves the previous horizontal layout in `.wf-foot-row`, and adds the version block:

```css
.wf-sidebar .wf-foot {
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border);
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  color: var(--text-muted);
}
.wf-sidebar .wf-foot-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.wf-sidebar .wf-version-block {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.wf-sidebar .wf-version-block .wf-version-name {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wf-sidebar .wf-version-block .wf-version-app,
.wf-sidebar .wf-version-block .wf-version-kit {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
}
```

- [ ] **Step 4: Verify svelte-check**

```bash
cd templates/app && bun run check
```

Expected: passes.

- [ ] **Step 5: Verify visually at desktop width**

```bash
cd templates/app && bun run dev
```

Open `http://localhost:5173` in a window wider than 767px. The sidebar's foot area still shows nothing version-related yet (the template doesn't pass `meta`). The existing "Scott / wrightfamily.org" identity row must still render correctly and still look like a single horizontal row (avatar + text). Resize to ≤767px and confirm the mobile tabbar still renders unchanged. Kill the server before committing.

This task by itself does not yet show a version anywhere because no caller passes `meta`. Task 5 wires the template; the visual proof of Task 3 comes there. The check here is "I haven't broken the existing foot layout".

- [ ] **Step 6: Commit**

```bash
git add packages/ui/src/lib/layout/AppShell.svelte packages/ui/src/lib/theme/styles.css
git commit -m "feat(ui): render desktop version block inside AppShell footer"
```

---

## Task 4: Render the mobile version strip

**Goal of this task:** When `meta` is provided, render a single-line strip on mobile, pinned to the bottom edge — above `.wf-phone-tabbar` if one exists, otherwise at the bottom of the viewport.

**Files:**
- Modify: `packages/ui/src/lib/layout/AppShell.svelte`
- Modify: `packages/ui/src/lib/theme/styles.css`

- [ ] **Step 1: Add the mobile strip element to AppShell's markup**

In `packages/ui/src/lib/layout/AppShell.svelte`, add the strip inside the root `<div class="wf-root wf-shell">` element, immediately before the existing `{#if tabbarItems.length > 0}` tabbar block (which lives at the end of the root). The full ordered markup inside `.wf-shell` becomes: `<aside>`, `<main>`, optional strip, optional tabbar. New block to add:

```svelte
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
```

The `{#if meta.version}` guard around the app-version span (and its
leading separator) matches the spec's defensive case: an empty
`meta.version` hides the app-version segment while still showing the
name and the kit version. The empty case shouldn't occur in practice
since the value comes from `package.json`.

The full markup region (root container down) should look like:

```svelte
<div class="wf-root wf-shell">
  <aside class="wf-sidebar">
    <!-- existing brand / nav / foot — unchanged from Task 3 -->
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
      <!-- existing tabbar links — unchanged -->
    </nav>
  {/if}
</div>
```

- [ ] **Step 2: Hide the strip on desktop and reveal/style it on mobile**

In `packages/ui/src/lib/theme/styles.css`, find the existing block (around line 311–327):

```css
.wf-shell .wf-shell-tabbar { display: none; }

@media (max-width: 767px) {
  .wf-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  .wf-shell > .wf-sidebar { display: none; }
  .wf-shell > .wf-main { grid-column: 1; }
  .wf-shell > .wf-shell-tabbar { display: flex; }
  .wf-topbar { padding: 12px 16px; }
  .wf-content { padding: 16px; }
}
```

Replace it with this — the desktop default hides the strip, and the mobile media query grows the grid to three rows (content / strip / tabbar) and styles the strip:

```css
.wf-shell .wf-shell-tabbar { display: none; }
.wf-shell .wf-shell-version-strip { display: none; }

@media (max-width: 767px) {
  .wf-shell {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto auto;
  }
  .wf-shell > .wf-sidebar { display: none; }
  .wf-shell > .wf-main { grid-column: 1; }
  .wf-shell > .wf-shell-version-strip { display: flex; }
  .wf-shell > .wf-shell-tabbar { display: flex; }
  .wf-topbar { padding: 12px 16px; }
  .wf-content { padding: 16px; }
}

.wf-shell-version-strip {
  min-height: 24px;
  padding: 4px 16px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-top: 1px solid var(--border);
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
}
.wf-shell-version-strip .wf-sep { opacity: 0.6; }
```

Notes:

- `grid-template-rows: 1fr auto auto;` is correct for both "tabbar present" and "tabbar absent": when the tabbar element isn't in the DOM, the third `auto` row collapses to 0 and the strip is the bottom-most row pinned against the viewport edge.
- Both `<aside>`, `<main>`, the strip, and the tabbar are flow children of the `.wf-shell` grid, so they auto-place into successive rows in the order they appear in the DOM (which is why Step 1 puts the strip *after* `<main>` and *before* the tabbar).

- [ ] **Step 3: Verify svelte-check**

```bash
cd templates/app && bun run check
```

Expected: passes.

- [ ] **Step 4: Visual verification (no strip yet, template doesn't pass meta)**

```bash
cd templates/app && bun run dev
```

Open `http://localhost:5173`. Resize to ≤767px. Confirm:

- Mobile tabbar still renders unchanged (icons across the bottom).
- No version strip appears (because the template still doesn't pass `meta`).
- Page content area still scrolls / sizes correctly.

Resize back to >767px. Confirm desktop layout is unchanged. Kill the server.

- [ ] **Step 5: Commit**

```bash
git add packages/ui/src/lib/layout/AppShell.svelte packages/ui/src/lib/theme/styles.css
git commit -m "feat(ui): render mobile version strip above tabbar"
```

---

## Task 5: Wire `meta` into the template app

**Goal of this task:** Pass `meta` from the template's `+layout.svelte` so the version block shows up in the scaffolded reference app. This is also the first visual proof that Tasks 3 and 4 work end-to-end.

**Files:**
- Modify: `templates/app/src/routes/+layout.svelte`

- [ ] **Step 1: Import the template's `package.json` and pass `meta` to AppShell**

Open `templates/app/src/routes/+layout.svelte`. Add the JSON import at the top of the `<script lang="ts">` block:

```svelte
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
    LogIn,
    LayoutDashboard,
    UserCircle,
  } from '@lucide/svelte';

  let { children } = $props();

  const meta = { name: 'Template', version: pkg.version };

  const nav: NavSection[] = $derived([
    // ... unchanged ...
  ]);
</script>
```

Then change the `<AppShell {nav}>` opening tag to:

```svelte
<AppShell {nav} {meta}>
```

Leave the `brand`, `foot` snippets and the rest of the template body untouched.

- [ ] **Step 2: Verify svelte-check**

```bash
cd templates/app && bun run check
```

Expected: passes.

- [ ] **Step 3: Visual verification — desktop**

```bash
cd templates/app && bun run dev
```

Open `http://localhost:5173` at a window width > 767px. Confirm:

- The sidebar foot now shows two stacked elements: the existing "Scott / wrightfamily.org" identity row at the top, and below it three lines: `Template`, `v0.0.0`, `ui v0.0.0`. (Both versions read `0.0.0` because neither `templates/app/package.json` nor `packages/ui/package.json` has been bumped past it.)
- No inner divider between the identity row and the version block — just whitespace.
- The `.wf-foot` top border still separates the whole footer area from the nav above.

- [ ] **Step 4: Visual verification — mobile**

Resize the same dev-server tab to ≤767px (or use Chrome DevTools device mode). Confirm:

- A thin strip with `Template · v0.0.0 · ui v0.0.0` appears directly above the icon tabbar.
- Centered, monospaced, low-contrast (text-subtle on surface).
- The page-content area shrinks by the strip's height; the tabbar remains anchored at the bottom edge.
- Tapping a tab still works as before.

Kill the dev server.

- [ ] **Step 5: Commit**

```bash
git add templates/app/src/routes/+layout.svelte
git commit -m "feat(template): wire AppShell meta from package.json"
```

---

## Task 6: Document the standard in `homelab-web-ui`

**Goal of this task:** Make this a standard for every new app by documenting the rule in the skill. Future scaffolds get the wiring from the template; the skill's job is to tell agents and humans not to remove it.

**Files:**
- Modify: `skills/homelab-web-ui/SKILL.md`

- [ ] **Step 1: Add a `meta` rule to the "Layout primitives" section**

Open `skills/homelab-web-ui/SKILL.md`. Find the `## Layout primitives` section (around line 179). Replace the `<AppShell>` bullet with this expanded one:

```markdown
- **`<AppShell>`** is the root container. It applies `.wf-root` for
  you, renders the sidebar / mobile tabbar, takes `brand`, `foot`, and
  `children` snippets plus a structured `nav: NavSection[]` array.
  Sections support `mobileOnly` and `desktopOnly` flags. Icons are
  `@lucide/svelte` components passed by reference, not snippets.
  **Always pass `meta={{ name, version }}` — `meta.version` should be
  read from the app's own `package.json` via a JSON import.** The kit
  appends its own version (`ui v<KIT_VERSION>`) automatically; you
  don't pass it. The template wires this for you; don't remove it.
```

- [ ] **Step 2: Add the rule to the mobile-first / quality checklist**

In the same file, find the `## Mobile-first checklist` section (around line 75). Append a new item to the checklist list:

```markdown
- [ ] `AppShell` receives a `meta={{ name, version }}` prop sourced from
      `package.json`. The desktop sidebar shows app name + app version +
      kit version; the mobile strip above the tabbar shows the same line.
```

- [ ] **Step 3: Verify the file renders cleanly**

```bash
head -100 skills/homelab-web-ui/SKILL.md
```

Expected: no broken Markdown, no duplicated bullets, the new checklist item visible.

- [ ] **Step 4: Commit**

```bash
git add skills/homelab-web-ui/SKILL.md
git commit -m "docs(skills): require AppShell meta prop in homelab-web-ui"
```

---

## Final verification

After all tasks are committed:

- [ ] **Step 1: Re-run svelte-check from the template**

```bash
cd templates/app && bun run check
```

Expected: passes clean.

- [ ] **Step 2: Visual smoke test — desktop and mobile**

```bash
cd templates/app && bun run dev
```

- Desktop (width > 767px, `http://localhost:5173`): sidebar foot shows identity row, then `Template / v0.0.0 / ui v0.0.0` block.
- Mobile (≤767px): single-line strip above tabbar reading `Template · v0.0.0 · ui v0.0.0`.
- Both: no inner divider between user foot and version block; existing `.wf-foot` top border separates footer from nav; tabbar remains anchored.

Kill the dev server.

- [ ] **Step 3: Confirm git log**

```bash
git log --oneline -7
```

Expected: six new commits in this sequence (most recent first):

1. `docs(skills): require AppShell meta prop in homelab-web-ui`
2. `feat(template): wire AppShell meta from package.json`
3. `feat(ui): render mobile version strip above tabbar`
4. `feat(ui): render desktop version block inside AppShell footer`
5. `feat(ui): add AppMeta type and meta prop to AppShell`
6. `feat(ui): export KIT_VERSION from @wright/ui`

Plus the prior spec commits (`bd43cf9`, `ac9c7c1`, `71dc3fa`).

---

## Out of scope (deferred — do not implement)

These are documented in the spec's "Future follow-ups" section. Do not add them in this plan:

- Git SHA, build timestamp, or branch name in the badge.
- Tooltip, click-to-copy, or link to changelog from the version block.
- `/about` or `/settings` page with extended build metadata.
- "Newer version available" banner.
- Pre-commit hook validating `version.ts` ↔ `package.json` — not needed under the JSON-import mechanism, but listed in the spec so a future contributor doesn't re-propose it.
- A JS test runner for the kit. Adding `@testing-library/svelte` + `vitest` is a separate concern that has not earned its place for this feature.

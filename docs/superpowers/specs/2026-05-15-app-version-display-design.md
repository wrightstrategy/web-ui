# App version display — design

**Date:** 2026-05-15
**Status:** Approved, ready for implementation plan
**Scope:** `@wright/ui`, `templates/app`, `skills/homelab-web-ui`

## Problem

Every homelab web app should make its identity and version glanceable from any
page. Today there is no convention: an operator looking at a tab in Chrome
cannot answer "which build is this?" without shelling into the cluster or
reading image tags. Stale browser caches make this worse — the UI can lag the
deploy with no visible signal.

The fix is small: render the app's name and version, plus the `@wright/ui` kit
version, in the existing `AppShell` footer area on every page. The cost is a
few lines of text; the benefit is a free debugging signal during incidents and
during rollouts of kit-wide changes.

## Goals

- Make app name + app version + kit version visible on every page of every
  homelab web app, on both desktop and mobile.
- Standardize the placement and rendering so apps cannot drift.
- Add zero per-app boilerplate beyond passing one `meta` prop.
- Eliminate any "remember to run the sync script" failure mode.

## Non-goals (v1)

- No git SHA, build timestamp, branch name, or other build metadata.
- No tooltip, hover popover, click-to-copy, or link to changelogs / releases.
- No `/about` or `/settings` page surfacing extended build info.
- No automatic detection of stale caches or "newer version available" banners.

These are easy to add later without breaking the v1 API.

## Public API

A new optional `meta` prop on `AppShell`:

```ts
// packages/ui/src/lib/layout/AppShell.svelte (module script)
export type AppMeta = {
  name: string;     // human-readable display name, e.g. "Template", "Inbox"
  version: string;  // semver string with no leading 'v', e.g. "1.2.3"
};

type Props = {
  brand?: Snippet;
  nav?: NavSection[];
  foot?: Snippet;
  meta?: AppMeta;     // NEW
  children?: Snippet;
};
```

`AppMeta` is re-exported from `packages/ui/src/lib/index.ts` so apps can type
their `meta` object.

The kit's own version is exposed as a baked constant:

```ts
// packages/ui/src/lib/version.ts
import pkg from '../../package.json' with { type: 'json' };
export const KIT_VERSION: string = pkg.version;
```

`KIT_VERSION` is re-exported from `packages/ui/src/lib/index.ts`. Apps do not
need to read or pass it — `AppShell` consumes it internally — but exporting it
lets apps reference it elsewhere (about screens, debug overlays) without
duplicating the import.

## KIT_VERSION mechanism

`KIT_VERSION` is derived at build time from `packages/ui/package.json` via a
direct JSON import. There is no sync script, no codegen step, and no
pre-commit hook. The value has exactly one source.

**Caveat to record explicitly:** `@wright/ui` assumes Vite/SvelteKit-style JSON
module support in the consumer. Every intended consumer satisfies this today.
If a future non-Vite consumer appears (raw-Node test runner, alternate SSR
host), that future earns the complexity at that time.

## Visual treatment

### Desktop

The version block renders inside `.wf-foot`, below any user-provided `foot`
snippet, with no inner divider between them. The existing `.wf-foot`
`border-top` already separates the whole footer area from the nav.

```
┌──────────────┐
│  …nav…       │
│              │
│ ──────────── │   ← existing .wf-foot border-top
│  ◉ Scott     │   ← user-provided foot snippet (if any)
│              │
│  Template    │   ← meta.name           — 12px, color: var(--text-muted)
│  v1.2.3      │   ← v{meta.version}     — mono 11px, color: var(--text-subtle)
│  ui v0.3.1   │   ← ui v{KIT_VERSION}   — mono 11px, color: var(--text-subtle)
└──────────────┘
```

Typography and color use existing theme tokens — no new tokens introduced.
Line-height is tight (1.15) so the three lines occupy minimal vertical space.

### Mobile

At `<768px` the sidebar (and therefore `.wf-foot`) is hidden. `AppShell`
renders a new strip directly above `.wf-phone-tabbar`:

```
…page content…
─────────────────────────────────────   ← 1px top border, var(--border)
 Template · v1.2.3 · ui v0.3.1           ← 24px tall, centered, mono 11px,
                                            color: var(--text-subtle)
─────────────────────────────────────
[ tabbar icons ]
```

The strip is a single line with `·` separators. It belongs to AppShell's
grid, so the page-content area shrinks by the strip's height — the tabbar
remains anchored at the bottom edge.

## Rendering contract (locked)

- Render the footer area (desktop) and the mobile strip iff `foot || meta` is
  truthy on desktop, or `meta` is truthy on mobile.
- When `meta` is provided **with** `foot`: footer area shows the foot snippet
  in its existing horizontal row, then the version block below. No inner
  divider between the two.
- When `meta` is provided **without** `foot`: footer area shows only the
  version block. Outer `.wf-foot` top border is unchanged. No inner divider.
- When `foot` is provided **without** `meta`: behavior is identical to today.
  No version block, no mobile strip.
- When neither is provided: no `.wf-foot` element on desktop, no mobile strip.

## Template wiring

`templates/app/src/routes/+layout.svelte` reads its own version from
`package.json` and passes a `meta` object:

```ts
import pkg from '../../package.json' with { type: 'json' };

const meta = { name: 'Template', version: pkg.version };
```

```svelte
<AppShell {nav} {meta}>
  …
</AppShell>
```

The display `name` is hard-coded per app rather than derived from
`pkg.name`, because `pkg.name` is the npm-scoped package name
(`@wright/app-template`) while the badge wants a human-readable label.

## Standardization

Three places change to make this the standard for every new app:

1. **`packages/ui`** — adds `meta` prop and rendering (desktop block + mobile
   strip + CSS), `version.ts`, public exports from `lib/index.ts`.
2. **`templates/app`** — wires `meta` into `+layout.svelte` so every
   freshly-scaffolded app gets the badge with zero extra work.
3. **`skills/homelab-web-ui`** — adds a one-line item to the AppShell rules:
   *"Always pass `meta={{ name, version }}` to `AppShell`. The kit appends
   its own version."* Plus a corresponding line in the quality-gate
   checklist so reviews catch the omission.

## Edge cases / defensive behavior

- `meta.version === ''` — render the name line only. Defensive; should not
  occur in practice since the value comes from `package.json`.
- `KIT_VERSION === '0.0.0'` — render `ui v0.0.0`. Truthful for pre-release
  state of the kit.
- Long `meta.name` — clamps to one line with `text-overflow: ellipsis`.
  Sidebar width is fixed by design, so wrapping is the only risk worth
  guarding against.
- The version block is **informational only**: no click handler, no link,
  no focus target. Screen readers should reach it as static text.

## Accessibility

- The desktop block is wrapped in `<div role="contentinfo">` so it surfaces
  as a landmark in screen reader rotors.
- The mobile strip uses the same role.
- Text colors meet WCAG AA against `var(--surface)` and `var(--bg)` since
  they use existing `text-muted` / `text-subtle` tokens that already pass.

## Future follow-ups (deferred, do not implement)

These are explicitly out of scope for v1. Documented here so the v1 design
can be evaluated against them and so a future revision can pick them up
without re-discovering the rationale.

- Click-to-copy of the full name + version + kit-version string.
- Optional `meta.commit` / `meta.builtAt` fields surfaced via a hover or
  long-press tooltip.
- Link from the version block to a `/about` page with extended build info.
- A "newer version available" banner triggered by a small `meta.json` poll.
- A pre-commit hook or `version:check` script — not needed under the chosen
  JSON-import mechanism, but listed here so a future contributor doesn't
  re-propose it without context.

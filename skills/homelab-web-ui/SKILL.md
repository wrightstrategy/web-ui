---
name: homelab-web-ui
description: Use when scaffolding a new homelab web app or building/modifying any page inside a SvelteKit project that consumes `@wright/ui`. Covers the canonical scaffolder command, the seven page recipes with their file locations, the SvelteKit render-mode decision tree (default vs `csr = false` vs `prerender`), the mobile-first checklist, the pinned Vite + Superforms conventions that silently break otherwise, and the AppShell / PageHeader / theme-token rules.
---

# `homelab-web-ui`

The primary skill for building homelab web UIs on the Wright family kit.
Every page should map to one of the seven recipes in `templates/app`,
every form must follow the pinned conventions below, and every new app
should be scaffolded — not hand-rolled.

## Scaffold first, write second

```bash
# From the web-ui workspace root:
bun run create-app ~/Projects/my-new-app

# Or directly:
bun packages/create-app/cli.ts ~/Projects/my-new-app
```

Flags: `--name <pkg>` (default `@wright/<basename>`), `--force` (allow
non-empty target). The scaffolder refuses to overwrite a populated
directory unless `--force` is passed.

The scaffolder rewrites `@wright/ui` as `workspace:*` inside the web-ui
workspace or a relative `file:` path outside. The `bun create @wright/app`
form is deferred until registry publishing is solved — same code path.

After scaffolding:

```bash
cd my-new-app
bun install
bun run check     # type-check
bun run dev       # http://localhost:5173
```

## The recipe map

When building a new page, **find the closest recipe and copy it**.
Don't re-invent the page shape — adapt an existing one. Each recipe
lives in `templates/app/src/routes/...`.

| Page shape you need | URL | Template path | Key patterns |
|---|---|---|---|
| Dashboard / overview | `/` | `routes/+page.svelte` | Cards, Modal + Toast |
| Server-rendered table / list | `/queue` | `routes/queue/+page.svelte` (+`.server.ts`) | `csr = false`, GET filter form, mobile card-list |
| Form / edit with validation | `/queue/[id]/edit` | `routes/queue/[id]/edit/` | Superforms + Zod, redirect-then-toast |
| Multi-form settings | `/settings` | `routes/settings/` | Three independent Superforms, named actions |
| Async / job status | `/operations/[id]` | `routes/operations/[id]/` | `depends()` + `invalidate()` polling |
| Mobile-first triage | `/triage` | `routes/triage/` | One card, three bottom buttons, ≥52px tap targets |
| Login | `/login` | `routes/login/` | Stub auth, plain form (no Superforms), `requireSession()` helper |

If no recipe fits, start a sketch and surface the gap. Don't synthesize
a new page shape from primitives if a closer fit exists in another
recipe.

## Render-mode decision

SvelteKit pages run in one of three modes. Pick deliberately.

| Mode | Setting | When to use |
|---|---|---|
| **Default** (SSR + CSR) | nothing | Anything interactive: forms, dashboards, polling, modals |
| **`csr = false`** | `export const csr = false` in `+page.ts` or `+page.server.ts` | Pure read views with no client state — table pages, error pages, the login screen |
| **`prerender`** | `export const prerender = true` | Static content that's the same for every visitor — marketing, docs |

`csr = false` is not just a perf knob — it's a *no-JS contract*. Verify
the page works without JS before shipping (the `/queue` recipe is the
canonical proof: filter form, table, mobile card-list, empty state,
and error page all work via curl).

## Mobile-first checklist

Every recipe ships through this list before merge:

- [ ] Tested at 375px viewport (Chrome forces a 500px window minimum on
      macOS — design for 375 in CSS, accept that local browser tests
      run at 500).
- [ ] Tap targets ≥44px (52px for primary mobile actions like triage
      buttons).
- [ ] No hover-only affordances. Every hover state has a tap or focus
      equivalent.
- [ ] Visible `:focus-visible` ring on every interactive control. The
      kit's `--focus-ring` token is applied automatically when you use
      kit components.
- [ ] No horizontal scroll at 375px.
- [ ] View Transitions enabled — they live in the root `+layout.svelte`
      via the kit's AppShell snippet structure, so this is automatic.
- [ ] `AppShell` receives a `meta={{ name, version }}` prop sourced from
      `package.json`. The desktop sidebar shows app name + app version +
      kit version; the mobile strip above the tabbar shows the same line.

## Pinned conventions (these silently break otherwise)

### Vite config

Every consuming app's `vite.config.ts` needs:

```ts
export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    dedupe: ['svelte'],
  },
  optimizeDeps: {
    include: ['sveltekit-superforms', 'sveltekit-superforms/client'],
  },
  ssr: {
    noExternal: ['sveltekit-superforms'],
  },
});
```

Without `dedupe`, Vite pre-bundles two separate Svelte runtimes, and
Superforms' `onDestroy` throws `lifecycle_outside_component` —
**silently** breaking all form-state binding (no fetch, no errors, no
toasts). The scaffolder ships this config; don't remove it.

### Forms

- **`novalidate` on every Superforms-bound form.** `type="email"` and
  numeric `min`/`max` otherwise trigger HTML5 validation that silently
  blocks submission before Zod runs. The user sees nothing.
- **Server validation is the source of truth.** Native POST → server
  Zod check → `fail(400, { form })` on invalid, `redirect(303, ...?saved=...)`
  on valid. `use:enhance` is the JS enhancement, not the validation.
- **Coherent no-JS fallback.** Successful submit renders a server-side
  banner via URL state (`?saved=…`). Toast is layered on top via
  `superForm`'s `onResult` for JS users. Never make success affordance
  toast-only.
- **Multi-form pages** need `invalidateAll: false` on each `superForm`
  call, *and* matching `id` options on both server `superValidate(...)`
  and client `superForm(...)`. Without `id` matching, fail() results
  don't route back to the right client form. Without `invalidateAll:
  false`, submitting one form re-runs load and resets the others.
- **Action returns `{ <formName> }`** matching the page's
  `data.<formName>` property. That's how the result threads through
  `$page.form` to the right superForm.
- **Login is the canonical "tiny form" escape hatch** — plain server
  action, no Superforms, inline error on failure, redirect on success.

### Polling

```ts
// +page.server.ts
export const load: PageServerLoad = async ({ depends, params }) => {
  depends('app:operation');
  return { /* fresh state */ };
};
```

```ts
// +page.svelte
$effect(() => {
  const live = data.job.status === 'queued' || data.job.status === 'running';
  if (!live) return;                                  // stop when terminal
  const id = setInterval(() => invalidate('app:operation'), 2000);
  return () => clearInterval(id);
});
```

The terminal-state guard is non-negotiable. Polling a completed job
wastes server work and triggers cache churn.

## Theme conventions

- **Use tokens.** Every color, font, radius, shadow, and spacing value
  comes from `--accent`, `--text`, `--surface`, `--font-sans`, etc.
  See `packages/ui/src/lib/theme/tokens.css` for the full list.
- **Never inline hex.** If a design needs a one-off color, add a token
  to `tokens.css` or use `color-mix(in srgb, var(--accent) 12%, transparent)`.
- **Dark default.** `<html data-theme="dark">` in `src/app.html`.
  Switch to `data-theme="light"` for light mode; tokens have parallel
  definitions for both. No CSS overrides needed.
- **Mono / display fonts.** `var(--font-mono)` is IBM Plex Mono;
  `var(--font-display)` is IBM Plex Sans Condensed. Use the `.mono`
  utility class for in-line monospace.

## Layout primitives

- **`<AppShell>`** is the root container. It applies `.wf-root` for
  you, renders the sidebar / mobile tabbar, takes `brand`, `foot`, and
  `children` snippets plus a structured `nav: NavSection[]` array.
  Sections support `mobileOnly` and `desktopOnly` flags. Icons are
  `@lucide/svelte` components passed by reference, not snippets.
  **Always pass `meta={{ name, version }}` — `meta.version` should be
  read from the app's own `package.json` via a JSON import.** The kit
  appends its own version (`ui v<KIT_VERSION>`) automatically; you
  don't pass it. The template wires this for you; don't remove it.
- **`<PageHeader title=...>`** is on every page. It sets `<title>` via
  `<svelte:head>`, renders the topbar with crumbs / title / badges /
  actions / tabs slots. The title prop drives both the `<h1>` and the
  document title.

Pages that bypass AppShell (rare — usually for full-bleed marketing)
need a top-level `<div class="wf-root">` wrapper themselves.

## When `@wright/ui` doesn't have what you need

Build it app-local first. Promote to the kit only when:

1. A second app needs the same component (or a near-identical variant),
   *and*
2. The component is generic enough that its props don't leak app-specific
   concerns.

The `homelab-web-component-add` skill covers promotion mechanics.
Until then, recipe-specific CSS lives in the recipe's `<style>` block.

## Reference

- Strategy spec: `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md`
- Design canvas: `design/v1.0/project/Wright UI System.html`
- Pinned conventions: §"Pinned conventions (learned from the template app)" in the spec
- Scaffolder: `packages/create-app/cli.ts`
- Template app source of truth: `templates/app/`
- Foundational components: `packages/ui/src/lib/{components,layout}/`
- Tokens: `packages/ui/src/lib/theme/tokens.css`

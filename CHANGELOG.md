# Changelog

All notable changes to `web-ui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-05-14

First usable release. The loop is closed: design tokens → kit components
→ recipes → scaffolder → skills, end-to-end verified by a fresh app
scaffolded outside the workspace.

### Added

**Design system (`packages/ui`)**

- 13 foundational components: `Button`, `Badge`, `Card`, `Input`,
  `FormField`, `Select`, `Checkbox`, `Table`, `Tabs`, `Modal`, `Toast`
  (+ `ToastViewport`), plus `AppShell` and `PageHeader` layout
  primitives.
- `tokens.css` — verbatim from Design v1.0's "Frontier" direction.
  Semantic color, type, spacing, radius, shadow, and motion tokens
  with parallel dark / light scopes plus print and reduced-motion
  media queries.
- `styles.css` — canonical component CSS layer. Reset scoped via
  `:where()` so component classes win specificity without gymnastics.
  Responsive AppShell collapse at <768px.
- Brand assets — Wright family + per-app stencil marks (SVG),
  favicons.
- Singleton `toast` store with `ToastViewport` component (top-right
  desktop, top-stretched mobile, pause-on-hover, manual + auto
  dismiss, action button).

**Scaffolder (`packages/create-app`)**

- Bun CLI that copies `templates/app` to a target directory.
- Auto-detects in-workspace vs. external targets and rewrites the
  `@wright/ui` dependency accordingly (`workspace:*` or relative
  `file:` path back to `packages/ui`).
- Refuses to scaffold into a non-empty directory unless `--force`.
- Local invocation: `bun run create-app <target>` from the workspace
  root, or `bun packages/create-app/cli.ts <target>` directly. The
  `bun create @wright/app` form is the same code path behind a
  published entry point once distribution is solved.

**Template app (`templates/app`)**

Seven canonical page recipes, each demonstrating a kit idiom in real
use:

- `/` — dashboard (status bar, 3-up cards, Modal + Toast via archive
  flow).
- `/queue` — server-rendered table with GET filter form, mobile
  card-list, empty + error states, `csr = false`.
- `/queue/[id]/edit` — Superforms + Zod, redirect-then-toast, no-JS
  coherent banner via `?saved=1`.
- `/settings` — three independent Superforms with named actions,
  per-section save state, `invalidateAll: false`.
- `/operations/[id]` — polling via `depends()` + `invalidate()` with
  terminal-state guard; cancel/retry actions.
- `/triage` — mobile-first single-card flow, three ≥52px buttons at
  card bottom for one-handed thumb reach.
- `/login` — stub auth (plain form, no Superforms), inline error,
  redirect-on-success, session cookie shape.

Plus shared `$lib/server/auth.ts` with `getSession` / `setSession` /
`clearSession` / `requireSession` / `redirectToLogin` /
`redirectAfterLogin`. Open-redirect protection on `?next=` parameters.

**Skills (`skills/`)**

- `homelab-web-ui` — primary. Scaffolder command, recipe map,
  render-mode decision tree (default / `csr = false` / `prerender`),
  mobile-first checklist, pinned Vite + Superforms conventions,
  theme tokens, AppShell + PageHeader patterns.
- `homelab-web-backend-bridge` — helper. SvelteKit-as-public-face
  rule, `apiFetch` wrapper with Zod boundary validation, shared
  error envelope shape, session-cookie forwarding, conservative
  timeout (5s) + retry guidance.
- `homelab-web-component-add` — helper. Earn-its-place rule
  (2-app reuse + generic API), component-vs-recipe tree, exports
  from `index.ts`, prop-API discipline, 7-item quality gate,
  promotion mechanics.

**Spec & design archive**

- `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md` —
  strategy and architecture. The §"Pinned conventions" section
  captures every silent-failure trap surfaced during the template
  build (Vite Svelte dedup, Superforms `novalidate`, multi-form
  `invalidateAll: false` + matching `id`, no-JS coherent fallback).
- `design/v1.0/` — full Claude Design handoff bundle in-tree:
  canvas HTML, tokens source, base CSS, brand marks, app icons,
  social OG images, HANDOFF.md, original chat transcript.

### Conventions established

- **No browser-to-backend traffic.** Every upstream call goes through
  SvelteKit `load`/actions. CORS doesn't enter the picture; backends
  can stay on private networks.
- **Server validation is the source of truth.** Forms run native POST
  → server Zod check → `fail(400, { form })` or `redirect(303, ...?saved=…)`.
  `use:enhance` is the JS layer, not the validation.
- **No-JS coherent fallback is non-negotiable.** Successful submissions
  render a server-side banner via URL state. Toast is the enhancement,
  never the only success affordance.
- **Tokens always; never inline hex.** Every color, font, radius,
  shadow, and spacing value reads from `tokens.css`.
- **Mobile-first.** 375px CSS target. Tap targets ≥44px (52px for
  primary mobile actions). No hover-only affordances. Visible
  `:focus-visible` ring on every interactive control.

### Verified

Loop closed end-to-end: a fresh app scaffolded outside the workspace
installs cleanly, type-checks, builds, runs, and renders every recipe
including the no-JS path (`/queue?q=nonexistent` returns a usable
server-rendered empty state via curl alone).

### Notes for consumers

- Distribution is workspace-first. `@wright/ui` is consumed via Bun
  workspace protocol or a relative `file:` path. Forgejo npm registry
  publishing is deferred until a consumer lives outside `~/Projects/`.
- `styles.css` imports IBM Plex from Google Fonts. Self-hosting before
  the kit becomes load-bearing for any user-facing app is an open item
  in the spec.
- `bun run check` produces 4 known warnings — all variants of Svelte
  5's `state_referenced_locally` false-positive on the Superforms
  `superForm(data.form, ...)` initialization pattern. Not blocking.

[1.0.0]: https://git.txsww.com/scott/web-ui/releases/tag/v1.0.0

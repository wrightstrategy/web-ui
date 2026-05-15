# Unified Homelab Web UI Strategy

**Status:** Approved (design phase). Awaiting implementation plan.
**Date:** 2026-05-14
**Repo:** `~/Projects/web-ui` (intended remote: `git.txsww.com`)

## Thesis

Stop reinventing the UI wheel across homelab apps by building a **thin, repeatable UI spine**: a single SvelteKit stack, a small kit of shared tokens and components, a template app that embodies every convention, and skills that teach agents how to use it. Components are the nouns; **recipes, render-mode rules, tokens, and skills are what actually stop the reinvention.**

## Goals

- New apps reach a usable, mobile-first UI in <30 min of agent work using the kit and skills.
- Visual identity is consistent across family-facing apps without forcing every app to look identical.
- Mobile-first by default — every app usable on a phone before it ships.
- Per-app token spend (when agents build the UI) drops materially vs. current "build from scratch" baseline.

## Non-Goals

- **Cross-app auth / SSO / portal.** Deferred to a separate "homepage" project.
- **Existing-app migration on a deadline.** Migration is opportunistic; current apps (`sentinel`, `higgins`, `paperless-enricher`, `scan-router`) move when convenient.
- **A "platform" with plugin system.** The kit is a thin spine, not infrastructure.
- **Native mobile apps.** Mobile web is the target.

## Design v1.0 — Source of Truth

Visual and component-level specification was authored separately in Claude Design and exported as a handoff bundle, archived at `design/v1.0/` in this repo. The strategy spec (this document) defines the *approach*; the design v1.0 bundle defines the *appearance* and the *component contract*.

When the two diverge: **the canvas wins** until the canvas is updated. The handoff bundle contains:

- `design/v1.0/project/Wright UI System.html` — the canvas, top-to-bottom design (brand, tokens, all 13 components with variants, all 8 page recipes desktop + mobile, states, auth conventions, polish, status).
- `design/v1.0/project/tokens.css` — canonical semantic tokens. **This file is dropped directly into `packages/ui/src/lib/theme/tokens.css` unchanged.**
- `design/v1.0/project/shared/base.css` — base reset + component layer. The component CSS is split out into `packages/ui/src/lib/theme/styles.css`.
- `design/v1.0/project/assets/` — brand marks (wright/sentinel/higgins/paperless/scan-router), app icons (1024px), favicon, social OG images.
- `design/v1.0/project/HANDOFF.md` — explicit step-by-step implementation order, smoke-test checklist, and recipe→render-mode cheatsheet. **This is the canonical implementation plan.**
- `design/v1.0/project/*.jsx` — visual-reference-only React/JSX renderings of each component and recipe. Components are re-authored as native Svelte 5 with matching DOM shape and class names.

The design picks the **Frontier** direction (committed dusty Texas: brick red `#c24b3a`, oxidized navy `#13171f`, bone text `#ebe4d4`, IBM Plex Sans / Plex Sans Condensed / Plex Mono).

## Architecture

### Stack

**Bun + SvelteKit + Svelte 5 + Tailwind (optional ergonomic layer).**

The light-to-heavy spectrum lives inside SvelteKit's render-mode knobs:

| Page need | Setting | Resulting payload |
|---|---|---|
| Pure static (rare) | `export const prerender = true` | Built-once HTML |
| Server-rendered, no JS needed | `export const csr = false` | HTML only, ~zero JS — htmx-class mobile performance |
| Interactive (default) | (no override) | SSR + hydration; full Svelte reactivity |
| SPA-style (rare) | `export const ssr = false` | Client-rendered shell |

The render-mode decision is the most important agent skill in the whole system. It is taught explicitly in the primary skill.

### Layers

1. **`web-ui` repo** — shared design system, component library, template app, skills.
2. **Per-app SvelteKit projects** — each app's frontend, consuming the kit as a workspace package or published npm package on Forgejo's npm registry.
3. **Skills** — three skills (one primary, two helpers) teach the conventions.

### Backend boundary

- **No backend needed** → SvelteKit server routes / form actions do everything (`+server.ts`, `+page.server.ts`).
- **Light backend** → Bun + Hono service, called server-side from SvelteKit.
- **Python required** (ML/OCR/Paperless integration) → FastAPI service exposing JSON; SvelteKit calls it from `load`/actions, server-side (no CORS).

SvelteKit is always the public-facing surface. Python services are internal.

## The `web-ui` Repo

Lives at `~/Projects/web-ui`. Bun workspace. Pushed to `git.txsww.com`.

```
web-ui/
├── packages/
│   ├── ui/                     # @wright/ui — component library
│   │   └── src/lib/
│   │       ├── components/     # 13 foundational components (below)
│   │       ├── layout/         # AppShell, PageHeader
│   │       ├── theme/
│   │       │   ├── tokens.css  # semantic CSS variables
│   │       │   ├── styles.css  # base styles + component CSS (canonical visual system)
│   │       │   └── tailwind-preset.js   # optional ergonomic layer
│   │       └── icons/          # Lucide re-exports
│   └── create-app/             # scaffolder; local invocation during vertical slice
├── templates/
│   └── app/                    # the SOURCE OF TRUTH — see §"Template App"
├── docs/                       # explanations of what the template embodies
├── skills/                     # in-repo skills, symlinked to ~/.claude/
└── README.md
```

**Distribution:** `@wright/ui` is consumed as a Bun workspace dependency from sibling repos under `~/Projects/`. Publishing to Forgejo's npm registry is deferred until a consumer lives outside the workspace (see Remaining Open Questions). Skills are symlinked from `web-ui/skills/` into `~/.claude/` initially; promoted to a plugin only after the workflow proves stable.

## Design System

### Semantic tokens (CSS custom properties)

Tokens are defined semantically, not as raw colors. The same token names exist in both `[data-theme="dark"]` and `[data-theme="light"]` scopes.

**Surface / text / border:**
- `--surface`, `--surface-raised`, `--surface-muted`
- `--text`, `--text-muted`, `--text-subtle`
- `--border`, `--border-strong`

**Intent:**
- `--accent`, `--success`, `--warning`, `--danger`, `--info`

**Style:**
- `--focus` (focus ring color)
- `--shadow-sm`, `--shadow-md`
- `--radius-sm`, `--radius-md`, `--radius-lg`
- `--space-1` … `--space-12` (4px scale)

### CSS distribution: two complementary surfaces

- **`@wright/ui/styles.css`** — the **canonical visual system**: tokens, resets, component base styles. Works with zero JS framework. This is what makes the kit portable.
- **`@wright/ui/tailwind-preset`** — Tailwind config that maps utilities to the same tokens (`bg-surface`, `text-muted`, etc.). Optional ergonomic layer for app authors. Components themselves do **not** require Tailwind to render correctly.

Apps can use either, both, or only `styles.css`. Tailwind is never a hard dependency of the kit.

### Theme neutrality

The kit ships both dark and light token sets and is **theme-neutral by default**. The template app chooses dark (homelab-native admin feel); family-facing apps are free to default to light. Theme switching is a `data-theme` attribute on `<html>` (`data-theme="dark"` / `data-theme="light"`).

## Component Library (foundational set)

Initial exports from `@wright/ui` — 13 components, kept deliberately small:

`Button`, `Input`, `FormField`, `Select`, `Checkbox`, `Card`, `Badge`, `Table`, `Tabs`, `Modal`, `Toast`, `AppShell`, `PageHeader`

AppShell and PageHeader are the layout primitives; they earn their place because every app needs them.

**Not in the initial kit** (build app-local first, promote later if reused 2+ times):

`RightPanel`, `Drawer`, `SeverityBadge`, `StatusBadge`, `Pagination`, `Toolbar`, `EmptyState`, `Spinner`, `Textarea`, `Toggle`, `Link`.

Promotion rule lives in the `homelab-web-component-add` skill.

## Page Recipes (the grammar layer)

Recipes are fully working pages in `templates/app/src/routes/`, *not* exported as components. They are the canonical "shape of a page" that agents copy and adapt.

Initial recipe set:

1. **Dashboard index** — stat cards + recent activity, full SSR+CSR.
2. **Table / list page** — paginated table, server-loaded, with filter bar; `csr = false` if no row interactivity needed.
3. **Detail page** — record view with metadata + actions.
4. **Form / edit page** — Superforms + Zod, with progressive enhancement.
5. **Mobile triage queue** — card-list optimized for thumb navigation; the scan-router use case.
6. **Settings page** — sectioned form with multiple Superforms.
7. **Async job / status page** — polling or SSE for in-flight work.

Each recipe demonstrates: the right render mode, mobile layout at 375px, loading states, error states, empty states, and (where applicable) server-side calls to a Python backend.

## Template App (the source of truth)

`templates/app/` is a **real, runnable SvelteKit app** that embodies every convention. Documentation explains *what* the template embodies; the template itself is the spec.

The template demonstrates:
- The seven page recipes above
- AppShell + PageHeader usage
- Theme application (dark default, with a toggle to prove the system)
- Mobile-first layout at 375px
- Form actions with Superforms + Zod
- A "simple form action without Superforms" escape hatch for tiny pages
- A server-side fetch to a stub Python backend (illustrates the backend bridge)
- Stub auth (session cookie, redirect helpers — see §"Auth Stub")
- View Transitions in the root `+layout.svelte`
- One opt-in PWA configuration commented out, ready to enable

## Skills

In-repo source at `web-ui/skills/`. Symlinked to `~/.claude/skills/` (or wherever the harness expects).

### `homelab-web-ui` (primary)

Teaches agents:
- How to scaffold a new app. Vertical-slice form is a local invocation against `packages/create-app` (exact command pinned in implementation). `bun create @wright/app <name>` becomes the polished/public form once distribution is resolved.
- The **render-mode decision** — when to use default, `csr = false`, or `prerender`.
- The **page recipe map** — match the page being built to the closest recipe; copy and adapt.
- **Mobile-first checklist** — 375px first, ≥44px tap targets, View Transitions enabled, no hover-only affordances.
- Theme conventions (which token to reach for; never inline hex).
- AppShell + PageHeader layout pattern.

### `homelab-web-backend-bridge` (helper)

Teaches agents:
- Pattern for SvelteKit ↔ Python FastAPI.
- Typed responses (OpenAPI codegen optional; hand-typed Zod schemas acceptable).
- Shared error envelope shape.
- Server-side fetch from `load`/actions (avoid CORS).
- Auth header / session cookie passing.

### `homelab-web-component-add` (helper)

Teaches agents:
- The **earn-its-place rule**: build app-local first; if reused in 2+ apps, PR to `@wright/ui`.
- Where new components go in `web-ui/packages/ui/`.
- How to add a recipe vs. a component (recipe if it's page-shaped; component if it's reusable widget-shaped).

## Mobile / PWA

### Mobile-first defaults

- Components designed at 375px first, expand up.
- Tap targets ≥44px.
- Containers wrap; no horizontal scroll on phone.
- No hover-only controls — every hover affordance has a tap equivalent.
- View Transitions enabled in `templates/app/src/routes/+layout.svelte`.

### PWA decision rule

Enable PWA only when **at least one** of:
- Repeated mobile use (you'd visit weekly+ from a phone)
- Offline tolerance is valuable
- Home-screen value (acts like an installed app)
- Camera / upload workflows that benefit from PWA APIs

scan-router → yes. paperless-enricher → maybe. sentinel admin → no.

## Auth Stub (intentionally thin)

The kit ships **conventions, not infrastructure**:
- Session cookie shape (name, format expectation)
- `requireSession()` helper for `+page.server.ts` / `+layout.server.ts`
- Redirect helpers (`redirectToLogin`, `redirectAfterLogin`)
- Layout convention for login pages

The kit does **not** ship:
- Password hashing
- OAuth flows
- Session storage
- Real identity provider integration

When real auth is needed, it comes from the homepage/SSO project. The stub gives apps a consistent shape to slot into that project later.

## Quality Gate

Every component admitted to `@wright/ui` must have:

1. A mobile example rendered at 375px (in docs or template).
2. Keyboard navigation checked (Tab, Shift+Tab, Enter, Escape where applicable).
3. Visible focus states using `--focus` token.
4. Tap targets ≥44px (where interactive).
5. No hover-only controls.
6. Light and dark theme screenshots.
7. Smoke-tested in the template app (route exists, renders, doesn't error).

The gate is enforced by a brief checklist in PR template; not by elaborate automation initially.

## Backend Integration Pattern

| App type | Pattern |
|---|---|
| Trivial CRUD, no integrations | SvelteKit-only (`+page.server.ts` + form actions) |
| Custom logic, no ML/OCR | SvelteKit + Bun/Hono service |
| ML, OCR, Paperless, scanners, etc. | SvelteKit + FastAPI; SvelteKit calls FastAPI server-side |

Python services are not internet-exposed. SvelteKit is the public surface.

## Rollout

Order is "when convenient" — not a deadline.

1. **`web-ui` itself** — kit, template, primary skill. Validated by a throwaway proof app.
2. **scan-router** — small surface, big mobile payoff (phone triage). First real test of `csr = false` recipes.
3. **paperless-enricher** — larger UI; FastAPI backend stays, SvelteKit replaces Jinja. Tests dark dashboard layout.
4. **higgins/trust-console** — already Svelte 5 + Vite + Hono → modest refactor to SvelteKit.
5. **sentinel/dashboard** — biggest surface, do last after the kit has absorbed lessons from the others.

Each migration likely promotes 1–3 components from app-local to `@wright/ui`.

## Implementation Shape (vertical slice)

The first implementation slice is intentionally small:

1. `packages/ui` with semantic tokens, `styles.css`, Tailwind preset, and the 13 foundational components.
2. `templates/app` using those components in the 7 page recipes.
3. `packages/create-app` that copies the template and wires the workspace dependency.
4. `homelab-web-ui` skill explaining render modes and page-recipe mapping.
5. A **throwaway proof app** built using only the scaffolder + skill, to validate end-to-end.

`homelab-web-backend-bridge` and `homelab-web-component-add` skills come second, after the throwaway app shakes out the real patterns.

## Resolved Open Questions

- **CSS approach:** Both `@wright/ui/styles.css` (canonical) and a Tailwind preset (ergonomic). Tailwind is never required.
- **Forms:** Superforms + Zod default; a "simple form action without Superforms" escape hatch documented for tiny pages.
- **Charts:** Per-app for now. Add chart-adjacent tokens (axis colors, grid colors) and layout guidance only. Bless a library only when Sentinel forces real requirements.
- **Skill distribution:** In-repo, symlinked to `~/.claude/`. Promote to a plugin only after the workflow stabilizes.
- **Icon library:** `@lucide/svelte` (the Svelte 5-native package, not `lucide-svelte`). Large set, tree-shakable, ISC. **Explicitly avoid `lucide-svelte`** — that package (through v0.460+) still uses Svelte 4's `SvelteComponentTyped` class shape, which does not structurally match Svelte 5's `Component<...>` type and produces opaque mismatches when passed through typed props (e.g. `NavSection[]`). Icons are passed by component reference, not re-exported from `@wright/ui` — the kit just types the shape (`NavIcon`).
- **Theme switcher:** App-local for now. The kit supports both themes via `[data-theme]` attribute; a shared `<ThemeSwitcher>` component is deferred until two apps need one.
- **Font hosting:** No remote Google Fonts import from the shared kit. `@wright/ui/styles.css` must not quietly depend on a third-party font request. Two acceptable patterns: (1) the kit ships self-hosted IBM Plex assets and exposes a static path apps can serve; (2) apps provide their own fonts and the kit only references the `--font-sans` / `--font-mono` / `--font-display` tokens. Pick (1) before the template app becomes canonical so consumers don't each re-solve this.

## Remaining Open Questions

- **Forgejo npm registry vs. workspace-only distribution.** Workspace-only is the default. Registry setup is deferred until a consumer lives outside `~/Projects/` or workspace friction appears.

## Success Criteria

We will know this design is working when:

**Early proof (end of vertical slice):**
- A throwaway app can be scaffolded via the vertical-slice scaffolder command, runs, and passes the mobile smoke check (375px, ≥44px tap targets, visible focus states, no hover-only controls).

**Mature (after rollout):**
- A new app's first usable UI takes <30 min of agent work end-to-end.
- A screenshot of a card in scan-router and a card in sentinel are visually indistinguishable.
- An app built with the kit passes the mobile-first checklist without manual polish.
- At least one component or recipe has been promoted from app-local to `@wright/ui` via the "earn-its-place" rule.

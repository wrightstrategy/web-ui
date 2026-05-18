# Changelog

All notable changes to `web-ui` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/).
Versioning follows [Semantic Versioning](https://semver.org/).

## Unreleased

### Added

- Explicit auth policy tiers in the template (`none` / `authenticated` / `authorized`). The new `templates/app/src/lib/server/auth-policy.ts` declares the app's tier; the root layout enforces it via `requireAuthorizedUser`. Default is `mode: 'authenticated'` so a fresh scaffold behaves like the post-cleanup state. Apps switch to `'none'` for internal-only or `'authorized'` with `allowedGroups` / `allowedUsers` / `allowedSubs` for app-specific authorization. See the spec at `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` § "Auth tiers (follow-up)".

### Breaking changes (auth)

- Stub cookie auth removed. `SESSION_COOKIE`, `Session`, `getSession`, `setSession`, `clearSession`, `requireSession`, `redirectToLogin`, and `redirectAfterLogin` are gone from `$lib/server/auth`.
- `/login` route is removed. Traefik + TinyAuth + Pocket ID handles login at the edge.
- New API: `requireUser(event)` / `getUser(event)`, both returning the typed `User` shape `{ sub, username, email, name, groups }`. The root `+layout.server.ts` enforces the app-local `authPolicy` (see the Added entry above) via `requireAuthorizedUser`; the default `mode: 'authenticated'` keeps the whole template app gated by default, equivalent to calling `requireUser` directly.
- `apiFetch` (as documented in the `homelab-web-backend-bridge` skill) no longer takes an `event` parameter or forwards a session cookie. Forward identity explicitly when a backend needs it: `headers: { 'X-Internal-User': user.sub }`.
- Deployment requires the `scrub-identity-headers` Traefik middleware chained ahead of `tinyauth-forward-auth` in every app's IngressRoute, plus a NetworkPolicy restricting Pod ingress to Traefik. See `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` for the trust-boundary details and the middleware YAML.
- Local dev: copy `templates/app/.env.example` to `.env.local` and set `WRIGHT_DEV_USER=<name>` (optionally `WRIGHT_DEV_GROUPS=<csv>`).

## [1.0.3] — 2026-05-17

### Fixed

- `AppShell` sidebar foot: 1.0.2 moved the version block above the user row but kept it inside `wf-foot`, so it still rendered _below_ the divider line. Promoted the version block to a direct child of `wf-sidebar` (sibling of `wf-foot`) so the `border-top` on `wf-foot` now sits between the version metadata and the user row, which is what the original report was asking for.
- CSS cleanup: removed `wf-foot.has-meta` and `wf-foot-row` rules (both unused once the version block moved out). The standalone `wf-version-block` picks up the typography (`12px / text-muted`) and horizontal padding (`20px`) that `wf-foot` used to provide.

## [1.0.2] — 2026-05-16

### Fixed

- `AppShell` sidebar foot: the version block (app name / version / `ui v<KIT_VERSION>`) rendered below the user row, where it read as an orphan trailing line outside the framed foot region. Swapped the render order so the version block sits above the user row, both inside the same bordered `wf-foot` block.

## [1.0.1] — 2026-05-16

### Fixed

- `AppShell` version display. v1.0.0 tagged with `"version": "0.0.0"` in both `packages/ui/package.json` and the workspace root, so the sidebar rendered `ui v0.0.0` for every consumer. v1.0.0 also predated the `meta` prop on `AppShell` (added in `f6b23c2`), so consumers pinned to v1.0.0 got no version block at all. Cut v1.0.1 at HEAD rather than force-moving the v1.0.0 tag — the v1.0.0..HEAD range also includes the mobile version strip and foot-only fixes that downstream apps need.

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

[1.0.3]: https://github.com/wrightstrategy/web-ui/releases/tag/v1.0.3
[1.0.2]: https://github.com/wrightstrategy/web-ui/releases/tag/v1.0.2
[1.0.1]: https://github.com/wrightstrategy/web-ui/releases/tag/v1.0.1
[1.0.0]: https://github.com/wrightstrategy/web-ui/releases/tag/v1.0.0

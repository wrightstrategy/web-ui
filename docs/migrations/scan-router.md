# Migration prompt — scan-router

Paste the section between `---` markers into a fresh agent session. It
is self-contained.

---

# Migrate scan-router's UI to `@wright/ui` (v1.0)

## Context

`scan-router` at `~/Projects/scan-router/` is a homelab app that watches a
network-share folder for new scans, OCRs each image, classifies them,
and routes them onward (Paperless, email, etc.). Its FastAPI + Jinja2
web UI was the first iteration — serviceable, but predates the shared
homelab UI kit at `~/Projects/web-ui/` (now at v1.0.0).

You are migrating the user-facing surface to the kit. The backend stays.

## What changes

- **The FastAPI backend is unchanged.** All OCR, mail, file-watcher, and
  routing logic stays as-is.
- **The Jinja templates and static assets are removed.** They go away
  wholesale in the final cleanup commit.
- **A new SvelteKit frontend** — scaffolded from `web-ui`'s
  `templates/app` — becomes the user-facing surface.
- **FastAPI becomes an internal service** that the SvelteKit app calls
  server-side via the `apiFetch` pattern in
  `homelab-web-backend-bridge`. No browser ever talks to FastAPI
  directly.

## Before you start

Read three things, in order:

1. **The strategy spec** at
   `~/Projects/web-ui/docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md`.
   Especially §"Pinned conventions" — every silent-failure mode the
   template flushed out is documented there. Read this before opening
   any file in scan-router.

2. **Invoke the `homelab-web-ui` skill.** It owns the scaffolder
   command, the recipe map, the render-mode decision tree, the
   mobile-first checklist, and the theme rules.

3. **Invoke the `homelab-web-backend-bridge` skill.** It owns the
   `apiFetch` wrapper, the Zod boundary, the error-envelope shape,
   and the server-side-only rule.

Also walk `~/Projects/scan-router/` to inventory the current state:
which routes exist, what data each renders, what the user flows are.
Pay attention to the FastAPI endpoints in `app/main.py` and the Jinja
templates in `app/templates/`.

## Scope

**In:**

- New SvelteKit frontend at `~/Projects/scan-router/web/` (or
  wherever fits the existing repo layout — make it discoverable, but
  don't fight the existing structure).
- Pydantic-typed JSON endpoints on FastAPI for everything the
  SvelteKit pages need. Mirror each one with a Zod schema in the
  SvelteKit `apiFetch` caller.
- A **mobile-first triage flow** — scan-router is the natural home
  for the kit's `/triage` recipe. Daily use is "phone on couch, swipe
  through new scans."
- Visual parity with the rest of the homelab: Wright UI dark default,
  brick accent, IBM Plex.

**Out:**

- Changing OCR / classification / routing logic.
- Custom auth. The kit consumes the homelab's Traefik + TinyAuth +
  Pocket ID infrastructure via `event.locals.user`; scan-router
  inherits this automatically. No app-level auth code to write.
- An in-flight migration tool. scan-router is single-user; the old UI
  can be replaced wholesale.

## Constraints

- **No browser-to-FastAPI calls.** SvelteKit `load`/actions are the
  only callers. CORS shouldn't appear anywhere in this work.
- **No-JS coherent fallback** for every page that doesn't strictly
  need interactivity. The scan list, individual detail views, and the settings page
  should be functional via `curl` (with Traefik forwarding the
  Remote-* headers). Use `export const csr = false` where it applies.
- **Mobile-first** for the triage flow especially. Tap targets ≥44px
  (52px for primary triage actions). Test at 375px first.
- **Pinned Vite + Superforms conventions are non-negotiable.** They
  arrive in the scaffold; don't tweak them away. Specifically:
  `resolve.dedupe: ['svelte']`, `optimizeDeps.include:
  ['sveltekit-superforms', 'sveltekit-superforms/client']`,
  `ssr.noExternal: ['sveltekit-superforms']`, and `novalidate` on
  every Superforms-bound form. The strategy spec explains why each
  one matters.
- **Don't promote anything to `@wright/ui` during this migration.**
  Build app-local. The `homelab-web-component-add` skill's
  earn-its-place rule applies — kit additions need 2-app reuse plus
  a generic prop API. If you find yourself wanting to promote
  something, surface it instead.

## Suggested first steps

1. From `~/Projects/web-ui/`, run
   `bun run create-app ~/Projects/scan-router/web`. The scaffold drops
   you a complete SvelteKit app with all six recipes pre-built —
   start from there.

2. Read `app/main.py` and `app/templates/*.html.j2` in scan-router.
   Map each Jinja page to one of the six recipes:

   | scan-router today | Kit recipe |
   |---|---|
   | Scan list (`/`) | `/queue` (`csr = false`, GET filter form) |
   | Scan detail / re-enrich | `/queue/[id]/edit` (Superforms + Zod) |
   | Mobile triage of new scans | `/triage` (one-card-at-a-time) |
   | Settings (recipients, rules) | `/settings` (multi-form) |
   | In-flight OCR / re-enrich status | `/operations/[id]` (polling) |

3. Add typed JSON endpoints to FastAPI for the data the SvelteKit pages
   need. Use Pydantic; mirror each in Zod via `apiFetch`. The
   error-envelope shape (`{ code, message, detail? }`) is in the
   backend-bridge skill — conform to it on every endpoint.

4. Wire `src/lib/server/api.ts` per the backend-bridge skill. Point
   `API_BASE` at FastAPI's internal address.

5. **Migrate one page at a time.** Start with the scan list (mapped to
   `/queue`) — it's the most-used view, has the clearest data shape,
   and is the most representative of what the migration buys.

6. **Keep the Jinja routes live in parallel** until each new SvelteKit
   page is verified end-to-end. Then remove the old templates in a
   single cleanup commit at the end.

## Definition of done

- The SvelteKit UI replaces the Jinja UI completely.
- Every existing user flow has a SvelteKit equivalent.
- Mobile triage flow exists, is usable on a phone, and passes the
  kit's mobile-first checklist.
- `bun run check` clean (modulo the four known Superforms warnings
  documented in the kit's CHANGELOG).
- `bun run build` succeeds.
- `~/Projects/scan-router/README.md` updated to reflect the new
  two-tier architecture (FastAPI internal + SvelteKit public face).
- Old Jinja templates, `/static` assets, and Jinja route handlers
  removed.

## When to stop and ask

- If a needed component doesn't exist in `@wright/ui` and the gap is
  fundamental (not just styling). Surface the question rather than
  jamming in an app-local hack — that conversation often reveals
  whether a recipe variant covers the need.
- If a FastAPI endpoint shape is awkward enough that the Zod boundary
  would constantly drift. That's a sign the backend wants a small
  reshape too.
- If a page genuinely doesn't fit any recipe. Describe the shape; we
  decide together whether it's a recipe variant or a new recipe shape
  worth pinning into the kit's HANDOFF.

---

*Reference: this prompt corresponds to `web-ui` v1.0.0
(commit recorded under `v1.0.0` tag in the web-ui repo).*

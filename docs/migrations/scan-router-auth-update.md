# scan-router — auth update migration prompt

**Date:** 2026-05-16
**Companion to:** [`scan-router.md`](scan-router.md) (the original scaffold-from-template migration).

This document is a hand-off prompt for an agent (Claude Code or similar)
running in `~/Projects/scan-router/web`. The scan-router app was
scaffolded from `@wright/ui` before two related auth updates landed in
the kit, and needs to catch up.

**What's changed since scan-router was scaffolded:**

1. **Auth cleanup** (commits up to `e13d6d7` on web-ui `main`) — replaces
   stub cookie auth with Traefik-forwarded `Remote-*` headers. Spec at
   [`docs/superpowers/specs/2026-05-15-auth-cleanup-design.md`](../superpowers/specs/2026-05-15-auth-cleanup-design.md).
2. **Auth tiers follow-up** (commits up to `ffaebb1`) — adds explicit
   policy tiers (`'none'` / `'authenticated'` / `'authorized'`) in an
   app-local `src/lib/server/auth-policy.ts`. Same spec file, §
   "Auth tiers (follow-up — 2026-05-16)".

**Rollout gate:** scan-router must not run in production with the new
auth code until homelab Forgejo issue
[#645](https://git.txsww.com/scott/homelab/issues/645)
(`scrub-identity-headers` Traefik middleware) is closed and the
middleware is live in scan-router's IngressRoute. Local dev works
regardless because the dev fallback uses `WRIGHT_DEV_USER`.

---

## The prompt

Paste the block below into a fresh Claude Code session running in
`~/Projects/scan-router/web` (or wherever scan-router's SvelteKit app
lives). The agent must have read access to `~/Projects/web-ui/` —
that's where the canonical template files live. If the receiving
session is sandboxed and can't read web-ui, replace the
`Source: ~/Projects/web-ui/...` pointers with the actual file contents
pasted inline.

```
This SvelteKit app was scaffolded from @wright/ui before two related
template updates landed. Update it to match the current template.

What landed in the kit:

1. Auth cleanup (commits up to e13d6d7 in ~/Projects/web-ui main):
   replaces stub cookie auth with Traefik-forwarded Remote-* headers.
   Spec: ~/Projects/web-ui/docs/superpowers/specs/2026-05-15-auth-cleanup-design.md
   Skill: ~/Projects/web-ui/skills/homelab-web-ui/SKILL.md § "Auth via Traefik"

2. Auth tiers follow-up (commits up to ffaebb1): adds explicit
   policy tiers ('none' / 'authenticated' / 'authorized') in an
   app-local src/lib/server/auth-policy.ts.
   Spec section: same spec file, § "Auth tiers (follow-up — 2026-05-16)"
   Skill subsection: same skill file, § "Choose an auth tier"

Read both spec sections and the skill section before touching code.
They have the canonical API shapes, code samples, and trust-boundary
discussion. Don't re-derive — copy the template's current state.

DEPLOYMENT GATE: this app must not run in production with the new
auth code until homelab Forgejo issue #645 (scrub-identity-headers
Traefik middleware) is closed and the middleware is live in the app's
IngressRoute. Confirm before deploying. Local dev works regardless
because the dev fallback uses WRIGHT_DEV_USER.

EXPECTED STATE OF THIS APP (verify by reading the files; this is
what I think is here, but check):

  - src/lib/server/auth.ts has stub cookie helpers: SESSION_COOKIE,
    getSession/setSession/clearSession, requireSession,
    redirectToLogin, redirectAfterLogin.
  - src/routes/login/ exists with +page.server.ts (signin/logout
    actions) and +page.svelte (login form).
  - src/routes/+layout.svelte has a foot snippet with hard-coded
    identity text and a LogIn icon import + /login nav item.
  - src/routes/+layout.server.ts may not exist; if it does, it
    probably doesn't gate anything.
  - src/lib/server/api.ts (if present) has an apiFetch wrapper that
    takes an `event` parameter and forwards the SESSION_COOKIE.
  - +page.server.ts files in routes call requireSession(event).
  - No hooks.server.ts, no app.d.ts Locals typing, no auth-policy.ts,
    no .env.example.

CHANGES TO MAKE:

1. Rewrite src/lib/server/auth.ts wholesale. Source of truth: the
   template's auth.ts at ~/Projects/web-ui/templates/app/src/lib/server/auth.ts.
   Copy it verbatim. It exports: User type, getUser, requireUser,
   AuthMode, AuthPolicy, authorizeUser, requireAuthorizedUser.

2. Create src/hooks.server.ts. Source: ~/Projects/web-ui/templates/app/src/hooks.server.ts.
   Copy verbatim. Reads Remote-* headers + WRIGHT_DEV_USER dev fallback
   into event.locals.user.

3. Update src/app.d.ts to type App.Locals.user. Source:
   ~/Projects/web-ui/templates/app/src/app.d.ts. Merge with any
   existing app-specific Locals fields scan-router has.

4. Create src/lib/server/auth-policy.ts. Source:
   ~/Projects/web-ui/templates/app/src/lib/server/auth-policy.ts.
   The template ships mode: 'authenticated' as the default. ASK ME
   which tier scan-router should use before committing — see the
   "Tier decision" section below.

5. Create src/routes/+layout.server.ts (or modify if it exists).
   Source: ~/Projects/web-ui/templates/app/src/routes/+layout.server.ts.
   Verbatim: calls requireAuthorizedUser(event, authPolicy), returns
   { user, authMode }.

6. Update src/routes/+layout.svelte:
   - Drop the LogIn icon import.
   - Drop any /login nav item.
   - Extend $props() destructure to include `data`.
   - Replace the foot's hard-coded identity with the {#if data.user}
     guard block. Source: ~/Projects/web-ui/templates/app/src/routes/+layout.svelte
     (the foot snippet section). Adapt the hard-coded "Scott /
     wrightfamily.org" pattern to the data.user.name/email pattern.

7. Delete src/routes/login/ entirely (+page.server.ts and +page.svelte).

8. Create .env.example. Source: ~/Projects/web-ui/templates/app/.env.example.
   Copy verbatim. Also create a local .env.local with WRIGHT_DEV_USER=scott
   for development (this file is gitignored).

9. Update any +page.server.ts load functions in scan-router that
   currently call requireSession(event). Replace with requireUser(event)
   (or omit entirely if the root layout's requireAuthorizedUser is
   sufficient gating — usually it is for homelab apps). DO NOT call
   requireAuthorizedUser per-page unless you want per-page policy.

10. If src/lib/server/api.ts exists, update the apiFetch wrapper:
    - Remove the `event?: { cookies: Cookies }` field from ApiOptions.
    - Remove the `import { error, type Cookies } from '@sveltejs/kit'`'s
      `type Cookies` import.
    - Remove the `import { SESSION_COOKIE } from './auth'` line.
    - Remove the `if (init.event)` cookie-forwarding block.
    - Keep the Zod schema parameter (apiFetch<T>(path, schema, init))
      and schema.parse() boundary. Keep timeout/retry/error-envelope.
    Pattern source: ~/Projects/web-ui/skills/homelab-web-backend-bridge/SKILL.md.
    Call sites in scan-router that passed `{ event }` to apiFetch
    need that option removed. If a backend call needs identity
    (audit logging), forward an explicit header:
    headers: { 'X-Internal-User': user.sub }.

TIER DECISION:

  scan-router is a single-user homelab app. Three reasonable choices:

  (a) mode: 'authenticated' (default) — any Pocket ID user gets in.
      Fine if scan-router is family-shared and you trust everyone
      with a Pocket ID account.

  (b) mode: 'authorized' with allowedUsers: ['scott'] — only scott
      gets in. Right choice if only scott should triage / re-enrich
      scans.

  (c) mode: 'authorized' with allowedGroups: ['admins'] — admins
      group access. Right choice if you've defined an admins group
      in Pocket ID and scan-router should follow that.

  Ask me which one before writing auth-policy.ts.

VERIFY AFTER EACH BATCH OF CHANGES:

  - `bun run check` from the app root: 0 errors (warnings from
    pre-existing Superforms patterns are fine).
  - `bun run build`: succeeds cleanly.
  - Local dev probe:
      WRIGHT_DEV_USER=scott bun run dev
      curl -s http://localhost:5173/ | grep -oE 'scott'  # should match
      curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/  # 200
  - 401 probe:
      WRIGHT_DEV_USER= bun run preview
      curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/  # 401
  - If you picked 'authorized' with allowedUsers: ['scott'], also probe:
      curl with Remote-Sub + Remote-User: alice  → 403
      curl with Remote-Sub + Remote-User: scott  → 200

COMMIT DISCIPLINE:

  One commit per logical change. Suggested sequence:
    1. feat(auth): adopt @wright/ui ForwardAuth model
       (auth.ts + app.d.ts + hooks.server.ts in one commit since
       they're a coordinated type spine)
    2. feat(auth): add app-local auth-policy.ts (tier: <chosen>)
    3. feat(auth): gate the app via requireAuthorizedUser in root layout
    4. feat(layout): foot reads data.user with null guard; drop /login
    5. feat(auth): delete /login route
    6. chore: add .env.example + .env.local
    7. refactor(api): drop cookie forwarding from apiFetch
    8. refactor(routes): replace requireSession with requireUser
    9. docs: note auth migration in scan-router's own changelog/README

  Skip commits for files that don't apply (e.g. if scan-router has
  no api.ts, skip step 7).

WHEN YOU'RE DONE:

  - Run the final verify suite above.
  - Confirm git status is clean.
  - Tell me the final commit SHA and the chosen tier.
  - Remind me about the homelab issue #645 rollout gate before I deploy.
```

---

## Notes

- **Tier choice is the only real decision** the receiving agent should
  ask about. Everything else is mechanical copy-from-template.
- **If scan-router has `requireSession` call sites** in `+page.server.ts`
  files, the agent will grep for them and update each per step 9.
- **If scan-router doesn't have an `api.ts`**, skip step 10 entirely —
  the `apiFetch` wrapper is a pattern documented in the backend-bridge
  skill, not a file that ships in every scaffolded app.
- **If the receiving session can't read `~/Projects/web-ui/`**, swap
  every `Source: ~/Projects/web-ui/...` line for the actual file content
  pasted inline. The canonical files are small (auth.ts ~75 lines,
  hooks.server.ts ~40 lines, +layout.server.ts ~18 lines, etc.).

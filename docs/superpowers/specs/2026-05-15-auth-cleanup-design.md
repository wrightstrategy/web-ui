# Auth cleanup — design

**Date:** 2026-05-15
**Status:** Approved, ready for implementation plan
**Scope:** `templates/app/`, `skills/homelab-web-ui`, `skills/homelab-web-backend-bridge`, `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md`, `docs/migrations/scan-router.md`, `CHANGELOG.md`. Plus a separate **homelab repo issue** for the Traefik Headers middleware.

> **Superseded in part by the Auth tiers follow-up** at the bottom of this file (§ "Auth tiers (follow-up — 2026-05-16)"). Several details below describe the *original* auth-cleanup shipped state — specifically: the root layout calls `requireUser`, the `+layout.server.ts` return is `{ user }`, and the AppShell foot assumes `data.user` is non-null. The follow-up changes those: the layout now calls `requireAuthorizedUser(event, authPolicy)`, the return adds `authMode`, and the foot guards on `{#if data.user}`. Read the follow-up section first for the current state.

## Problem

The template ships stub cookie auth (`templates/app/src/lib/server/auth.ts`) that accepts any non-empty username/password pair. A comment at the top of the file says the stub exists "until the homepage/SSO project lands." That project has landed: every homelab app sits behind Traefik → TinyAuth → Pocket ID (OIDC). TinyAuth emits `Remote-Sub`, `Remote-User`, `Remote-Email`, `Remote-Name`, `Remote-Groups` to the backend per `k8s/infrastructure/traefik/middleware-tinyauth.yaml` in the homelab repo.

The kit is now carrying two auth stories: a placeholder one in the code, and the real one at the edge. The cleanup removes the placeholder and teaches the kit to consume the real one.

## Goals

- Delete the cookie session, the `/login` route, and every related helper.
- Read TinyAuth's `Remote-*` headers in `hooks.server.ts` and expose the identity as `event.locals.user`.
- Gate the whole template app by default via `requireUser()` in the root layout load.
- Surface the real user in the AppShell foot (replacing the hard-coded "Scott / wrightfamily.org").
- Update consumer-facing docs (both skills, strategy spec, scan-router migration doc, CHANGELOG).
- File a homelab issue requesting the Traefik Headers middleware that scrubs client-supplied `Remote-*` before ForwardAuth runs.

## Non-goals (v1)

- A logout button or "Sign out" link. Pocket ID/TinyAuth manage the session; if a future PR wants a logout affordance pointing at TinyAuth's logout endpoint, it can earn its place then.
- A "you've been signed out" landing page.
- An `apiFetch.withIdentity(user)` helper. If three apps end up writing the same `'X-Internal-User': user.sub` block, that's when it earns its place.
- Any change to the homelab repo's manifests *from this PR*. The web-ui side is what ships here; the homelab side ships via an issue filed against `~/Projects/homelab/`.
- Adding tests or a test runner for the auth path. This kit has no Svelte component test runner today (out of scope per the AppShell version display spec); verification is `bun run check` + `bun run build` + dev-server inspection.

## Trust boundary (the two enforceable invariants)

The kit trusts the `Remote-*` headers reaching `hooks.server.ts` unconditionally — no HMAC, no signed token. That trust rests on two deployment invariants that **must be enforced in the homelab manifests**, not assumed:

### Invariant 1 — NetworkPolicy restricts Pod ingress to Traefik

Each app's namespace has a `NetworkPolicy` that permits ingress to the app Pod only from the Traefik Pods (matched by namespace + ServiceAccount or by Pod label). Without this, any compromised neighbor in the cluster could send a forged request with crafted `Remote-*` headers directly to the SvelteKit Service.

### Invariant 2 — Traefik scrubs client-supplied `Remote-*` headers before ForwardAuth runs

Traefik's `authResponseHeaders` configuration tells it which headers from TinyAuth's auth response to set on the forwarded request, "replacing conflicting headers." That works for headers TinyAuth actually returns — but if TinyAuth's response omits an optional header (e.g. `Remote-Groups` for a user with no groups), Traefik will pass through a client-supplied value for that header. That's a spoofing vector for optional fields.

The fix is an explicit Headers middleware chained ahead of `tinyauth-forward-auth` in every app's `IngressRoute`. The Headers middleware sets `customRequestHeaders` to empty string for each of the five `Remote-*` headers, which Traefik treats as "delete this header from the inbound request." ForwardAuth then adds back the trusted values via `authResponseHeaders`.

Required middleware (to be filed against the homelab repo):

```yaml
# k8s/infrastructure/traefik/middleware-scrub-identity.yaml
apiVersion: traefik.io/v1alpha1
kind: Middleware
metadata:
  name: scrub-identity-headers
  namespace: traefik
spec:
  headers:
    customRequestHeaders:
      Remote-Sub: ""
      Remote-User: ""
      Remote-Email: ""
      Remote-Name: ""
      Remote-Groups: ""
```

Required IngressRoute middleware order for every app behind TinyAuth:

```yaml
middlewares:
  - name: scrub-identity-headers
    namespace: traefik
  - name: tinyauth-forward-auth
    namespace: traefik
```

References:
- [Traefik ForwardAuth `authResponseHeaders`](https://doc.traefik.io/traefik/v2.4/middlewares/forwardauth/)
- [Traefik Headers `customRequestHeaders`](https://doc.traefik.io/traefik/master/reference/routing-configuration/http/middlewares/headers/)

### If either invariant cannot be enforced

If a deployment context can't guarantee both (e.g. a future "share an app outside the cluster" path), the kit grows an HMAC-signed identity header forwarded by TinyAuth and verified in `hooks.server.ts`. That's strictly more code; not worth shipping until the constraint changes.

### Rollout gate

The web-ui commits for this cleanup may be authored at any time, but consuming apps **must not pull this version of `@wright/ui`** until the homelab side is rolled out: the `scrub-identity-headers` middleware exists in the cluster and every IngressRoute in front of a SvelteKit consumer has been updated to chain it ahead of `tinyauth-forward-auth`. The implementation plan will include a "verify homelab issue closed and rolled out" step before any consumer-facing tagged release.

## File-level changes (web-ui repo)

| Path | Action |
|---|---|
| `templates/app/src/hooks.server.ts` | **Create**. Reads `Remote-*` headers → `event.locals.user`. Honors `WRIGHT_DEV_USER` in dev only. |
| `templates/app/src/app.d.ts` | **Modify**. Add `user: User \| null` to the existing (empty) `App.Locals` interface. |
| `templates/app/src/lib/server/auth.ts` | **Rewrite**. Exports `User` type, `getUser()`, `requireUser()`. Deletes cookie machinery (`SESSION_COOKIE`, `Session`, `getSession`, `setSession`, `clearSession`, `requireSession`, `redirectToLogin`, `redirectAfterLogin`). |
| `templates/app/src/routes/+layout.server.ts` | **Create**. Returns `{ user: requireUser(event) }` — gates the whole app by default. |
| `templates/app/src/routes/+layout.svelte` | **Modify**. Foot snippet reads `data.user.name \|\| data.user.username` and `data.user.email \|\| data.user.username`. Drop `LogIn` icon import and the `/login` nav item from the "System" section. |
| `templates/app/src/routes/login/+page.server.ts` | **Delete**. |
| `templates/app/src/routes/login/+page.svelte` | **Delete**. (Directory becomes empty and is removed.) |
| `templates/app/.env.example` | **Create**. Documents `WRIGHT_DEV_USER` and `WRIGHT_DEV_GROUPS`. |
| `skills/homelab-web-ui/SKILL.md` | **Modify**. Delete the `/login` recipe map row (recipe count 7 → 6). Drop "the login screen" from the `csr=false` examples. Delete the "Login is the canonical 'tiny form' escape hatch" bullet. Add a new "Auth via Traefik" subsection. |
| `skills/homelab-web-backend-bridge/SKILL.md` | **Modify**. Rewrite the auth/cookie-forwarding section (see §"Backend-bridge changes"). Update frontmatter description to drop "session-cookie forwarding." Change `requireSession` example to `requireUser`. |
| `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md` | **Modify**. Replace stub-auth references across the template-demonstrates list, backend-bridge summary, and the full `Auth Stub` section with the Traefik+TinyAuth+Pocket ID posture. |
| `docs/migrations/scan-router.md` | **Modify**. Replace stale stub-auth wording, drop login from the no-JS curl examples, and update "seven recipes" references to "six recipes." |
| `CHANGELOG.md` | **Modify**. New entry under "Breaking changes." |

## The `User` type and helpers

```ts
// templates/app/src/lib/server/auth.ts
import { error, type RequestEvent } from '@sveltejs/kit';

export type User = {
  /** OIDC stable subject ID (Remote-Sub). Use for foreign keys / audit. */
  sub: string;
  /** Pocket ID preferred_username (Remote-User). Login handle. */
  username: string;
  /** Remote-Email. Empty string if Pocket ID has no email for this user. */
  email: string;
  /** Remote-Name display name. Falls back to username if absent. */
  name: string;
  /** Remote-Groups, comma-split and trimmed. Empty array if none. */
  groups: string[];
};

export function getUser(event: RequestEvent): User | null {
  return event.locals.user;
}

export function requireUser(event: RequestEvent): User {
  if (!event.locals.user) error(401, 'Unauthorized');
  return event.locals.user;
}
```

`requireUser` throws 401 (not 302) because in prod Traefik intercepts unauthenticated requests *before* they reach SvelteKit, so a 401 from SvelteKit means something is genuinely wrong: a misconfigured deployment, a dev who forgot `WRIGHT_DEV_USER`, or — under invariants 1 & 2 — an actual bypass attempt.

## The hook (single source of truth)

```ts
// templates/app/src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import type { User } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.user = readUser(event.request);
  return resolve(event);
};

function readUser(request: Request): User | null {
  const sub = request.headers.get('Remote-Sub')?.trim();
  const username = request.headers.get('Remote-User')?.trim();
  if (sub && username) {
    return {
      sub,
      username,
      email: request.headers.get('Remote-Email')?.trim() ?? '',
      name: request.headers.get('Remote-Name')?.trim() || username,
      groups: parseGroups(request.headers.get('Remote-Groups')),
    };
  }
  if (dev && env.WRIGHT_DEV_USER) {
    const u = env.WRIGHT_DEV_USER;
    return {
      sub: `dev-${u}`,
      username: u,
      email: `${u}@dev.local`,
      name: u,
      groups: parseGroups(env.WRIGHT_DEV_GROUPS ?? null),
    };
  }
  return null;
}

function parseGroups(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}
```

Notes:

- Prod path requires *both* `Remote-Sub` and `Remote-User` to be non-empty post-trim. A request missing either is treated as no user — `requireUser` will 401 — rather than synthesizing a partial identity.
- The `name` fallback uses `||` (not `??`) so an empty-string `Remote-Name` falls back to `username`.
- Dev path only fires when `dev === true` (Vite's build-time flag — `false` in production builds, so the whole branch is dead code in prod). The `WRIGHT_DEV_USER` env var has no effect in prod even if it's set.
- `Remote-Groups` is comma-split and per-item trimmed; `"admins, family"` → `["admins", "family"]`.

## The root layout gates the app

```ts
// templates/app/src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { requireUser } from '$lib/server/auth';

export const load: LayoutServerLoad = (event) => {
  // Returns the full User including `groups`. Groups names are not
  // considered sensitive in this homelab context (values like
  // "admins" / "family") so we ship them to the client for use in
  // group-gated UI. If a future app needs to hide group names from
  // the browser, narrow this to { sub, username, email, name }.
  return { user: requireUser(event) };
};
```

`requireUser` here means the whole app is gated by default. A bypass attempt 401s on the first request rather than rendering a degraded UI. Routes that legitimately need optional access (rare in homelab) opt into `getUser(event)` from their own load.

## `App.Locals` typing

```ts
// templates/app/src/app.d.ts
import type { User } from '$lib/server/auth';

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: User | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
```

Modifies the existing file — the placeholder `interface Locals {}` becomes typed.

## AppShell foot in the template

The current `+layout.svelte` foot snippet hard-codes:

```svelte
<div class="wf-grow">
  <div style="font-size: 13px; color: var(--text);">Scott</div>
  <div class="mono" style="font-size: 11px; color: var(--text-subtle);">wrightfamily.org</div>
</div>
```

Becomes:

```svelte
<div class="wf-grow">
  <div style="font-size: 13px; color: var(--text);">
    {data.user.name || data.user.username}
  </div>
  <div class="mono" style="font-size: 11px; color: var(--text-subtle);">
    {data.user.email || data.user.username}
  </div>
</div>
```

`data.user` is non-null (root layout's `requireUser` throws otherwise), so no `?.` chain is needed. Per-field `||` covers the empty-string defensive case.

Also in `+layout.svelte`: drop the `LogIn` icon import and the `/login` nav item from the `System` section. The `System` section keeps `/settings` and goes from two items to one.

## Backend-bridge changes (doc-only)

`apiFetch` is **not** a shipped template file today — it's a pattern documented in `skills/homelab-web-backend-bridge/SKILL.md`. The cleanup updates that documented pattern; there is no `templates/app/src/lib/server/api.ts` to modify.

**New posture:** SvelteKit is the auth boundary. The backend trusts any call that reaches its socket (network-isolated under invariant 1, plus the backend is internal — never client-reachable). The documented `apiFetch` pattern loses its `event` parameter and forwards no identity headers automatically.

The skill's *before* and *after* code blocks (which apps copy when they add backend bridges):

```ts
// BEFORE (today's skill):
import { error, type Cookies } from '@sveltejs/kit';
import { SESSION_COOKIE } from './auth';

type ApiFetchOptions = {
  // ... timeouts, retries ...
  event?: { cookies: Cookies };
};

export async function apiFetch(path: string, init: ApiFetchOptions = {}) {
  const headers = new Headers(init.headers);
  if (init.event) {
    const session = init.event.cookies.get(SESSION_COOKIE);
    if (session) headers.set('cookie', `${SESSION_COOKIE}=${session}`);
  }
  // ... rest ...
}
```

```ts
// AFTER (new skill content):
import { error } from '@sveltejs/kit';

type ApiFetchOptions = {
  // ... timeouts, retries ...
  // No `event` field. No cookie forwarding.
};

export async function apiFetch(path: string, init: ApiFetchOptions = {}) {
  const headers = new Headers(init.headers);
  // ... rest, unchanged otherwise ...
}
```

When a backend genuinely needs user identity (audit log, per-user storage scope, group-based authorization that the backend itself enforces), the route handler in a consuming app forwards it explicitly:

```ts
const user = requireUser(event);
await apiFetch('/api/things', {
  method: 'POST',
  headers: { 'X-Internal-User': user.sub },
  body: JSON.stringify(payload),
});
```

`X-Internal-User` is a convention taught by the skill, not a kit constant. The backend treats it as audit metadata, not authorization input — authorization is enforced at the SvelteKit layer by `requireUser` + group checks.

## Dev environment hint

`templates/app/.env.example` (new file, committed):

```
# Local dev: when Traefik isn't in front, fake a user so requireUser()
# doesn't 401. Only honored when NODE_ENV !== 'production' (Vite's
# `dev` flag). The kit ships the value-shape; you choose the username.
WRIGHT_DEV_USER=scott

# Optional comma-separated groups to test group-gated UI in dev.
WRIGHT_DEV_GROUPS=admins,family
```

Developers copy `.env.example` → `.env.local` (SvelteKit's default Vite setup already gitignores `.env.local`).

## Skill updates

### `skills/homelab-web-ui/SKILL.md`

- **Recipe map (line 54)**: delete the Login row. The skill's intro paragraph and the skill `description` frontmatter both currently say "seven page recipes" — change both to "six page recipes."
- **csr=false bullet (line 67)**: remove "the login screen" from the examples list.
- **"Login is the canonical 'tiny form' escape hatch" bullet (line ~141)**: delete the whole bullet. Tiny forms outside of Superforms can still be documented elsewhere if needed, but the login example is gone.
- **New subsection "Auth via Traefik" under or near "Theme conventions"**:

  > ## Auth via Traefik
  >
  > Every homelab app runs behind Traefik → TinyAuth → Pocket ID. The kit reads `Remote-*` headers in `hooks.server.ts` and exposes the identity as `event.locals.user`. The template's root `+layout.server.ts` calls `requireUser(event)` so the whole app is gated by default.
  >
  > In a `+page.server.ts`:
  >
  > ```ts
  > import { error } from '@sveltejs/kit';
  > import { requireUser } from '$lib/server/auth';
  >
  > export const load = async (event) => {
  >   const user = requireUser(event);          // 401 if no identity
  >   if (!user.groups.includes('admins')) error(403);
  >   // ...
  > };
  > ```
  >
  > For optional access (rare), `getUser(event)` returns `User | null` — import it separately when needed.
  >
  > Local dev: set `WRIGHT_DEV_USER=<name>` in `.env.local`. The kit fakes a dev user only when `NODE_ENV !== 'production'`.
  >
  > Deployment invariants: NetworkPolicy must restrict ingress to Traefik, and Traefik must scrub client-supplied `Remote-*` headers before ForwardAuth. See the auth-cleanup spec for details.

### `skills/homelab-web-backend-bridge/SKILL.md`

- **Frontmatter description**: drop "session-cookie forwarding."
- **Auth section**: replace the cookie-forwarding text and code blocks with:

  > **Auth posture.** SvelteKit is the auth boundary — call `requireUser(event)` in the route handler. Backend services trust the SvelteKit-originated call (network-isolated; SvelteKit is the only client). They do not receive user identity by default.
  >
  > **When a backend needs identity** (audit logs, per-user storage), forward it explicitly:
  >
  > ```ts
  > import { requireUser } from '$lib/server/auth';
  > import { apiFetch } from '$lib/server/api';
  >
  > export const load = async (event) => {
  >   const user = requireUser(event);
  >   const data = await apiFetch('/api/things', {
  >     headers: { 'X-Internal-User': user.sub },
  >   });
  >   return { data };
  > };
  > ```
  >
  > `X-Internal-User` is a convention, not a kit constant. The backend treats it as audit metadata. Authorization is enforced at the SvelteKit layer.

- **Existing `requireSession(event)` example**: change to `const user = requireUser(event);`.
- **Existing references to `SESSION_COOKIE`, `import { SESSION_COOKIE } from './auth';`, and `headers.set('cookie', ...)`**: delete.

## Strategy spec update

`docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md` needs several coordinated edits, not just the line-248 reference. The current spec contains stub-auth scaffolding across three locations that all need to align:

### Edit 1 — Template-demonstrates list (around line 170)

Change:
```
- Stub auth (session cookie, redirect helpers — see §"Auth Stub")
```
to:
```
- Auth via Traefik + TinyAuth + Pocket ID (see §"Auth via Traefik")
```

### Edit 2 — `homelab-web-backend-bridge` skill summary bullet (around line 215)

Change:
```
- Auth header / session cookie passing.
```
to:
```
- Explicit identity forwarding (e.g. `X-Internal-User: user.sub`) when a backend needs identity. No automatic cookie/session forwarding — SvelteKit is the auth boundary.
```

### Edit 3 — Replace the entire `## Auth Stub (intentionally thin)` section (lines 244–258)

Delete the whole section (heading + body) and replace it with:

```markdown
## Auth via Traefik

The kit consumes the homelab's SSO infrastructure (Traefik → TinyAuth → Pocket ID OIDC) and ships **no** auth machinery of its own.

- `hooks.server.ts` reads TinyAuth's `Remote-Sub`, `Remote-User`, `Remote-Email`, `Remote-Name`, `Remote-Groups` headers and populates `event.locals.user` with a typed `User`.
- `requireUser(event)` and `getUser(event)` in `$lib/server/auth` are the only public helpers; both return the same `User` shape.
- The root `+layout.server.ts` calls `requireUser` so every page in an app is gated by default.
- Local dev: set `WRIGHT_DEV_USER` (and optionally `WRIGHT_DEV_GROUPS`) in `.env.local`. The dev fallback only fires when `dev === true`.

The kit does **not** ship: a login form, a logout button, a session cookie, an OAuth client, or any password handling. All of that lives in the homelab cluster (TinyAuth + Pocket ID).

Trust rests on two deployment invariants enforced in the homelab manifests: NetworkPolicy restricting Pod ingress to Traefik, and a Traefik Headers middleware that scrubs client-supplied `Remote-*` headers before ForwardAuth runs. See `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` for the full trust-boundary write-up and the required middleware YAML.
```

## Scan-router migration doc update

`docs/migrations/scan-router.md` has four stale references that all need to align with the post-cleanup world:

### Edit 1 — "Out" scope bullet (lines 75–76)

Change:
```
- Real auth. The kit's stub auth in `$lib/server/auth.ts` is enough
  for v1; SSO comes from the homepage project later.
```
to:
```
- Custom auth. The kit consumes the homelab's Traefik + TinyAuth +
  Pocket ID infrastructure via `event.locals.user`; scan-router
  inherits this automatically. No app-level auth code to write.
```

(The bullet stays in the "Out" list because the meaning is the same — scan-router doesn't roll its own auth — but the framing shifts from "stub for now, real later" to "real already, inherited from the kit.")

### Edit 2 — No-JS constraint bullet (lines 85–87)

Change:
```
  The scan list, individual detail views, and
  the login/settings pages should be functional via `curl`. Use
  `export const csr = false` where it applies.
```
to:
```
  The scan list, individual detail views, and the settings page
  should be functional via `curl` (with Traefik forwarding the
  Remote-* headers). Use `export const csr = false` where it applies.
```

### Edit 3 — Suggested first step #1 (lines 105–108)

Change:
```
1. From `~/Projects/web-ui/`, run
   `bun run create-app ~/Projects/scan-router/web`. The scaffold drops
   you a complete SvelteKit app with all seven recipes pre-built —
   start from there.
```
to:
```
1. From `~/Projects/web-ui/`, run
   `bun run create-app ~/Projects/scan-router/web`. The scaffold drops
   you a complete SvelteKit app with all six recipes pre-built —
   start from there.
```

### Edit 4 — Recipe-mapping intro line (line 111)

Change:
```
   Map each Jinja page to one of the seven recipes:
```
to:
```
   Map each Jinja page to one of the six recipes:
```

## CHANGELOG

New entry under the next-release section:

> **Breaking changes (auth)**
>
> - Stub cookie auth (`SESSION_COOKIE`, `getSession`/`setSession`/`clearSession`, `requireSession`, `redirectToLogin`, `redirectAfterLogin`) is removed.
> - `/login` route is removed. Traefik+TinyAuth+Pocket ID handles login at the edge.
> - New API: `requireUser(event)` / `getUser(event)`, returning the typed `User` shape `{ sub, username, email, name, groups }`. See `templates/app/src/lib/server/auth.ts`.
> - `apiFetch` no longer takes an `event` parameter or forwards a session cookie. Explicitly forward identity when needed (see `homelab-web-backend-bridge` skill).
> - Deployment requires the `scrub-identity-headers` Traefik middleware chained ahead of `tinyauth-forward-auth` in every app's IngressRoute, plus a NetworkPolicy restricting Pod ingress to Traefik.

## Homelab issue to file

Per `~/.claude/CLAUDE.md` ("Project Agents should not make changes in `~/Projects/homelab`; instead open an issue"), this PR includes a draft issue to file against the homelab repo. The issue body:

> **Title:** Scrub client-supplied `Remote-*` headers before ForwardAuth runs
>
> **Why:** Traefik's `authResponseHeaders` only replaces headers TinyAuth actually returns. Optional fields like `Remote-Email`, `Remote-Name`, or `Remote-Groups` can be spoofed by a client if TinyAuth's response omits them. Without an explicit scrub, a malicious request reaching Traefik could inject identity fields the auth provider didn't authorize.
>
> **What to add:**
>
> 1. New middleware `k8s/infrastructure/traefik/middleware-scrub-identity.yaml`:
>
>    ```yaml
>    apiVersion: traefik.io/v1alpha1
>    kind: Middleware
>    metadata:
>      name: scrub-identity-headers
>      namespace: traefik
>    spec:
>      headers:
>        customRequestHeaders:
>          Remote-Sub: ""
>          Remote-User: ""
>          Remote-Email: ""
>          Remote-Name: ""
>          Remote-Groups: ""
>    ```
>
> 2. Add `scrub-identity-headers` as the *first* middleware in every IngressRoute that also uses `tinyauth-forward-auth`. Order matters: scrub runs before ForwardAuth populates the trusted values.
>
> 3. Verify NetworkPolicy for every consuming app's namespace restricts Pod ingress to the Traefik namespace/ServiceAccount.
>
> **Gate:** The web-ui auth-cleanup commits will not be rolled out to consuming apps until this issue is closed and the middleware is live in every IngressRoute that fronts a SvelteKit app.
>
> **References:**
> - `web-ui` spec: `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md`
> - [Traefik Headers `customRequestHeaders`](https://doc.traefik.io/traefik/master/reference/routing-configuration/http/middlewares/headers/)

## Edge cases / behavior contract

- **Missing `Remote-Sub` or missing `Remote-User`**: treated as no identity. `requireUser` 401s. Catches partial Traefik misconfig.
- **Empty-string `Remote-Email`**: `email: ''` in the User. UI fallbacks (`||`) handle it.
- **Empty-string `Remote-Name`**: `name: username` (the `||` fallback in the hook).
- **`Remote-Groups: ""`** or absent: `groups: []`.
- **`Remote-Groups` with whitespace** (`"admins,  family ,  "`): parsed as `["admins", "family"]` — per-item trim, empty filtered.
- **`WRIGHT_DEV_USER` set in production**: ignored. The dev branch is gated on Vite's `dev` flag, which is `false` in `bun run build` output.
- **Both Traefik headers AND `WRIGHT_DEV_USER` present in dev**: Traefik headers win (the `if (sub && username)` branch comes first in `readUser`).

## Future follow-ups (deferred — do not implement)

- A `Sign out` link in the AppShell foot pointing at TinyAuth's logout endpoint.
- A dedicated "You've been signed out" landing page.
- An `apiFetch.withIdentity(user, options)` helper if `'X-Internal-User': user.sub` shows up in three or more apps.
- A second-level `requireGroup('admins')` helper if group-gated routes proliferate.
- An HMAC-signed identity header from TinyAuth — only if invariant 1 or 2 can no longer be guaranteed.
- Scaffolder support for substituting the template's hard-coded `'Template'` literal into the new app's display name (pre-existing concern flagged in the AppShell version-display review).

## Auth tiers (follow-up — 2026-05-16)

The original cleanup above implemented two things: (1) header-based trust of Traefik's forwarded identity, and (2) authentication enforcement via `requireUser` in the root layout. It did not give apps a way to declare app-specific *authorization* policy beyond "any authenticated user."

This follow-up adds an explicit policy layer with three tiers.

### Tiers

| Tier | When to use | Layout posture |
|---|---|---|
| `none` | Internal/low-risk app. Identity headers may still arrive from Traefik but the app does not require them. Missing identity renders normally. | `data.user` is `User \| null`; foot falls back to "Internal / No auth". |
| `authenticated` (default) | Any valid Pocket ID user may use the app. Same as the post-cleanup behavior. | `data.user` is always present after the load runs (load throws 401 otherwise). |
| `authorized` | Only explicitly allowed users / groups / subject IDs may use the app. | `data.user` is always present. Failed authz returns 403; missing identity returns 401. |

### API

```ts
// $lib/server/auth — appended to the existing User / getUser / requireUser.
export type AuthMode = 'none' | 'authenticated' | 'authorized';

export type AuthPolicy = {
  mode: AuthMode;
  allowedGroups?: string[];
  allowedUsers?: string[];
  allowedSubs?: string[];
};

export function authorizeUser(user: User | null, policy: AuthPolicy): User | null;
export function requireAuthorizedUser(event: RequestEvent, policy: AuthPolicy): User | null;
```

`authorizeUser` is the policy engine; `requireAuthorizedUser` is a thin convenience that reads `event.locals.user` and calls it. Both return `User | null` because `mode: 'none'` legitimately produces `null`.

### Behavior contract

- **`mode: 'none'`** — `authorizeUser(null, ...)` returns `null`; `authorizeUser(user, ...)` returns `user`. Never throws.
- **`mode: 'authenticated'`** — missing user throws 401. Any present user passes.
- **`mode: 'authorized'`** — missing user throws 401. With no allowlist arrays configured (all three empty/undefined), fail closed → 403. Otherwise user passes if `user.sub` is in `allowedSubs`, `user.username` is in `allowedUsers`, or any `user.groups` entry is in `allowedGroups`. Non-matching user → 403.

### Policy lives app-local, not in the kit

The policy file at `templates/app/src/lib/server/auth-policy.ts` is part of the scaffold. Apps edit it post-scaffold to pick their tier and (for `'authorized'`) name their allowlist. The kit does NOT host policy — policy is app-specific configuration, not UI-kit behavior.

The kit ships the default `mode: 'authenticated'` so a fresh scaffold behaves like the post-cleanup state with zero edits.

### Why not env-driven

Considered and rejected for v1: policy via environment variables. A typed app-local file earns its place better because (a) the policy is naturally code-shaped (string arrays, modes), (b) it's reviewed in PRs alongside the app it gates, and (c) changes to it are immediately visible in `git log` for that app's repo. Env-driven policy would shift the trust surface to deployment config without obvious gain.

### Trust boundary unchanged

This follow-up does not weaken the Traefik scrub-headers rollout gate (homelab issue #645). The policy layer trusts `event.locals.user`, which is still populated only from Traefik-forwarded headers (or the dev fallback). NetworkPolicy + scrub middleware remain the actual security boundary.

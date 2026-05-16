# Auth cleanup — Implementation Plan

> **For agentic workers:** If you have the superpowers plugin available, use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. In runners without those skills (e.g. Codex), follow the tasks directly with the normal repo workflow — each task ends in its own commit, so the structure works either way. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the kit's stub cookie auth with a thin layer that consumes Traefik's forwarded `Remote-*` identity headers. After this plan: no `/login` route, no `SESSION_COOKIE`, no `requireSession`. The whole template app is gated by `requireUser()` in the root layout; identity flows from `Remote-Sub` / `Remote-User` / `Remote-Email` / `Remote-Name` / `Remote-Groups` into `event.locals.user`.

**Architecture:** `hooks.server.ts` reads the headers (with a dev-only `WRIGHT_DEV_USER` env-var fallback) and populates `event.locals.user`. A rewritten `$lib/server/auth.ts` exports the `User` type and two helpers — `getUser()` (returns `User | null`) and `requireUser()` (returns `User` or throws 401). The root `+layout.server.ts` calls `requireUser`, gating every page. The AppShell foot reads the real user. The cookie/session machinery and the `/login` route are deleted.

**Tech Stack:** SvelteKit `Handle` hook (`$app/environment` `dev` flag, `$env/dynamic/private`), `event.locals` typing via `app.d.ts`, Vite-native JSON imports already in use from the AppShell version-display feature. No new dependencies.

**Spec:** [`docs/superpowers/specs/2026-05-15-auth-cleanup-design.md`](../specs/2026-05-15-auth-cleanup-design.md)

**Testing note:** This repo has no Svelte component test runner today. Each task verifies via `bun run check` (svelte-check / type errors), `bun run build` (full SvelteKit production compile), and curl probes against `bun run preview` for the runtime-behavior tasks. Adding a JS test runner is out of scope and has not earned its place. See the spec's "Non-goals" section for rationale.

**Deployment gate:** Task 1 files a Forgejo issue against `scott/homelab` for the required Traefik Headers middleware. Code commits in subsequent tasks may proceed before the homelab side is rolled out, but **consuming apps must not pull this version of `@wright/ui` until the homelab issue is closed and the middleware is live in every IngressRoute that fronts a SvelteKit consumer.** This gate is on rollout, not on commit.

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `templates/app/src/hooks.server.ts` | Create | Single source of truth for header → `User` mapping. Honors `WRIGHT_DEV_USER` only when `dev === true`. |
| `templates/app/src/app.d.ts` | Modify | Type `App.Locals.user: User \| null` so consumers of `event.locals.user` get autocomplete + check coverage. |
| `templates/app/src/lib/server/auth.ts` | Rewrite | Exports `User`, `getUser`, `requireUser`. Deletes `SESSION_COOKIE`, `Session`, `getSession`, `setSession`, `clearSession`, `requireSession`, `redirectToLogin`, `redirectAfterLogin`. |
| `templates/app/src/routes/+layout.server.ts` | Create | `requireUser(event)`; returns `{ user }` so the layout (and child pages) can render identity. Gates the whole template app by default. |
| `templates/app/src/routes/+layout.svelte` | Modify | Foot snippet reads `data.user.name \|\| data.user.username` and `data.user.email \|\| data.user.username`. Removes `LogIn` icon import and the `/login` nav item. |
| `templates/app/src/routes/login/+page.server.ts` | Delete | Login form-actions disappear. |
| `templates/app/src/routes/login/+page.svelte` | Delete | Login form UI disappears. (Empty directory removed by git.) |
| `templates/app/.env.example` | Create | Documents `WRIGHT_DEV_USER` / `WRIGHT_DEV_GROUPS`. |
| `skills/homelab-web-ui/SKILL.md` | Modify | Removes Login recipe row, drops "login screen" examples, deletes "tiny form escape hatch" bullet, adds "Auth via Traefik" subsection, updates "seven recipes" → "six recipes" in frontmatter + intro. |
| `skills/homelab-web-backend-bridge/SKILL.md` | Modify | Frontmatter drops "session-cookie forwarding." Code samples replace `requireSession` + `SESSION_COOKIE` + cookie-header forwarding with explicit `X-Internal-User` forwarding when needed. |
| `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md` | Modify | Template-demonstrates bullet (line 170), backend-bridge skill summary bullet (line 215), full replacement of the `Auth Stub (intentionally thin)` section (lines 244–258) with `Auth via Traefik`. |
| `docs/migrations/scan-router.md` | Modify | "Out" scope bullet (auth framing flip), no-JS curl bullet (drop login), two "seven recipes" → "six recipes" updates. |
| `CHANGELOG.md` | Modify | New entry under "Breaking changes (auth)" documenting the API surface change. |

External action (not in repo):

| Action | Vehicle | Responsibility |
|---|---|---|
| File Forgejo issue against `scott/homelab` | `/forgejo` skill + `fj` CLI | Records the required Traefik `scrub-identity-headers` middleware and IngressRoute order. Captures the issue URL for the rollout gate. |

---

## Task 1: File the homelab issue for the Traefik scrub middleware

**Goal of this task:** Open a Forgejo issue against `scott/homelab` requesting the Traefik `Headers` middleware that scrubs client-supplied `Remote-*` headers before ForwardAuth runs. This is the rollout-gate precondition; code work in subsequent tasks may proceed, but no consumer pulls this kit version until the issue is closed and the middleware is live.

**Files:** None in this repo. The output is an issue URL recorded in this plan's task checklist below for reference.

- [ ] **Step 1: Invoke the `/forgejo` skill**

This task uses the `fj` CLI (not `gh`). The repo is `scott/homelab` on `git.txsww.com:2222`. SSH key: `~/.ssh/sshkey` on the laptop. If the skill hasn't been loaded yet in this session, invoke it now to get the auth/setup notes.

- [ ] **Step 2: Create the issue**

Use the `fj` CLI to file the issue. Title and body are below; both come verbatim from the spec's "Homelab issue to file" section.

```bash
fj issue create scott/homelab \
  --title "Scrub client-supplied Remote-* headers before ForwardAuth runs" \
  --body "$(cat <<'EOF'
**Why:** Traefik's `authResponseHeaders` only replaces headers TinyAuth actually returns. Optional fields like `Remote-Email`, `Remote-Name`, or `Remote-Groups` can be spoofed by a client if TinyAuth's response omits them. Without an explicit scrub, a malicious request reaching Traefik could inject identity fields the auth provider didn't authorize.

**What to add:**

1. New middleware `k8s/infrastructure/traefik/middleware-scrub-identity.yaml`:

   ```yaml
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

2. Add \`scrub-identity-headers\` as the *first* middleware in every IngressRoute that also uses \`tinyauth-forward-auth\`. Order matters: scrub runs before ForwardAuth populates the trusted values.

3. Verify NetworkPolicy for every consuming app's namespace restricts Pod ingress to the Traefik namespace/ServiceAccount.

**Gate:** The web-ui auth-cleanup commits will not be rolled out to consuming apps until this issue is closed and the middleware is live in every IngressRoute that fronts a SvelteKit app.

**References:**
- web-ui spec: \`docs/superpowers/specs/2026-05-15-auth-cleanup-design.md\`
- [Traefik Headers customRequestHeaders](https://doc.traefik.io/traefik/master/reference/routing-configuration/http/middlewares/headers/)
EOF
)"
```

The exact `fj` invocation may differ — consult the `/forgejo` skill for the canonical flags (some `fj` versions use `--repo` instead of a positional, or want `--label`). If the call form differs from above, follow the skill's guidance and keep the title and body content identical.

- [ ] **Step 3: Capture the issue URL**

Record the issue URL in this plan file (the gate referenced by Task 13's verification step expects it):

```bash
# Replace <URL> with the actual URL returned by `fj`:
echo "Homelab issue: <URL>" >> docs/superpowers/plans/2026-05-15-auth-cleanup.md
git add docs/superpowers/plans/2026-05-15-auth-cleanup.md
git commit -m "docs(plan): record homelab issue URL for auth cleanup rollout gate"
```

If you'd rather not commit the URL, paste it into the controller's notes instead — the rollout gate just needs the issue to exist and be tracked somewhere visible.

- [ ] **Step 4: Confirm**

```bash
fj issue list scott/homelab --state open | grep -i 'scrub'
```

Expected: the newly-created issue appears in the list.

---

## Task 2: Rewrite `auth.ts` and type `App.Locals.user`

**Goal of this task:** Replace the stub cookie machinery with the new `User` shape, `getUser()`, and `requireUser()`. Type `App.Locals.user` so `event.locals.user` is autocomplete-correct. Nothing else consumes this yet — pure type-and-helper landing.

**Files:**
- Rewrite: `templates/app/src/lib/server/auth.ts`
- Modify: `templates/app/src/app.d.ts`

- [ ] **Step 1: Rewrite `templates/app/src/lib/server/auth.ts`**

Replace the entire current content (the stub cookie comment, `SESSION_COOKIE`, `Session`, `getSession`, `setSession`, `clearSession`, `requireSession`, `redirectToLogin`, `redirectAfterLogin`) with:

```ts
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

Use `Write` (full-file overwrite), not `Edit`. Every previous export is gone; consumers (`+layout.server.ts`, `hooks.server.ts`, the backend-bridge skill code samples) all change in subsequent tasks.

- [ ] **Step 2: Modify `templates/app/src/app.d.ts`**

Current content (12 lines):

```ts
// See https://kit.svelte.dev/docs/types#app
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
```

Replace with:

```ts
// See https://kit.svelte.dev/docs/types#app
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

- [ ] **Step 3: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: passes with 0 errors. (Existing template references to `SESSION_COOKIE`, `requireSession`, etc. are about to break in Task 3+, but at this point nothing else consumes them — the `/login` route still imports them, so it WILL show errors. **This is expected and accepted; do not fix here.** The errors will resolve when Task 6 deletes the `/login` route.)

If `bun run check` shows errors only in `templates/app/src/routes/login/+page.server.ts` (which imports `clearSession`, `getSession`, `redirectAfterLogin`, `setSession` from `$lib/server/auth`), that's the expected state — move on. Errors elsewhere mean something's wrong; stop and investigate.

- [ ] **Step 4: Verify build (also expected to fail in /login)**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: build **fails** at the `/login` route compilation. The error message names the missing imports from `$lib/server/auth`. **This is expected and accepted.** It will be resolved by Task 6 (delete `/login`).

If the build fails for any OTHER reason (errors NOT in `routes/login/`), stop and investigate.

- [ ] **Step 5: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/lib/server/auth.ts templates/app/src/app.d.ts
git commit -m "feat(template): rewrite auth.ts for ForwardAuth User shape

Replace stub cookie auth (SESSION_COOKIE, getSession/setSession/
clearSession, requireSession, redirectToLogin, redirectAfterLogin)
with a User type sourced from Traefik's Remote-* headers and two
helpers: getUser (optional) and requireUser (throws 401).

This commit intentionally breaks the /login route's imports; that
route is deleted in a subsequent commit."
```

---

## Task 3: Create `hooks.server.ts`

**Goal of this task:** Add the single source of truth that maps `Remote-*` headers to `event.locals.user`, with a dev-only env-var fallback. After this commit, `event.locals.user` is populated correctly on every request — but nothing consumes it yet.

**Files:**
- Create: `templates/app/src/hooks.server.ts`

- [ ] **Step 1: Create `templates/app/src/hooks.server.ts`**

```ts
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

Notes for the implementer:
- The `dev` import is Vite/SvelteKit's build-time flag. It's `true` in `bun run dev`, `false` in `bun run build` output. The whole dev-fallback branch is tree-shaken out of the production bundle.
- `env` from `$env/dynamic/private` reads at runtime, so the env var works without restarting the dev server (unlike `$env/static/private`).
- The `name` fallback uses `||` (not `??`) so an empty-string `Remote-Name` falls back to `username`.

- [ ] **Step 2: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: the `/login` route errors from Task 2 are still present (deleted in Task 6). No NEW errors from `hooks.server.ts`. If you see new errors mentioning `hooks.server.ts`, stop and investigate.

- [ ] **Step 3: Verify build still fails only in /login**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: fails at `/login`, same as Task 2. No new failures from `hooks.server.ts`.

- [ ] **Step 4: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/hooks.server.ts
git commit -m "feat(template): populate event.locals.user from Remote-* headers

Production: reads Remote-Sub/User/Email/Name/Groups from Traefik's
ForwardAuth response. Both Remote-Sub and Remote-User must be
non-empty after trim; missing either → no user.

Development: when NODE_ENV !== 'production' and WRIGHT_DEV_USER is
set, fabricates a User from the env var. WRIGHT_DEV_GROUPS is
optional and comma-split."
```

---

## Task 4: Create root `+layout.server.ts`

**Goal of this task:** Gate the whole template app by default. Every request that doesn't have an identity (no `Remote-*` headers, no `WRIGHT_DEV_USER` in dev) gets a 401 before any page renders.

**Files:**
- Create: `templates/app/src/routes/+layout.server.ts`

- [ ] **Step 1: Create the file**

```ts
import type { LayoutServerLoad } from './$types';
import { requireUser } from '$lib/server/auth';

export const load: LayoutServerLoad = (event) => {
  // Returns the full User including `groups`. Group names are not
  // considered sensitive in this homelab context (values like
  // "admins" / "family") so we ship them to the client for use in
  // group-gated UI. If a future app needs to hide group names from
  // the browser, narrow this to { sub, username, email, name }.
  return { user: requireUser(event) };
};
```

- [ ] **Step 2: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: `/login`'s errors are still present (Task 6 deletes). No new errors elsewhere. The new `+layout.server.ts` should type-check cleanly because `requireUser` is now exported from the rewritten `auth.ts` (Task 2) and `event.locals.user` is typed (Task 2).

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/routes/+layout.server.ts
git commit -m "feat(template): gate the whole app via requireUser in root layout

A request without identity (no Remote-* headers, no WRIGHT_DEV_USER
in dev) 401s before any page renders. The full User shape (including
groups) is returned to the client through layout data — group names
are not sensitive in the homelab context."
```

---

## Task 5: Update `+layout.svelte` (foot + remove `/login` nav)

**Goal of this task:** Replace the hard-coded "Scott / wrightfamily.org" in the AppShell foot with the real user. Remove the `LogIn` icon import and the `/login` nav item from the System section so the app no longer points at a route we're about to delete.

**Files:**
- Modify: `templates/app/src/routes/+layout.svelte`

- [ ] **Step 1: Remove `LogIn` from the Lucide imports**

In `templates/app/src/routes/+layout.svelte`, find the existing imports block:

```svelte
  import {
    Home,
    Inbox,
    Settings,
    Activity,
    LogIn,
    LayoutDashboard,
    UserCircle,
  } from '@lucide/svelte';
```

Remove the `LogIn,` line so the block becomes:

```svelte
  import {
    Home,
    Inbox,
    Settings,
    Activity,
    LayoutDashboard,
    UserCircle,
  } from '@lucide/svelte';
```

- [ ] **Step 2: Remove the `/login` nav item from the System section**

In the same file, find the `System` nav section (currently the second section in the `nav` array, with `desktopOnly: true`):

```svelte
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
        {
          href: '/login',
          label: 'Sign in',
          icon: LogIn,
          active: $page.url.pathname === '/login',
        },
      ],
    },
```

Remove the `/login` item so the section becomes:

```svelte
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
```

- [ ] **Step 3: Update the foot snippet to read the real user**

The current foot snippet hard-codes Scott's identity:

```svelte
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
      <div style="font-size: 13px; color: var(--text);">Scott</div>
      <div class="mono" style="font-size: 11px; color: var(--text-subtle);">wrightfamily.org</div>
    </div>
  {/snippet}
```

Replace the two hard-coded lines (the inner `<div>`s for name and email) with the real user:

```svelte
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
```

The `{ data }` prop is already destructured in the layout script via `let { children } = $props();`. Extend the destructure to include `data`:

Find:
```svelte
  let { children } = $props();
```

Replace with:
```svelte
  let { children, data } = $props();
```

`data` is typed automatically from the new `+layout.server.ts` (SvelteKit generates `LayoutData` based on the `load`'s return shape). Because `requireUser` throws if there's no user, `data.user` is non-null at the type level — no `?.` chaining needed.

- [ ] **Step 4: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: only the `/login` errors from Task 2 remain (deleted next task). The layout's new `data.user.name` references should type-check cleanly.

- [ ] **Step 5: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/routes/+layout.svelte
git commit -m "feat(template): read real user in foot, remove /login nav

The AppShell foot now reads data.user.name and data.user.email from
the layout's server load (fallback to username if either is empty).
The LogIn icon import and the /login System-nav item are removed."
```

---

## Task 6: Delete the `/login` route

**Goal of this task:** Remove the now-orphaned login form-actions and page. This is the commit that resolves the type/build errors that have been intentionally tolerated since Task 2.

**Files:**
- Delete: `templates/app/src/routes/login/+page.server.ts`
- Delete: `templates/app/src/routes/login/+page.svelte`

- [ ] **Step 1: Delete the route**

```bash
cd /Users/scott/Projects/web-ui
git rm templates/app/src/routes/login/+page.server.ts templates/app/src/routes/login/+page.svelte
```

The `templates/app/src/routes/login/` directory becomes empty. Git tracks files, not directories, so an empty dir leaves no trace in the index. If you want to also remove the empty directory from the working tree:

```bash
rmdir templates/app/src/routes/login 2>/dev/null || true
```

(Optional — empty dirs don't affect anything; SvelteKit ignores them.)

- [ ] **Step 2: Verify svelte-check is now clean**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: passes with 0 errors. (The 4 pre-existing Superforms-related warnings remain — those are unrelated.)

- [ ] **Step 3: Verify build succeeds**

To run the build, you need either Traefik headers or the dev-env fallback. The build itself doesn't run the hook (it compiles), but prerendering would — and the template has no prerendered pages, so the build should compile clean without setting an env var:

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: builds successfully. Tail output should show `✓ built` for both client and server bundles, then `Using @sveltejs/adapter-node` and `✔ done`.

- [ ] **Step 4: Commit**

```bash
cd /Users/scott/Projects/web-ui
git commit -m "feat(template): delete /login route

Traefik+TinyAuth+Pocket ID handles login at the edge; the kit no
longer ships a login form. Type-check and build are now clean."
```

(Note: `git rm` already staged the deletions; `git commit` alone closes the commit.)

---

## Task 7: Create `templates/app/.env.example`

**Goal of this task:** Give a developer cloning a freshly-scaffolded app a self-documenting way to enable the dev-user fallback.

**Files:**
- Create: `templates/app/.env.example`

- [ ] **Step 1: Create the file**

```bash
cat > /Users/scott/Projects/web-ui/templates/app/.env.example <<'EOF'
# Local dev: when Traefik isn't in front, fake a user so requireUser()
# doesn't 401. Only honored when NODE_ENV !== 'production' (Vite's
# `dev` flag). The kit ships the value-shape; you choose the username.
WRIGHT_DEV_USER=scott

# Optional comma-separated groups to test group-gated UI in dev.
WRIGHT_DEV_GROUPS=admins,family
EOF
```

- [ ] **Step 2: Confirm `.env.local` (the developer's actual file) is gitignored**

SvelteKit's default `.gitignore` already covers `.env*` except `.env.example`. Check:

```bash
cd /Users/scott/Projects/web-ui
cat templates/app/.gitignore | grep -E '^\.env'
```

Expected output (or equivalent):

```
.env
.env.*
!.env.example
```

If `.env.example` is NOT excepted (which would mean it's gitignored along with the others), update `templates/app/.gitignore` to add `!.env.example` on its own line. If it already excepts `.env.example`, leave the file alone.

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/.env.example
# Also stage templates/app/.gitignore if step 2 modified it
git commit -m "feat(template): add .env.example for dev-user fallback"
```

---

## Task 8: Update `homelab-web-ui` SKILL.md

**Goal of this task:** Remove every mention of stub auth, the `/login` recipe, and "seven recipes." Add a new "Auth via Traefik" subsection that teaches the new pattern.

**Files:**
- Modify: `skills/homelab-web-ui/SKILL.md`

- [ ] **Step 1: Update the frontmatter description (line 3)**

Find:
```
description: Use when scaffolding a new homelab web app or building/modifying any page inside a SvelteKit project that consumes `@wright/ui`. Covers the canonical scaffolder command, the seven page recipes with their file locations, the SvelteKit render-mode decision tree (default vs `csr = false` vs `prerender`), the mobile-first checklist, the pinned Vite + Superforms conventions that silently break otherwise, and the AppShell / PageHeader / theme-token rules.
```

Replace "seven page recipes" with "six page recipes":
```
description: Use when scaffolding a new homelab web app or building/modifying any page inside a SvelteKit project that consumes `@wright/ui`. Covers the canonical scaffolder command, the six page recipes with their file locations, the SvelteKit render-mode decision tree (default vs `csr = false` vs `prerender`), the mobile-first checklist, the pinned Vite + Superforms conventions that silently break otherwise, and the AppShell / PageHeader / theme-token rules.
```

- [ ] **Step 2: Update the intro paragraph (line 9)**

Find:
```markdown
Every page should map to one of the seven recipes in `templates/app`,
```

Replace with:
```markdown
Every page should map to one of the six recipes in `templates/app`,
```

- [ ] **Step 3: Delete the Login recipe map row (around line 54)**

Find the recipe-map table row:
```markdown
| Login | `/login` | `routes/login/` | Stub auth, plain form (no Superforms), `requireSession()` helper |
```

Delete the line entirely. The table loses one row (six remain).

- [ ] **Step 4: Drop "the login screen" from the `csr = false` examples (around line 67)**

Find:
```markdown
| **`csr = false`** | `export const csr = false` in `+page.ts` or `+page.server.ts` | Pure read views with no client state — table pages, error pages, the login screen |
```

Replace with:
```markdown
| **`csr = false`** | `export const csr = false` in `+page.ts` or `+page.server.ts` | Pure read views with no client state — table pages, error pages |
```

- [ ] **Step 5: Delete the "tiny form escape hatch" bullet (around line 141)**

Find:
```markdown
- **Login is the canonical "tiny form" escape hatch** — plain server
  action, no Superforms, inline error on failure, redirect on success.
```

Delete those two lines entirely. The bullet above it (about Action returns) becomes the last bullet of the Forms subsection.

- [ ] **Step 6: Add a new "Auth via Traefik" subsection**

Insert the following subsection. The natural placement is between `## Theme conventions` and `## Layout primitives` (roughly around line 165 in the post-edit file — find the boundary by reading the surrounding `## Theme conventions` and `## Layout primitives` headings):

```markdown
## Auth via Traefik

Every homelab app runs behind Traefik → TinyAuth → Pocket ID. The kit reads `Remote-*` headers in `hooks.server.ts` and exposes the identity as `event.locals.user`. The template's root `+layout.server.ts` calls `requireUser(event)` so the whole app is gated by default.

In a `+page.server.ts`:

```ts
import { requireUser, getUser } from '$lib/server/auth';

export const load = async (event) => {
  const user = requireUser(event);          // 401 if no identity
  if (!user.groups.includes('admins')) error(403);
  // ...
};
```

For optional access (rare), `getUser(event)` returns `User | null`.

Local dev: set `WRIGHT_DEV_USER=<name>` in `.env.local`. The kit fakes a dev user only when `NODE_ENV !== 'production'`.

Deployment invariants: NetworkPolicy must restrict ingress to Traefik, and Traefik must scrub client-supplied `Remote-*` headers before ForwardAuth. See `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` for details.
```

- [ ] **Step 7: Verify the file**

```bash
cd /Users/scott/Projects/web-ui
grep -nE 'seven recipes|stub auth|requireSession|/login.*recipe|tiny form escape hatch' skills/homelab-web-ui/SKILL.md
```

Expected output: empty (no matches). If anything matches, it's a stale reference that needs another edit.

- [ ] **Step 8: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add skills/homelab-web-ui/SKILL.md
git commit -m "docs(skills): replace stub-auth content with Traefik auth in homelab-web-ui

Removes the Login recipe row, the login screen csr=false mention,
and the 'tiny form escape hatch' bullet. Adds a new 'Auth via
Traefik' subsection that teaches requireUser/getUser and the dev
fallback. Recipe count goes from seven to six in both the
frontmatter description and the intro paragraph."
```

---

## Task 9: Update `homelab-web-backend-bridge` SKILL.md

**Goal of this task:** Strip the cookie-forwarding pattern. Replace with the new posture: SvelteKit is the auth boundary; backends trust the call by network policy; explicit `X-Internal-User` header only when the backend genuinely needs identity.

**Files:**
- Modify: `skills/homelab-web-backend-bridge/SKILL.md`

- [ ] **Step 1: Update the frontmatter description (line 3)**

Find the frontmatter `description` field. It currently mentions "session-cookie forwarding" near the end. Find:

```
description: Use when a SvelteKit app needs to talk to a backend service (FastAPI, Hono, anything HTTP). One rule: SvelteKit is the public face, the backend is internal. Calls happen server-side from `load`/actions, never browser-to-backend. Covers the typed `apiFetch` wrapper, Zod boundary validation, the error envelope shape, session-cookie forwarding, and conservative timeout/retry defaults.
```

Replace "session-cookie forwarding" with "explicit identity forwarding when a backend needs it":

```
description: Use when a SvelteKit app needs to talk to a backend service (FastAPI, Hono, anything HTTP). One rule: SvelteKit is the public face, the backend is internal. Calls happen server-side from `load`/actions, never browser-to-backend. Covers the typed `apiFetch` wrapper, Zod boundary validation, the error envelope shape, explicit identity forwarding when a backend needs it, and conservative timeout/retry defaults.
```

- [ ] **Step 2: Read the file fully before editing**

Line numbers below match the file's pre-edit state. Confirm by reading first:

```bash
cat /Users/scott/Projects/web-ui/skills/homelab-web-backend-bridge/SKILL.md
```

The auth-shaped touches that all need to come out together are at lines 19 (top bullet), 30 + 32 + 49 + 67–70 (the `apiFetch` code sample with cookie forwarding), 100–111 (a `+page.server.ts` example using `requireSession`), and 146–150 (closing notes that reference `SESSION_COOKIE`).

Now perform these four specific changes:

**Change A — line ~19 bullet:** find the bullet that says "Session/auth cookies and headers stay server-side" (or similar). Replace it with:

```markdown
- The backend trusts SvelteKit-originated calls (network-isolated by NetworkPolicy; SvelteKit is the only client). It does not receive user identity by default; the SvelteKit route handler is the auth boundary.
```

**Change B — `apiFetch` code sample:** find the `apiFetch` function definition and replace the entire function (including its imports, `ApiFetchOptions` type, and the cookie-forwarding `if (init.event)` block) with this clean version:

```ts
import { error } from '@sveltejs/kit';

type ApiFetchOptions = {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
  // Add timeout/retry options as the skill currently has them; just
  // do NOT add an `event` field. Identity forwarding is explicit at
  // the call site (see below).
};

export async function apiFetch(path: string, init: ApiFetchOptions = {}) {
  const headers = new Headers(init.headers);
  // ... rest of the existing implementation (timeout, retry, Zod
  // boundary parsing, error envelope unwrap) stays the same.
}
```

(Preserve the surrounding timeout/retry/Zod machinery — only the cookie-forwarding lines and the `event` parameter come out.)

**Change C — `+page.server.ts` example:** find the block that imports `requireSession` and calls `requireSession(event)`. Replace with:

```ts
import { requireUser } from '$lib/server/auth';
import { apiFetch } from '$lib/server/api';

export const load = async (event) => {
  const user = requireUser(event);
  const data = await apiFetch('/api/things', {
    headers: { 'X-Internal-User': user.sub },
  });
  return { data };
};
```

Plus a one-paragraph note immediately after the example:

```markdown
`X-Internal-User` is a convention taught by this skill, not a kit constant. The backend treats it as audit metadata, not authorization input — authorization is enforced at the SvelteKit layer by `requireUser` + group checks.
```

**Change D — closing notes:** find the lines around 146–150 that mention `SESSION_COOKIE` and "Never read the cookie in `+page.svelte`". Replace both with:

```markdown
- Backend services receive no identity header by default. Apps that need to log "who did this" in the backend forward `X-Internal-User: <user.sub>` explicitly from the SvelteKit route handler.
- Never compute identity in `+page.svelte` and pass it as a prop. The browser is a fundamentally untrusted client; identity is established by `hooks.server.ts` and propagated through `event.locals`.
```

- [ ] **Step 3: Verify the file**

```bash
cd /Users/scott/Projects/web-ui
grep -nE 'SESSION_COOKIE|requireSession|wf_session|session cookie|Cookies' skills/homelab-web-backend-bridge/SKILL.md
```

Expected output: empty (no matches). The file should now have only `requireUser` and `X-Internal-User` as auth-shaped strings.

- [ ] **Step 4: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add skills/homelab-web-backend-bridge/SKILL.md
git commit -m "docs(skills): replace cookie-forwarding with explicit identity in backend-bridge

apiFetch loses its event parameter and stops carrying session
cookies. Backends are network-isolated; identity flows through
SvelteKit as the auth boundary. Apps that need identity at the
backend forward 'X-Internal-User: user.sub' explicitly. The skill's
+page.server.ts example uses requireUser and the explicit header."
```

---

## Task 10: Update the strategy spec

**Goal of this task:** Replace stub-auth references across the strategy spec so the spec's auth section reflects the post-cleanup reality.

**Files:**
- Modify: `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md`

- [ ] **Step 1: Update the template-demonstrates bullet (around line 170)**

Find:
```markdown
- Stub auth (session cookie, redirect helpers — see §"Auth Stub")
```

Replace with:
```markdown
- Auth via Traefik + TinyAuth + Pocket ID (see §"Auth via Traefik")
```

- [ ] **Step 2: Update the backend-bridge summary bullet (around line 215)**

Find:
```markdown
- Auth header / session cookie passing.
```

Replace with:
```markdown
- Explicit identity forwarding (e.g. `X-Internal-User: user.sub`) when a backend needs identity. No automatic cookie/session forwarding — SvelteKit is the auth boundary.
```

- [ ] **Step 3: Replace the entire "Auth Stub" section (lines 244–258)**

Find the section starting with `## Auth Stub (intentionally thin)` and ending immediately before the next `##` heading. The full current content is:

```markdown
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
```

Replace it (heading + body) with:

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

- [ ] **Step 4: Verify the file has no stale stub-auth references**

```bash
cd /Users/scott/Projects/web-ui
grep -nE 'Stub auth|stub auth|requireSession|SESSION_COOKIE|Auth Stub|redirectToLogin|redirectAfterLogin' docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md
```

Expected: empty.

- [ ] **Step 5: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md
git commit -m "docs(spec): replace Auth Stub section with Auth via Traefik

The homepage/SSO project landed as Pocket ID via Traefik+TinyAuth.
Strategy spec now reflects that: stub-auth bullet in the template-
demonstrates list becomes a Traefik bullet, backend-bridge summary
swaps cookie passing for explicit identity forwarding, and the
'Auth Stub (intentionally thin)' section is replaced wholesale."
```

---

## Task 11: Update the scan-router migration doc

**Goal of this task:** Align the scan-router migration doc with the post-cleanup world. Reframe the "Out" scope bullet, drop login from the no-JS curl examples, and update both "seven recipes" mentions.

**Files:**
- Modify: `docs/migrations/scan-router.md`

- [ ] **Step 1: Reframe the "Out" scope bullet (lines 75–76)**

Find:
```markdown
- Real auth. The kit's stub auth in `$lib/server/auth.ts` is enough
  for v1; SSO comes from the homepage project later.
```

Replace with:
```markdown
- Custom auth. The kit consumes the homelab's Traefik + TinyAuth +
  Pocket ID infrastructure via `event.locals.user`; scan-router
  inherits this automatically. No app-level auth code to write.
```

- [ ] **Step 2: Drop login from the no-JS curl bullet (lines 85–87)**

Find:
```markdown
  The scan list, individual detail views, and
  the login/settings pages should be functional via `curl`. Use
  `export const csr = false` where it applies.
```

Replace with:
```markdown
  The scan list, individual detail views, and the settings page
  should be functional via `curl` (with Traefik forwarding the
  Remote-* headers). Use `export const csr = false` where it applies.
```

- [ ] **Step 3: Update the suggested-first-step recipe count (around line 107)**

Find:
```markdown
1. From `~/Projects/web-ui/`, run
   `bun run create-app ~/Projects/scan-router/web`. The scaffold drops
   you a complete SvelteKit app with all seven recipes pre-built —
   start from there.
```

Replace with:
```markdown
1. From `~/Projects/web-ui/`, run
   `bun run create-app ~/Projects/scan-router/web`. The scaffold drops
   you a complete SvelteKit app with all six recipes pre-built —
   start from there.
```

- [ ] **Step 4: Update the recipe-mapping intro (around line 111)**

Find:
```markdown
   Map each Jinja page to one of the seven recipes:
```

Replace with:
```markdown
   Map each Jinja page to one of the six recipes:
```

- [ ] **Step 5: Verify the file has no stale references**

```bash
cd /Users/scott/Projects/web-ui
grep -nE 'stub auth|seven recipes|requireSession|/login|SSO comes from' docs/migrations/scan-router.md
```

Expected: empty.

- [ ] **Step 6: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add docs/migrations/scan-router.md
git commit -m "docs(migrations): align scan-router with post-cleanup auth

Reframe the 'Out' scope bullet from 'stub for now' to 'auth comes
free via the kit'. Drop login from the no-JS curl bullet. Update
both 'seven recipes' references to 'six recipes'."
```

---

## Task 12: Update CHANGELOG

**Goal of this task:** Document the breaking auth changes for downstream consumers.

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add the auth-breaking entry**

Open `CHANGELOG.md` and find the topmost section (usually under a header like `## Unreleased` or a date-tagged release). Add a new "Breaking changes (auth)" subsection at the top of the most-recent unreleased section. If there is no unreleased section, create one.

Concrete edit: read the file's first 30 lines to find the right insertion point. Then add:

```markdown
### Breaking changes (auth)

- Stub cookie auth removed. `SESSION_COOKIE`, `Session`, `getSession`, `setSession`, `clearSession`, `requireSession`, `redirectToLogin`, and `redirectAfterLogin` are gone from `$lib/server/auth`.
- `/login` route is removed. Traefik + TinyAuth + Pocket ID handles login at the edge.
- New API: `requireUser(event)` / `getUser(event)`, both returning the typed `User` shape `{ sub, username, email, name, groups }`. The root `+layout.server.ts` calls `requireUser` so the whole template app is gated by default.
- `apiFetch` (as documented in the `homelab-web-backend-bridge` skill) no longer takes an `event` parameter or forwards a session cookie. Forward identity explicitly when a backend needs it: `headers: { 'X-Internal-User': user.sub }`.
- Deployment requires the `scrub-identity-headers` Traefik middleware chained ahead of `tinyauth-forward-auth` in every app's IngressRoute, plus a NetworkPolicy restricting Pod ingress to Traefik. See `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` for the trust-boundary details and the middleware YAML.
- Local dev: copy `templates/app/.env.example` to `.env.local` and set `WRIGHT_DEV_USER=<name>` (optionally `WRIGHT_DEV_GROUPS=<csv>`).
```

- [ ] **Step 2: Verify the file renders cleanly**

```bash
cd /Users/scott/Projects/web-ui
head -60 CHANGELOG.md
```

Expected: no broken Markdown, the new section appears at the top of the most-recent unreleased changes, and existing entries below remain intact.

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add CHANGELOG.md
git commit -m "docs(changelog): note breaking auth cleanup"
```

---

## Task 13: Final verification

**Goal of this task:** Run end-to-end checks that prove the cleanup works for the canonical flows: app gated by default, dev user surfaces in the foot, missing identity 401s, no stale references anywhere.

**Files:** None modified.

- [ ] **Step 1: svelte-check clean**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: 0 errors. (Pre-existing 4 Superforms-state warnings unrelated to this work may still appear; that's fine.)

- [ ] **Step 2: Build clean**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: builds successfully, no errors.

- [ ] **Step 3: Dev user surfaces in foot (with WRIGHT_DEV_USER set)**

```bash
cd /Users/scott/Projects/web-ui/templates/app
WRIGHT_DEV_USER=scott WRIGHT_DEV_GROUPS=admins bun run preview &
PREVIEW_PID=$!
sleep 3
echo "--- foot identity ---"
curl -s http://localhost:5173/ | grep -oE '>scott<|>scott@dev.local<|wf-version|wf-shell-version-strip' | sort -u
echo "--- no /login link ---"
curl -s http://localhost:5173/ | grep -c 'href="/login"' || echo "0 (expected)"
pkill -f 'vite preview' || true
sleep 1
```

Expected:
- foot identity probe shows `>scott<` (name) and `>scott@dev.local<` (email).
- `wf-foot-row` and `wf-version-block` also appear (the AppShell version-display feature is unaffected).
- `href="/login"` count is `0` — nav no longer points at the deleted route.

- [ ] **Step 4: Missing identity 401s (no WRIGHT_DEV_USER, no Remote-* headers)**

```bash
cd /Users/scott/Projects/web-ui/templates/app
# Explicit empty value to override any shell-inherited WRIGHT_DEV_USER:
WRIGHT_DEV_USER= bun run preview &
sleep 3
echo "--- 401 expected ---"
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/
pkill -f 'vite preview' || true
sleep 1
```

Expected: HTTP status `401`.

- [ ] **Step 5: Real Remote-* headers work end-to-end**

```bash
cd /Users/scott/Projects/web-ui/templates/app
WRIGHT_DEV_USER= bun run preview &
sleep 3
echo "--- with forged Remote-* headers ---"
curl -s http://localhost:5173/ \
  -H 'Remote-Sub: sub-12345' \
  -H 'Remote-User: alice' \
  -H 'Remote-Email: alice@example.com' \
  -H 'Remote-Name: Alice Doe' \
  -H 'Remote-Groups: admins,family' \
  | grep -oE '>Alice Doe<|>alice@example.com<' | sort -u
pkill -f 'vite preview' || true
sleep 1
```

Expected: both `>Alice Doe<` and `>alice@example.com<` appear in the rendered HTML. This is exactly the case the trust-boundary section warns about — in production, Traefik's scrub middleware prevents a client from doing this. Locally (no Traefik in front) it works, which is the whole point of the dev workflow.

- [ ] **Step 6: Codebase grep for stale references**

```bash
cd /Users/scott/Projects/web-ui
echo "--- stale auth refs ---"
grep -rnE 'requireSession|SESSION_COOKIE|wf_session|redirectToLogin|redirectAfterLogin|setSession|clearSession|getSession' \
  --include='*.ts' --include='*.svelte' --include='*.md' \
  --exclude-dir=node_modules \
  --exclude-dir=.svelte-kit \
  --exclude-dir=build \
  --exclude-dir=design \
  . 2>/dev/null
```

Expected: empty. The `design/` directory is excluded because it contains an archived strategy doc with historical references; those don't drive runtime behavior. If anything else matches outside `design/`, fix it.

- [ ] **Step 7: Confirm git log**

```bash
cd /Users/scott/Projects/web-ui
git log --oneline -16
```

Expected sequence (most recent first; Task 1's URL-recording commit is optional and may not appear if the implementer chose to track the URL externally):

1. (optional) `docs(plan): record homelab issue URL for auth cleanup rollout gate`
2. `docs(changelog): note breaking auth cleanup`
3. `docs(migrations): align scan-router with post-cleanup auth`
4. `docs(spec): replace Auth Stub section with Auth via Traefik`
5. `docs(skills): replace cookie-forwarding with explicit identity in backend-bridge`
6. `docs(skills): replace stub-auth content with Traefik auth in homelab-web-ui`
7. `feat(template): add .env.example for dev-user fallback`
8. `feat(template): delete /login route`
9. `feat(template): read real user in foot, remove /login nav`
10. `feat(template): gate the whole app via requireUser in root layout`
11. `feat(template): populate event.locals.user from Remote-* headers`
12. `feat(template): rewrite auth.ts for ForwardAuth User shape`

(Plus the prior spec/plan commits visible further back.)

- [ ] **Step 8: Note the rollout gate**

This plan ships kit-side code only. The rollout gate (Traefik scrub middleware + NetworkPolicy verification) is enforced by Task 1's Forgejo issue. Before tagging a release of `@wright/ui` and updating consumers to pull it, **confirm the homelab issue is closed and the middleware is live in every IngressRoute that fronts a SvelteKit consumer.** Until that's done, the trust boundary has a gap (optional `Remote-*` fields can be spoofed by client headers if TinyAuth's response omits them).

---

## Out of scope (deferred — do not implement)

Documented in the spec's "Non-goals" and "Future follow-ups" sections. Do not add these in this plan:

- A logout button / "Sign out" link in the AppShell foot.
- A "You've been signed out" landing page.
- An `apiFetch.withIdentity(user, options)` helper (waits for 3-app reuse).
- A `requireGroup('admins')` helper.
- An HMAC-signed identity header (only earns its place if invariant 1 or 2 cannot be guaranteed).
- Scaffolder support for substituting the template's hard-coded `'Template'` literal into a new app's display name (pre-existing follow-up from the AppShell version-display review).
- A JS test runner. Verification is `bun run check` + `bun run build` + curl probes.
- Any changes to the homelab repo's manifests from this plan. The middleware lands via the Forgejo issue filed in Task 1.

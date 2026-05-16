# Auth policy tiers — Implementation Plan

> **For agentic workers:** If you have the superpowers plugin available, use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. In runners without those skills (e.g. Codex), follow the tasks directly with the normal repo workflow — each task ends in its own commit, so the structure works either way. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer three explicit app auth tiers — `none` / `authenticated` / `authorized` — on top of the existing Traefik-header trust model. After this plan, a new app declares its policy in a single app-local `auth-policy.ts` file and the root layout enforces it.

**Architecture:** Two pure-ish helpers (`authorizeUser`, `requireAuthorizedUser`) live in `$lib/server/auth.ts` alongside the existing `getUser` / `requireUser`. Policy lives in an app-local `$lib/server/auth-policy.ts` that exports a typed `authPolicy: AuthPolicy`. The root `+layout.server.ts` swaps `requireUser` for `requireAuthorizedUser(event, authPolicy)`. The AppShell foot handles a nullable `data.user` so `mode: 'none'` renders cleanly. No new dependencies, no env-driven policy, no UI admin screen.

**Tech Stack:** Same as the prior auth cleanup. SvelteKit `Handle` hook (already in place from prior task), `event.locals.user` typing (already in `app.d.ts`), `@sveltejs/kit`'s `error()` helper.

**Spec source:** Inline in the originating request; this plan also writes the design into `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` (a new "Auth tiers" section) as part of Task 5.

**Prereqs already on `main`:** the auth cleanup (`requireUser` + `event.locals.user` + Traefik scrub-headers gate via homelab issue #645) — HEAD `e13d6d7`.

**Testing note:** No JS test runner. Each task verifies via `bun run check` (svelte-check / types), `bun run build` (production compile), and curl probes against `bun run dev` (for the `WRIGHT_DEV_USER` fallback) or `bun run preview` (for the production / headers path). The final task exercises all three policy modes.

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `templates/app/src/lib/server/auth.ts` | Modify | Add `AuthMode`, `AuthPolicy` types and the `authorizeUser` / `requireAuthorizedUser` helpers. Existing `User`, `getUser`, `requireUser` untouched. |
| `templates/app/src/lib/server/auth-policy.ts` | Create | App-local policy file. Default `mode: 'authenticated'` (preserves current behavior). Apps edit this file post-scaffold to pick their tier. |
| `templates/app/src/routes/+layout.server.ts` | Modify | Swap `requireUser` for `requireAuthorizedUser(event, authPolicy)`. Return shape grows to include `authMode`. |
| `templates/app/src/routes/+layout.svelte` | Modify | Foot snippet handles `data.user` being `null` (the `mode: 'none'` case) with a modest "Internal / No auth" fallback. |
| `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` | Modify | Append a new "Auth tiers (follow-up)" section explaining what landed in this plan vs the prior cleanup. |
| `skills/homelab-web-ui/SKILL.md` | Modify | Add a "Choose an auth tier" subsection inside the existing "Auth via Traefik" section. |
| `CHANGELOG.md` | Modify | New `Unreleased` entry: explicit auth policy tiers. |

---

## Task 1: Add `AuthMode`, `AuthPolicy`, and the two helpers to `auth.ts`

**Goal of this task:** Land the type API and the two helpers. No consumer changes yet. The new exports sit alongside the existing `User`, `getUser`, `requireUser` (which all stay).

**Files:**
- Modify: `templates/app/src/lib/server/auth.ts`

- [ ] **Step 1: Read the current `auth.ts`**

```bash
cat /Users/scott/Projects/web-ui/templates/app/src/lib/server/auth.ts
```

Confirm it currently exports `User`, `getUser`, `requireUser` (the post-cleanup state).

- [ ] **Step 2: Append the new types and helpers**

Add the following to the END of `templates/app/src/lib/server/auth.ts` (after the existing `requireUser` function). Do NOT modify existing code — only append:

```ts

export type AuthMode = 'none' | 'authenticated' | 'authorized';

export type AuthPolicy = {
  mode: AuthMode;
  /** Match if user.groups contains any of these. */
  allowedGroups?: string[];
  /** Match if user.username equals any of these. */
  allowedUsers?: string[];
  /** Match if user.sub equals any of these. */
  allowedSubs?: string[];
};

/**
 * Apply an auth policy to a (possibly null) user. Pure-ish: throws 401 or 403
 * via SvelteKit's `error()` for failure cases; otherwise returns the user
 * (or null when mode is 'none' and no user is present).
 *
 * - mode 'none':           passthrough — returns user (or null) without checking.
 * - mode 'authenticated':  null user → 401. Any present user → pass.
 * - mode 'authorized':     null user → 401. User must match at least one of
 *                          allowedSubs / allowedUsers / allowedGroups. With no
 *                          allowlist arrays configured, fail closed → 403.
 *                          A user that doesn't match → 403.
 */
export function authorizeUser(user: User | null, policy: AuthPolicy): User | null {
  if (policy.mode === 'none') return user;
  if (!user) error(401, 'Unauthorized');
  if (policy.mode === 'authenticated') return user;
  // policy.mode === 'authorized'
  const allowedSubs = policy.allowedSubs ?? [];
  const allowedUsers = policy.allowedUsers ?? [];
  const allowedGroups = policy.allowedGroups ?? [];
  if (allowedSubs.length + allowedUsers.length + allowedGroups.length === 0) {
    // Fail closed: 'authorized' with no allowlist is a configuration error.
    error(403, 'Forbidden');
  }
  const subMatch = allowedSubs.includes(user.sub);
  const userMatch = allowedUsers.includes(user.username);
  const groupMatch = user.groups.some((g) => allowedGroups.includes(g));
  if (subMatch || userMatch || groupMatch) return user;
  error(403, 'Forbidden');
}

/**
 * Convenience: read `event.locals.user` and run it through `authorizeUser`.
 * Use this from `+layout.server.ts` / `+page.server.ts` load functions.
 */
export function requireAuthorizedUser(
  event: RequestEvent,
  policy: AuthPolicy,
): User | null {
  return authorizeUser(event.locals.user, policy);
}
```

The file's existing `import { error, type RequestEvent } from '@sveltejs/kit';` already provides both `error` and `RequestEvent`. No new imports needed.

- [ ] **Step 3: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: 0 errors. The 4 pre-existing Superforms warnings remain. The new helpers are unused at this commit (consumers wire up in Task 3) but exporting them shouldn't error.

- [ ] **Step 4: Verify build**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: builds cleanly. (Same `✔ done` finish as the post-cleanup state.)

- [ ] **Step 5: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/lib/server/auth.ts
git commit -m "feat(template): add AuthPolicy type and authorize helpers

Adds AuthMode ('none' | 'authenticated' | 'authorized') and AuthPolicy
to \$lib/server/auth. Two new helpers — authorizeUser (pure-ish core,
takes user-or-null + policy) and requireAuthorizedUser (reads from
event.locals.user) — implement the tier rules from the auth-tiers
spec follow-up. Existing User / getUser / requireUser are unchanged."
```

---

## Task 2: Create the app-local policy file

**Goal of this task:** Ship the default policy that matches today's behavior. New scaffolds get `mode: 'authenticated'` for free; apps edit this file after scaffold to change their tier.

**Files:**
- Create: `templates/app/src/lib/server/auth-policy.ts`

- [ ] **Step 1: Create the file**

```ts
// templates/app/src/lib/server/auth-policy.ts
import type { AuthPolicy } from './auth';

/**
 * App-local auth policy. The kit ships 'authenticated' as the default — every
 * page requires a Pocket ID-authenticated user via Traefik+TinyAuth.
 *
 * To change the tier, edit this file and restart the dev server.
 *
 *   No Auth      — internal / low-risk apps that don't need identity
 *                  enforcement. event.locals.user may still be populated
 *                  if Traefik provides headers, but is not required.
 *
 *     export const authPolicy: AuthPolicy = { mode: 'none' };
 *
 *   Authenticated (default) — any Pocket ID user may access the app.
 *
 *     export const authPolicy: AuthPolicy = { mode: 'authenticated' };
 *
 *   Authorized   — only explicitly allowed users / groups / subs. Configure
 *                  at least one allowlist; fail-closed if all three are empty.
 *
 *     export const authPolicy: AuthPolicy = {
 *       mode: 'authorized',
 *       allowedGroups: ['admins'],
 *       allowedUsers: ['scott'],
 *       allowedSubs: ['sub-12345'],
 *     };
 */
export const authPolicy: AuthPolicy = {
  mode: 'authenticated',
};
```

- [ ] **Step 2: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: 0 errors. The new file imports the `AuthPolicy` type added in Task 1.

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/lib/server/auth-policy.ts
git commit -m "feat(template): add app-local auth-policy.ts (defaults to authenticated)

A single file per app declares the auth tier. The kit ships
mode: 'authenticated' so the template behaves like today's
post-cleanup state. Apps edit this file to pick 'none' or
'authorized' (with allowlist arrays)."
```

---

## Task 3: Wire the policy into the root layout

**Goal of this task:** Replace the layout's direct `requireUser(event)` call with `requireAuthorizedUser(event, authPolicy)`. Layout's return data grows to include `authMode` so pages can branch on the tier later if needed. With the default policy from Task 2 (`'authenticated'`), the runtime behavior is identical to before this plan.

**Files:**
- Modify: `templates/app/src/routes/+layout.server.ts`

- [ ] **Step 1: Replace the file content**

Current content (from the prior auth cleanup):

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

Replace with:

```ts
import type { LayoutServerLoad } from './$types';
import { requireAuthorizedUser } from '$lib/server/auth';
import { authPolicy } from '$lib/server/auth-policy';

export const load: LayoutServerLoad = (event) => {
  // Returns the full User including `groups`. Group names are not
  // considered sensitive in this homelab context (values like
  // "admins" / "family") so we ship them to the client for use in
  // group-gated UI. If a future app needs to hide group names from
  // the browser, narrow this to { sub, username, email, name }.
  //
  // `user` may be null when authPolicy.mode === 'none'. Consumers
  // (including +layout.svelte) must handle the nullable case.
  return {
    user: requireAuthorizedUser(event, authPolicy),
    authMode: authPolicy.mode,
  };
};
```

- [ ] **Step 2: Verify svelte-check**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: **fails only in `templates/app/src/routes/+layout.svelte`** because the layout still references `data.user.name` without a null guard, and `data.user` is now typed as `User | null` (was `User`). Task 4 resolves this with the `{#if data.user}` guard. Treat the layout errors as expected, broken-window state.

If errors appear in any other file, stop and investigate.

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/routes/+layout.server.ts
git commit -m "feat(template): route root layout through authPolicy

The root +layout.server.ts now calls requireAuthorizedUser(event,
authPolicy) instead of requireUser(event). With the default policy
of mode: 'authenticated' the runtime behavior is unchanged. The
return shape grows to include authMode for pages that want to branch
on the tier.

This commit intentionally breaks +layout.svelte's foot snippet
because data.user is now User|null instead of User. Task 4 adds
the null guard."
```

---

## Task 4: Update the AppShell foot to handle `data.user === null`

**Goal of this task:** Resolve the type error from Task 3 by wrapping the foot identity in an `{#if data.user}` guard. Add a modest "Internal / No auth" fallback for `mode: 'none'`.

**Files:**
- Modify: `templates/app/src/routes/+layout.svelte`

- [ ] **Step 1: Find the current foot snippet**

In `templates/app/src/routes/+layout.svelte`, the foot snippet currently contains (from the prior cleanup):

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

- [ ] **Step 2: Wrap the inner two divs in an `{#if data.user}` block**

Replace the block above with:

```svelte
    <div class="wf-grow">
      {#if data.user}
        <div style="font-size: 13px; color: var(--text);">
          {data.user.name || data.user.username}
        </div>
        <div class="mono" style="font-size: 11px; color: var(--text-subtle);">
          {data.user.email || data.user.username}
        </div>
      {:else}
        <div style="font-size: 13px; color: var(--text);">Internal</div>
        <div class="mono" style="font-size: 11px; color: var(--text-subtle);">No auth</div>
      {/if}
    </div>
```

The avatar `<UserCircle>` div above this `<div class="wf-grow">` block stays unchanged — it renders in all three tiers as a generic foot anchor.

- [ ] **Step 3: Verify svelte-check is clean**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
```

Expected: 0 errors. The 4 pre-existing Superforms warnings remain.

- [ ] **Step 4: Verify build**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: `✔ done`, no errors.

- [ ] **Step 5: Visual sanity probe — default mode is `'authenticated'`**

This task doesn't change the default policy, so the foot should still show the dev user. Probe:

```bash
cd /Users/scott/Projects/web-ui/templates/app
WRIGHT_DEV_USER=scott bun run dev 2>&1 &
sleep 4
echo "--- authenticated mode, foot probe ---"
curl -s http://localhost:5173/ | grep -oE '>scott<|>scott@dev.local<|>Internal<|>No auth<' | sort -u
pkill -f 'vite dev' 2>/dev/null
sleep 2
```

Expected: shows `>scott<` and `>scott@dev.local<`; no `>Internal<` or `>No auth<` (because the dev user is set and policy is `'authenticated'`).

- [ ] **Step 6: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add templates/app/src/routes/+layout.svelte
git commit -m "feat(template): handle nullable data.user in foot snippet

data.user is now User|null (mode 'none' allows null). Wrap the
identity rendering in {#if data.user} and fall back to a modest
'Internal / No auth' for the no-auth case. Avatar icon stays in
all three tiers as a generic foot anchor."
```

---

## Task 5: Document the tiers in the auth-cleanup spec

**Goal of this task:** Extend the existing auth-cleanup spec with an "Auth tiers (follow-up)" section. Make clear that the prior cleanup landed header trust + authentication; this follow-up adds explicit authorization policy.

**Files:**
- Modify: `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md`

- [ ] **Step 1: Read the spec's tail**

```bash
tail -30 /Users/scott/Projects/web-ui/docs/superpowers/specs/2026-05-15-auth-cleanup-design.md
```

The current tail ends with the "Future follow-ups (deferred — do not implement)" section, then the homelab issue URL comment.

- [ ] **Step 2: Append the new section**

Insert the following section AFTER the existing "Future follow-ups" section and BEFORE the trailing `<!-- Filed homelab issue: ... -->` HTML comment. The new section becomes the spec's last narrative section:

```markdown
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
```

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add docs/superpowers/specs/2026-05-15-auth-cleanup-design.md
git commit -m "docs(spec): document the auth tiers follow-up

Extends the auth-cleanup spec with an 'Auth tiers (follow-up)'
section: the three modes ('none' / 'authenticated' / 'authorized'),
the AuthPolicy API, the per-mode behavior contract, the app-local
policy file convention, and a brief note on why policy isn't
env-driven in v1."
```

---

## Task 6: Add a "Choose an auth tier" subsection to `homelab-web-ui` SKILL.md

**Goal of this task:** Teach agents and humans how to pick a tier when scaffolding or editing a homelab app.

**Files:**
- Modify: `skills/homelab-web-ui/SKILL.md`

- [ ] **Step 1: Find the "Auth via Traefik" section**

That section was added by the prior cleanup. It currently teaches `requireUser`/`getUser` and the dev fallback. We're appending a subsection INSIDE this section, just before the "Deployment invariants:" paragraph (which should stay as the last paragraph of the section).

- [ ] **Step 2: Find the boundary text**

Locate the paragraph that begins:

```markdown
Deployment invariants: NetworkPolicy must restrict ingress to Traefik
```

This is currently the last paragraph of the "Auth via Traefik" section.

- [ ] **Step 3: Insert the subsection immediately BEFORE that paragraph**

Insert this content so it sits between the "Local dev:" paragraph and the "Deployment invariants:" paragraph:

```markdown

### Choose an auth tier

Every app declares its auth tier in `src/lib/server/auth-policy.ts`. The kit ships `mode: 'authenticated'`. Edit the file to switch.

- **No Auth** — `mode: 'none'`. Internal/low-risk apps where identity isn't required. The app may still see `event.locals.user` if Traefik provided headers, but it must not require it. `data.user` is `User | null` in the layout; render it conditionally.

- **Authenticated (default)** — `mode: 'authenticated'`. Any valid Pocket ID user may access the app. The root layout 401s without identity.

- **Authorized** — `mode: 'authorized'` plus at least one of `allowedGroups`, `allowedUsers`, `allowedSubs`. The root layout 401s without identity and 403s without a matching allowlist entry. With all three allowlists empty, the policy fails closed (403 for any user) — that's a configuration error and is intentional.

Match against `user.sub` (stable OIDC subject) for permanent allowlists, `user.username` for human-readable allowlists, or `user.groups` for group-based access.

```

- [ ] **Step 4: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add skills/homelab-web-ui/SKILL.md
git commit -m "docs(skills): teach the auth-tier choice in homelab-web-ui

Adds a 'Choose an auth tier' subsection inside the existing 'Auth
via Traefik' section. Explains the three modes, where to declare
the policy (auth-policy.ts), and which user field to match against
in the 'authorized' case."
```

---

## Task 7: CHANGELOG entry

**Goal of this task:** Note the new policy layer in the Unreleased section.

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Find the existing `## Unreleased` section**

It contains the "Breaking changes (auth)" subsection from the prior cleanup.

- [ ] **Step 2: Add a new subsection at the top of `## Unreleased`**

Insert this BEFORE the existing "Breaking changes (auth)" subsection (so it sits between `## Unreleased` and `### Breaking changes (auth)`):

```markdown
### Added

- Explicit auth policy tiers in the template (`none` / `authenticated` / `authorized`). The new `templates/app/src/lib/server/auth-policy.ts` declares the app's tier; the root layout enforces it via `requireAuthorizedUser`. Default is `mode: 'authenticated'` so a fresh scaffold behaves like the post-cleanup state. Apps switch to `'none'` for internal-only or `'authorized'` with `allowedGroups` / `allowedUsers` / `allowedSubs` for app-specific authorization. See the spec at `docs/superpowers/specs/2026-05-15-auth-cleanup-design.md` § "Auth tiers (follow-up)".

```

- [ ] **Step 3: Commit**

```bash
cd /Users/scott/Projects/web-ui
git add CHANGELOG.md
git commit -m "docs(changelog): note explicit auth policy tiers"
```

---

## Task 8: Final verification — probe all three modes

**Goal of this task:** Prove all three tiers behave per the spec. Temporarily edit `auth-policy.ts` for each non-default mode; revert after each probe so the file ends at its committed default.

**Files:** None modified. The temporary edits in this task are reverted via `git checkout` before completion.

- [ ] **Step 1: Confirm `auth-policy.ts` is at its committed default**

```bash
cd /Users/scott/Projects/web-ui
git status
```

Expected: clean working tree. If `auth-policy.ts` shows as modified, run `git checkout -- templates/app/src/lib/server/auth-policy.ts` and re-verify.

- [ ] **Step 2: Probe `mode: 'authenticated'` (default) — three sub-cases**

```bash
cd /Users/scott/Projects/web-ui/templates/app

echo "=== 2a: dev with WRIGHT_DEV_USER (should 200, foot=scott) ==="
WRIGHT_DEV_USER=scott bun run dev 2>&1 &
sleep 4
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/
curl -s http://localhost:5173/ | grep -oE '>scott<|>scott@dev.local<|>Internal<' | sort -u
pkill -f 'vite dev' 2>/dev/null
sleep 2

echo "=== 2b: preview without env or headers (should 401) ==="
WRIGHT_DEV_USER= bun run preview 2>&1 &
sleep 4
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/
pkill -f 'vite preview' 2>/dev/null
sleep 2

echo "=== 2c: preview with Remote-Sub + Remote-User (should 200) ==="
WRIGHT_DEV_USER= bun run preview 2>&1 &
sleep 4
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/ \
  -H 'Remote-Sub: sub-12345' \
  -H 'Remote-User: alice'
pkill -f 'vite preview' 2>/dev/null
sleep 2
```

Expected:
- 2a: `status=200`, foot probe shows `>scott<` and `>scott@dev.local<`, no `>Internal<`.
- 2b: `status=401`.
- 2c: `status=200`.

- [ ] **Step 3: Probe `mode: 'none'`**

The next three probes (this step plus steps 4 and 5) temporarily edit `auth-policy.ts`. `bun run preview` serves the LAST-BUILT production bundle, which has the committed-default policy baked in — temporary source edits would be invisible to it. Use `bun run dev` instead, which serves from source and picks up edits via Vite HMR. `WRIGHT_DEV_USER=` is set empty inline so the dev-user fallback can't accidentally populate identity for tests that need a null user.

Temporarily edit `templates/app/src/lib/server/auth-policy.ts` so the exported policy is:

```ts
export const authPolicy: AuthPolicy = {
  mode: 'none',
};
```

(Change ONLY the `mode` field. Keep the file's imports and JSDoc comment intact.)

Then probe:

```bash
cd /Users/scott/Projects/web-ui/templates/app

echo "=== 3: 'none' mode, no env, no headers (should 200, foot=Internal/No auth) ==="
WRIGHT_DEV_USER= bun run dev 2>&1 &
sleep 4
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/
curl -s http://localhost:5173/ | grep -oE '>scott<|>Internal<|>No auth<' | sort -u
pkill -f 'vite dev' 2>/dev/null
sleep 2
```

Expected: `status=200`, foot probe shows `>Internal<` and `>No auth<`, no `>scott<`.

Revert before the next probe:

```bash
cd /Users/scott/Projects/web-ui
git checkout -- templates/app/src/lib/server/auth-policy.ts
git status
```

Expected: clean working tree.

- [ ] **Step 4: Probe `mode: 'authorized'` — four sub-cases**

Temporarily edit `templates/app/src/lib/server/auth-policy.ts` so the policy is:

```ts
export const authPolicy: AuthPolicy = {
  mode: 'authorized',
  allowedGroups: ['admins'],
  allowedUsers: ['scott'],
  allowedSubs: ['sub-123'],
};
```

Then probe (using `bun run dev` for the same reason as Step 3):

```bash
cd /Users/scott/Projects/web-ui/templates/app
WRIGHT_DEV_USER= bun run dev 2>&1 &
sleep 4

echo "=== 4a: no identity (should 401) ==="
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/

echo "=== 4b: identity with no match (should 403) ==="
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/ \
  -H 'Remote-Sub: sub-other' \
  -H 'Remote-User: alice' \
  -H 'Remote-Groups: viewers'

echo "=== 4c: matching group 'admins' (should 200) ==="
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/ \
  -H 'Remote-Sub: sub-other' \
  -H 'Remote-User: alice' \
  -H 'Remote-Groups: admins'

echo "=== 4d: matching username 'scott' (should 200) ==="
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/ \
  -H 'Remote-Sub: sub-other' \
  -H 'Remote-User: scott' \
  -H 'Remote-Groups: viewers'

echo "=== 4e: matching sub 'sub-123' (should 200) ==="
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/ \
  -H 'Remote-Sub: sub-123' \
  -H 'Remote-User: alice' \
  -H 'Remote-Groups: viewers'

pkill -f 'vite dev' 2>/dev/null
sleep 2
```

Expected:
- 4a: `status=401`.
- 4b: `status=403`.
- 4c, 4d, 4e: `status=200`.

Revert:

```bash
cd /Users/scott/Projects/web-ui
git checkout -- templates/app/src/lib/server/auth-policy.ts
git status
```

Expected: clean working tree.

- [ ] **Step 5: Probe the fail-closed case for misconfigured `'authorized'`**

Temporarily edit `auth-policy.ts` to:

```ts
export const authPolicy: AuthPolicy = {
  mode: 'authorized',
  // No allowlist arrays configured.
};
```

```bash
cd /Users/scott/Projects/web-ui/templates/app
WRIGHT_DEV_USER= bun run dev 2>&1 &
sleep 4
echo "=== 5: 'authorized' with no allowlists (should 403 even with valid identity) ==="
curl -s -o /dev/null -w 'status=%{http_code}\n' http://localhost:5173/ \
  -H 'Remote-Sub: sub-12345' \
  -H 'Remote-User: scott' \
  -H 'Remote-Groups: admins'
pkill -f 'vite dev' 2>/dev/null
sleep 2
```

Expected: `status=403`. Fail-closed semantics confirmed.

Revert:

```bash
cd /Users/scott/Projects/web-ui
git checkout -- templates/app/src/lib/server/auth-policy.ts
git status
```

Expected: clean working tree. **Confirm the revert before Step 6** — the final build below must run against the committed default policy, not a leftover temporary policy.

- [ ] **Step 6: Final svelte-check + build**

```bash
cd /Users/scott/Projects/web-ui/templates/app && bun run check
cd /Users/scott/Projects/web-ui/templates/app && bun run build
```

Expected: `bun run check` → 0 errors, 4 pre-existing warnings; `bun run build` → `✔ done`. The build's compiled output will reflect the committed default `mode: 'authenticated'` policy (since the reverts above restored the file).

- [ ] **Step 7: Confirm git log**

```bash
cd /Users/scott/Projects/web-ui
git log --oneline -8
```

Expected sequence (most recent first):

1. `docs(changelog): note explicit auth policy tiers`
2. `docs(skills): teach the auth-tier choice in homelab-web-ui`
3. `docs(spec): document the auth tiers follow-up`
4. `feat(template): handle nullable data.user in foot snippet`
5. `feat(template): route root layout through authPolicy`
6. `feat(template): add app-local auth-policy.ts (defaults to authenticated)`
7. `feat(template): add AuthPolicy type and authorize helpers`

Plus the prior auth-cleanup commits visible further back.

---

## Out of scope (deferred — do not implement)

Documented in the originating brief's constraints. Do not add any of these in this plan:

- Env-driven policy (`AUTH_MODE=...`, `ALLOWED_GROUPS=...`). A typed app-local file earns its place better in v1.
- Logout, sessions, cookies, OAuth client, HMAC-signed identity headers — all owned by Pocket ID + Traefik + TinyAuth at the edge.
- An admin UI to edit policy. The policy file is edited in the app's repo and reviewed in PR.
- Moving policy into `@wright/ui`. Policy is per-app server behavior, not UI-kit behavior.
- A `requireGroup('admins')` helper layered on top — the existing `user.groups.includes(...)` is sufficient until two apps independently need the same group-check shape.
- Per-route policy (different tiers for different pages/routes). The current shape is a single app-wide policy. If a future app needs per-route policy, a `getRoutePolicy(event.url.pathname)` indirection can be added without changing the existing `AuthPolicy` shape.
- Weakening the Traefik scrub-headers rollout gate. That gate (homelab issue #645) protects the underlying header-trust model; policy tiers sit above it and depend on it.

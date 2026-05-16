---
name: homelab-web-backend-bridge
description: Use when a SvelteKit app needs to talk to a backend service (FastAPI, Hono, anything HTTP). One rule: SvelteKit is the public face, the backend is internal. Calls happen server-side from `load`/actions, never browser-to-backend. Covers the typed `apiFetch` wrapper, Zod boundary validation, the error envelope shape, explicit identity forwarding when a backend needs it, and conservative timeout/retry defaults.
---

# `homelab-web-backend-bridge`

One job: **the SvelteKit app is the public face; the backend service is
internal**. No browser-to-Python (or browser-to-Hono) calls. Every
upstream call goes through a `load` function or a form action,
server-side, with a typed boundary.

## Why this matters

- No CORS dependency to chase. The browser never talks to the backend
  directly.
- The backend can live on a private network, behind WireGuard, or on
  localhost without ever needing public exposure.
- The backend trusts SvelteKit-originated calls (network-isolated by NetworkPolicy; SvelteKit is the only client). It does not receive user identity by default; the SvelteKit route handler is the auth boundary.
- Boundary validation with Zod catches upstream schema drift at the
  edge instead of letting bad data poison the page.

## The shape: `src/lib/server/api.ts`

Every consuming app gets one small wrapper. This is the minimal version:

```ts
// src/lib/server/api.ts
import { error } from '@sveltejs/kit';
import { z } from 'zod';

// Internal-only base URL. Set via env or hardcode the cluster DNS name.
const API_BASE = process.env.API_BASE ?? 'http://paperless:8000';

const DEFAULT_TIMEOUT_MS = 5000;

export type ApiErrorBody = {
  /** Short machine-readable code, e.g. "not_found", "validation_failed". */
  code?: string;
  /** Human-readable message shown to users only as a fallback. */
  message?: string;
  /** Optional structured detail — field errors, retry hints, etc. */
  detail?: unknown;
};

export type ApiOptions = RequestInit & {
  /** Override the default 5s timeout. Keep it short. */
  timeoutMs?: number;
};

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  init: ApiOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = init.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(init.headers);
    headers.set('accept', 'application/json');

    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as ApiErrorBody | null;
      // Surface the upstream code so the SvelteKit error page or form
      // handler can branch on it. Never expose the full upstream URL.
      error(res.status, body?.message ?? `Upstream returned ${res.status}.`);
    }

    const raw = await res.json();
    return schema.parse(raw); // Zod boundary check
  } finally {
    clearTimeout(timer);
  }
}
```

## Using it in a load function

```ts
// src/routes/queue/[id]/+page.server.ts
import { z } from 'zod';
import { apiFetch } from '$lib/server/api';
import { requireUser } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

const DocSchema = z.object({
  id: z.string(),
  // ... other fields ...
});

export const load: PageServerLoad = async (event) => {
  const user = requireUser(event);
  const doc = await apiFetch(`/api/docs/${event.params.id}`, DocSchema, {
    headers: { 'X-Internal-User': user.sub },
  });
  return { doc };
};
```

`X-Internal-User` is a convention taught by this skill, not a kit constant. The backend treats it as audit metadata, not authorization input — authorization is enforced at the SvelteKit layer by `requireUser` + group checks.

If the upstream returns a 404, `error(404, ...)` throws and SvelteKit
renders the closest `+error.svelte`. If the upstream returns a 500 or
the schema fails, same path — the consumer never sees a broken page.

## Error envelope (shared expectation)

Every backend in the homelab returns errors in the same shape:

```json
{
  "code": "not_found",
  "message": "Document 1842 was archived.",
  "detail": { "id": "1842", "archived_at": "2026-04-22T..." }
}
```

`code` is short and stable; `message` is for humans; `detail` is
optional structured context. Backends that don't yet conform to this
shape are wrapped (or fixed). The SvelteKit error page reads `code`
when it needs to branch.

## Auth & headers

- Backend services receive no identity header by default. Apps that need to log "who did this" in the backend forward `X-Internal-User: <user.sub>` explicitly from the SvelteKit route handler.
- Never compute identity in `+page.svelte` and pass it as a prop. The browser is a fundamentally untrusted client; identity is established by `hooks.server.ts` and propagated through `event.locals`.

## Timeouts & retries

Be conservative. The default 5s timeout is fine for most reads;
long-running operations (large queries, scrapes, OCR) should be a
**job** (see the polling pattern in `homelab-web-ui`), not a sync
fetch.

**Don't retry by default.** Retries hide transient bugs and amplify
load when the upstream is already struggling. Pin retries to the
specific places where the operation is idempotent and the failure
mode is known (network blip on a read). When you do add retries:

- Idempotent reads only (GET).
- One retry. Don't loop.
- Exponential backoff is overkill at homelab scale; a fixed 250ms is
  enough.
- Never retry writes (POST/PATCH/DELETE).

## What goes in `+page.server.ts` vs `+server.ts`

- **`+page.server.ts`**: load the data a page needs. The default home.
- **`+server.ts`**: stand-alone JSON endpoints for the client to poll
  or stream from. Useful when polling (`depends()` + `invalidate()` is
  easier) doesn't cover the case — e.g. SSE.

In both cases, the wrapper goes through `apiFetch` and the backend
URL never leaks to the browser.

## When to bypass this

Almost never. Two exceptions:

1. **Public read-only data** that's safe for the browser to fetch
   directly (a public RSS feed, a non-authenticated CDN asset). Even
   then, prefer fetching server-side and forwarding — keeps the
   browser dependency surface small.
2. **WebSocket / SSE** streams where SvelteKit's `+server.ts` proxy
   would add unwelcome latency. Use these sparingly; polling via the
   `homelab-web-ui` pattern handles 95% of "live data" needs.

## Reference

- Auth helper: `templates/app/src/lib/server/auth.ts`
- Polling pattern: `homelab-web-ui` skill, §"Polling"
- Backend integration table: strategy spec, §"Backend Integration Pattern"

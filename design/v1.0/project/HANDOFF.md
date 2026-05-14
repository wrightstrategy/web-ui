# Wright Family UI · Handoff to Claude Code

**Status:** Design v1.0 complete · ready to scaffold.
**Source of truth:** `Wright UI System.html` in this project.
**Strategy doc:** `uploads/2026-05-14-web-ui-strategy-design.md`.

When this and the canvas diverge, the canvas wins until the canvas is updated.

---

## 1. Start here

Open `Wright UI System.html` and walk the canvas top-to-bottom:

1. **Brand** — Stencil bar mark + lockups
2. **Tokens** — every CSS custom property the kit ships
3. **Components** — 13 foundational components with full variants
4. **Page recipes** — desktop + mobile, every page shape an app needs
5. **States** — loading / empty / error
6. **Auth conventions** — what the kit ships (stubs, not infra)
7. **Polish** — app-letter marks, charts, mobile-first proof, icons, motion, print
8. **Status** — v1.0 sign-off + this handoff

Every value (hex, px, ms, line) in the canvas is intentional. Don't round to nicer numbers.

---

## 2. What to scaffold first (vertical slice)

Build in this order. Each step is independently testable.

### Step 1 · `packages/ui` skeleton

```
packages/ui/
├── package.json                 # name: "@wright/ui"
├── src/lib/
│   ├── theme/
│   │   ├── tokens.css           # ← paste from /tokens.css (this project)
│   │   ├── styles.css           # base reset + component CSS — derive from /shared/base.css
│   │   └── tailwind-preset.js   # map utilities to tokens
│   ├── components/              # 13 foundational components (see below)
│   ├── layout/
│   │   ├── AppShell.svelte
│   │   └── PageHeader.svelte
│   ├── icons/                   # Lucide re-exports + custom glyphs
│   └── index.ts
└── README.md
```

Static assets that ship with the kit:
- `static/wright.svg`, `static/sentinel.svg`, etc. — from `/assets/marks/`
- `static/favicon.svg` — from `/assets/favicon.svg`
- `static/app-icons/*.svg` — from `/assets/app-icons/`

### Step 2 · The 13 components

Build in this order (low-friction → high-friction):

| # | Component   | Notes |
|---|-------------|-------|
| 1 | Button      | 4 tones × 3 sizes × states (default/hover/active/disabled/loading). Min height 44px. |
| 2 | Badge       | 6 tones (default/ok/warn/err/info/accent). Optional leading dot. |
| 3 | Card        | Standard + dashed + accent variants. Slot-based. |
| 4 | Input       | Default/focus/error/disabled. Affix slots for icon + suffix. |
| 5 | FormField   | Wraps label + input + hint/error. Pairs with Superforms. |
| 6 | Select      | Native `<select>` styled to match Input. |
| 7 | Checkbox    | 16px box with check glyph. Min hit area 32px. |
| 8 | Table       | Mono caps headers, hover row, tabular numerals via `.tnum`. |
| 9 | Tabs        | Underline tabs, 44px tap height, accent active border. |
| 10 | Modal      | Backdrop + dialog, focus trap, esc to close. |
| 11 | Toast      | Stack at top-right desktop / top mobile. Left border by tone. |
| 12 | AppShell   | Sidebar + main grid. Collapses to bottom tab bar < 768px. |
| 13 | PageHeader | Crumbs + title + badges + actions + optional tabs row. |

### Step 3 · 7 page recipes in `templates/app/`

Match each route to its canvas artboard:

| Route                          | Canvas artboard                  |
|--------------------------------|----------------------------------|
| `/+page.svelte`                | `sentinel` — Sentinel overview   |
| `/queue/+page.svelte`          | `paperless` — Paperless queue    |
| `/queue/[id]/+page.svelte`     | `detail` — Detail page           |
| `/queue/[id]/edit/+page.svelte`| `edit` — Form / edit             |
| `/settings/+page.svelte`       | `settings` — Settings (sectioned)|
| `/operations/[id]/+page.svelte`| `async` — Async / job status     |
| `/login/+page.svelte`          | `login` — Login (+ error)        |
| `/triage/+page.svelte`         | `mobile-triage` — Mobile triage  |

Each route also needs `csr = false` if the page has no row-level interactivity, per the render-mode rule in the strategy doc.

### Step 4 · `packages/create-app`

A tiny scaffolder that copies `templates/app/` and rewrites the package name. Use Bun's templating, no extra deps.

### Step 5 · Skills (`skills/`)

Three markdown skills:
- `homelab-web-ui` — primary; render-mode decision tree + recipe map + mobile checklist
- `homelab-web-backend-bridge` — SvelteKit ↔ FastAPI patterns
- `homelab-web-component-add` — earn-its-place promotion rule

### Step 6 · Throwaway proof app

Use the scaffolder to spin up `~/Projects/wright-ui-proof/`. Verify it boots, the dashboard renders, theme toggle works, and the mobile smoke check passes (44px targets, focus rings, no horizontal scroll at 375px).

---

## 3. Smoke-test checklist (must pass before merging the kit)

Run these against `templates/app/` after Step 3:

- [ ] Mobile dashboard renders at 375px width with no horizontal scroll
- [ ] Every interactive control measures ≥44px in DevTools mobile emulation
- [ ] Tab through the form page — every input shows the 3px brick focus ring
- [ ] Theme toggle on `<html>` swaps dark↔light without flashing
- [ ] `csr = false` table page works with JS disabled
- [ ] Mark renders correctly at favicon (16px) and app-icon (1024px) sizes
- [ ] Print preview of the detail page matches the canvas print artboard
- [ ] View Transitions animate page navigation when JS is on
- [ ] Reduced motion preference disables all transitions
- [ ] No unresolved `var(--*)` references in DevTools

---

## 4. Recipe → render-mode cheatsheet

Per the strategy doc; the primary skill teaches this in detail.

| Recipe              | Render mode      | Why |
|---------------------|------------------|-----|
| Dashboard           | default (SSR+CSR)| Live data, sparklines refresh, briefing scroll |
| Table / queue       | `csr = false`    | Pure data display, no row interactivity needed |
| Detail              | default          | Tabs, actions, lazy preview |
| Form / edit         | default          | Superforms validation needs hydration |
| Settings            | default          | Toggles, save-as-you-go |
| Async / job status  | default          | Polling / SSE |
| Login               | `csr = false`    | Form submit → server action; no client state |
| Mobile triage       | default          | Swipe interactions |

---

## 5. Files to copy from this project

Direct copies into the new `web-ui/` repo:

| From this project              | To web-ui repo                                         |
|--------------------------------|--------------------------------------------------------|
| `tokens.css`                   | `packages/ui/src/lib/theme/tokens.css`                 |
| `shared/base.css` (component layer) | `packages/ui/src/lib/theme/styles.css` (split out token block) |
| `assets/marks/*.svg`           | `packages/ui/src/lib/brand/` and `templates/app/static/` |
| `assets/favicon.svg`           | `templates/app/static/favicon.svg`                      |
| `assets/app-icons/*.svg`       | `templates/app/static/app-icons/`                       |
| `assets/social/og-*.svg`       | `templates/app/static/social/`                          |

The JSX files (`*.jsx`) in this project are **visual reference only**. Re-author each component as native Svelte 5 with the same DOM shape and class names; don't translate JSX mechanically.

---

## 6. Open questions deferred

From the strategy doc, still open after v1.0:
- **Forgejo npm registry vs. workspace-only distribution.** Default workspace-only; revisit when a consumer lives outside `~/Projects/`.
- **Chart library blessing.** Per-app for now. Add `--chart-*` tokens are in `tokens.css` so any library can be themed.
- **Theme switcher component.** App-local until two apps need it.

---

**Last thing:** the canvas IS the spec. If a component looks subtly different in code, the code is wrong. PR back to design only if a token/recipe is genuinely impractical in Svelte — otherwise match the canvas exactly.

🤠 — Scott

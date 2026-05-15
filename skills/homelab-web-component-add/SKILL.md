---
name: homelab-web-component-add
description: Use when deciding where new UI code belongs — app-local (recipe `<style>` block), or promoted to `@wright/ui`. Covers the earn-its-place rule (no kit additions before 2-app reuse), the component-vs-recipe decision tree, required exports from `packages/ui/src/lib/index.ts`, CSS/tokens placement, the quality gate checklist, and prop-API discipline (no app-specific nouns in generic components).
---

# `homelab-web-component-add`

The kit grows slowly on purpose. Most "I need a new component" turns
out to be "I need a new page" or "I need a new bit of recipe-local
CSS." This skill keeps the kit from becoming a graveyard of one-off
abstractions.

## The earn-its-place rule

A component or token enters `@wright/ui` only when **both** are true:

1. **It's used by at least two apps** (or two recipes that aren't
   variants of the same page).
2. **Its prop API is generic** — no app-specific nouns
   (`onArchive`, `paperlessSource`, `sentinelSeverity`), only abstract
   ones (`onConfirm`, `source`, `tone`).

If only one is true, keep the code app-local. Build it in the recipe's
`<style>` block or as an app-local Svelte file under `src/lib/components/`.
Promote later when the second use case proves the shape.

## Component vs recipe — pick the right home

```
Is the thing you're building…

  page-shaped?                            → recipe
  (own route, owns its own load + actions)  templates/app/src/routes/...

  widget-shaped, used 2+ times across     → kit component
  apps, with a generic API?                 packages/ui/src/lib/components/

  widget-shaped, used 2+ times across     → kit layout
  apps, but it shapes the page itself       packages/ui/src/lib/layout/
  (shell, header, sidebar)?

  one-off styling for this page only?     → recipe `<style>` block

  one-off Svelte component for one app?   → app-local
                                            <consumer>/src/lib/components/

  pattern that documents an approach,     → skill
  not code that runs?                       web-ui/skills/...
```

When in doubt: **start app-local**. Promotion is cheap; un-promotion is
not.

## Where things live

```
packages/ui/src/lib/
├── components/      Widget-shaped primitives: Button, Badge, Card, …
├── layout/          Page-shaping primitives: AppShell, PageHeader
├── theme/
│   ├── tokens.css   CSS variables — colors, type, space, radius, shadow
│   └── styles.css   Reset + component CSS classes (.wf-card, .wf-btn, …)
├── icons/           Lucide re-exports + any custom glyphs
└── index.ts         Public surface — every export the kit ships
```

Rules:
- Tokens (any `--`-prefixed CSS variable) go in `tokens.css`. Never
  inline hex anywhere.
- Component CSS (`.wf-foo`, `.wf-foo-bar`) goes in `styles.css`. Keep
  the wf-prefix discipline.
- Each Svelte component lives in its own file, named in PascalCase.
- Every public component is re-exported from `index.ts`.

## Required exports

When you promote a component, update `packages/ui/src/lib/index.ts`:

```ts
export { default as Foo } from './components/Foo.svelte';
// Export named types from the component's module block if it has any:
export type { FooTone, FooSize } from './components/Foo.svelte';
```

Use the `<script lang="ts" module>` block at the top of the component
file for types and constants that consumers need:

```svelte
<script lang="ts" module>
  export type FooTone = 'default' | 'ok' | 'warn' | 'err';
</script>

<script lang="ts">
  type Props = {
    tone?: FooTone;
    /* ... */
  };
  let { tone = 'default' }: Props = $props();
</script>
```

## Prop-API discipline

The kit's value is that its API is small, abstract, and stable. Drift
that surface and the next app starts patching around it.

- **Abstract names.** `tone`, `size`, `variant`, `intent` — not
  `severity`, `loglevel`, `priority`. The app maps its noun to the
  kit's abstract one at the call site.
- **`Snippet` for slot-like content.** Use Svelte 5 `Snippet` props for
  `children`, `actions`, `head`, etc. Don't reinvent slots.
- **`$bindable()` for two-way values.** Inputs that have `value`,
  Modals that have `open`, Tabs that have a selected value.
- **Pass-through `...rest`.** Components that wrap a native element
  (Button, Input, Select, Table, Modal) accept the corresponding
  `HTMLAttributes` and spread `...rest` so consumers can add `data-*`,
  `aria-*`, `id`, etc. without escape hatches.
- **No app-specific tones.** If your app needs a "sentinel-incident-red"
  badge, that's an app-local Badge wrapper, not a new kit tone.

## Quality gate (before merging to kit)

Every component admitted to `@wright/ui` clears all seven:

- [ ] **Mobile example at 375px.** Render in the template app's recipe
      list or in the design docs. No clipping, no overflow.
- [ ] **Keyboard navigation.** Tab order is sensible. For interactive
      groups (tabs, dialogs), arrow keys / Escape / Home / End where
      the WAI-ARIA pattern expects them.
- [ ] **Visible focus state.** `:focus-visible` rule using the
      `--focus-ring` token (or equivalent box-shadow). Browser-default
      outline isn't enough.
- [ ] **Tap targets ≥44px.** Interactive surfaces measure ≥44px on
      mobile (52px for primary touch actions like the triage buttons).
- [ ] **No hover-only affordances.** Every hover state has a tap or
      focus equivalent.
- [ ] **Light + dark.** Renders correctly in both `data-theme` modes;
      no hardcoded colors that break the dark/light switch.
- [ ] **Template smoke route.** A route in `templates/app` exercises
      the component end-to-end. If no recipe naturally uses it,
      something is off — recheck whether it belongs in the kit at all.

## Promotion mechanics

When the second app needs the same component and you've decided it
earns its place:

1. **Lift the code** from the app-local location into
   `packages/ui/src/lib/components/<Name>.svelte`.
2. **Move the CSS** from the recipe's `<style>` block into
   `packages/ui/src/lib/theme/styles.css`, renaming classes to the
   `wf-`-prefixed kit convention.
3. **Audit prop names** for app-specific leakage. Rename to abstract
   ones; the apps map their nouns at the call site.
4. **Add the export** to `packages/ui/src/lib/index.ts`. Export types
   from the component's `module` block too.
5. **Add a recipe route** that exercises it (or extend an existing
   route to use it).
6. **Run the quality-gate checklist** above. Don't skip the 375px
   check.
7. **Update both consuming apps** to import from `@wright/ui`. Delete
   the duplicate app-local copies.

## Don't grow the kit for…

- **Pages.** Pages are recipes. The kit doesn't ship `<DashboardPage>`.
- **App-specific business logic.** Sentinel's incident triage table is
  Sentinel's, not the kit's. The kit ships `<Table>` and the recipe
  uses it.
- **Speculative reuse.** "We might need this elsewhere later" is not
  the same as "we're using this elsewhere right now."

## Reference

- Strategy spec: `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md`
  §"Quality Gate" and §"Pinned conventions"
- Existing kit components for prop-API reference:
  `packages/ui/src/lib/components/{Button,Badge,Card,Input,Modal,Tabs}.svelte`
- Tokens: `packages/ui/src/lib/theme/tokens.css`

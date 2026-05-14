# Wright Family Web UI

Shared UI spine for homelab apps. A small kit of semantic tokens, components,
page recipes, and agent skills — so every new app stops reinventing the wheel.

## Layout

```
web-ui/
├── packages/
│   ├── ui/                # @wright/ui — Svelte 5 component library
│   └── create-app/        # local scaffolder for new apps
├── templates/
│   └── app/               # canonical SvelteKit template (source of truth)
├── design/
│   └── v1.0/              # design handoff bundle (canvas wins)
├── docs/
│   └── superpowers/specs/ # strategy spec
└── skills/                # agent skills (symlinked to ~/.claude/)
```

## Strategy

See `docs/superpowers/specs/2026-05-14-web-ui-strategy-design.md` for the
high-level approach. See `design/v1.0/project/HANDOFF.md` for the
implementation plan and `design/v1.0/project/Wright UI System.html` for the
canonical design canvas. When the canvas and code diverge, the canvas wins.

## Stack

Bun + SvelteKit + Svelte 5. Components ship as source `.svelte` files.
Workspace consumers depend on `@wright/ui` via the Bun workspace protocol.

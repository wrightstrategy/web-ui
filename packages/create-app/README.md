# @wright/create-app

Scaffolds a new SvelteKit app from `templates/app` and wires it up to
consume `@wright/ui`. The local-invocation form is canonical today; the
polished `bun create @wright/app <name>` form arrives once distribution
is solved.

## Usage

From the workspace root:

```bash
bun run create-app ~/Projects/my-new-app
```

Or directly:

```bash
bun packages/create-app/cli.ts ~/Projects/my-new-app
```

### Flags

- `--name, -n` — package name for the new app's `package.json`. Defaults
  to `@wright/<basename of target>`.
- `--force, -f` — allow scaffolding into a non-empty directory.
- `--help, -h` — print usage.

## What it does

1. Refuses to scaffold into a non-empty directory unless `--force` is
   passed. `.git` and `.DS_Store` are ignored when checking emptiness.
2. Copies `templates/app/` to the target, skipping build artifacts
   (`node_modules`, `.svelte-kit`, `build`, `dist`, `.vite`).
3. Rewrites `package.json`:
   - `name` becomes the requested name (or auto-generated).
   - `@wright/ui` dependency stays `workspace:*` when the target is
     inside the `web-ui` workspace, otherwise rewrites to a relative
     `file:` path back to `packages/ui` so the dep stays editable.
4. Prints next steps (`bun install`, `bun run check`, `bun run dev`)
   and the seven recipe URLs to walk.

## Out-of-workspace targets

When the target lives outside the `web-ui` repo, `@wright/ui` is wired
as a `file:` dependency with a relative path. Bun symlinks file: deps,
so editing the kit is reflected immediately in the consuming app
during development. No registry publish required.

## Future: `bun create @wright/app`

Once `@wright/create-app` is published (Forgejo npm or otherwise), the
canonical form will be:

```bash
bun create @wright/app ~/Projects/my-new-app
```

That's the same code path behind a published entry point — apps don't
need to change anything.

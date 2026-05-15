#!/usr/bin/env bun
/*
 * @wright/create-app
 *
 * Copies templates/app into a target directory and wires it up as a new
 * SvelteKit app that consumes @wright/ui. Two consumer modes:
 *
 *   1. Inside the web-ui workspace (e.g. templates/foo) — keeps
 *      "@wright/ui": "workspace:*"
 *   2. Outside the workspace (e.g. ~/Projects/my-app) — rewrites to a
 *      file: dependency with a relative path back to packages/ui.
 *
 * The local invocation today is:
 *
 *   bun packages/create-app/cli.ts <target> [--name <pkg>] [--force]
 *
 * or via the root workspace script:
 *
 *   bun run create-app <target>
 *
 * Once distribution is solved, the canonical form will be
 * `bun create @wright/app <target>` and the implementation here moves
 * behind that surface unchanged.
 */

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_UI_ROOT = resolve(__dirname, '../..');
const TEMPLATE_DIR = resolve(WEB_UI_ROOT, 'templates/app');
const UI_PKG_DIR = resolve(WEB_UI_ROOT, 'packages/ui');

type Args = {
  target?: string;
  name?: string;
  force: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): Args {
  const out: Args = { force: false, help: false };
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--force' || a === '-f') out.force = true;
    else if (a === '--help' || a === '-h') out.help = true;
    else if (a === '--name' || a === '-n') out.name = args[++i];
    else if (!a.startsWith('-') && !out.target) out.target = a;
    else {
      console.error(`Unknown argument: ${a}`);
      out.help = true;
    }
  }
  return out;
}

function printHelp(): void {
  console.log(`
@wright/create-app — scaffold a new Wright UI app

Usage:
  bun packages/create-app/cli.ts <target> [--name <pkg-name>] [--force]
  bun run create-app <target>

Arguments:
  <target>         Path where the new app will be created.
                   Supports ~ expansion (e.g. ~/Projects/my-app).

Options:
  --name, -n       Package name in the new app's package.json.
                   Defaults to "@wright/<basename of target>".
  --force, -f      Allow scaffolding into a non-empty directory.
  --help, -h       Print this help.

Examples:
  bun packages/create-app/cli.ts ~/Projects/wright-ui-proof
  bun packages/create-app/cli.ts ./templates/dashboard --name dashboard
`.trim());
}

function expandHome(p: string): string {
  return p === '~' ? homedir() : p.startsWith('~/') ? resolve(homedir(), p.slice(2)) : p;
}

function isInsideWorkspace(target: string): boolean {
  const t = target.endsWith('/') ? target : target + '/';
  const root = WEB_UI_ROOT.endsWith('/') ? WEB_UI_ROOT : WEB_UI_ROOT + '/';
  return t.startsWith(root);
}

function looksEmpty(dir: string): boolean {
  if (!existsSync(dir)) return true;
  const entries = readdirSync(dir).filter((e) => e !== '.git' && e !== '.DS_Store');
  return entries.length === 0;
}

const IGNORED = new Set(['node_modules', '.svelte-kit', 'build', 'dist', '.vite', '.DS_Store']);

function copyTemplate(src: string, dst: string): void {
  cpSync(src, dst, {
    recursive: true,
    filter: (s) => {
      const rel = relative(src, s);
      if (rel === '') return true;
      const parts = rel.split('/');
      return !parts.some((p) => IGNORED.has(p));
    },
  });
}

function rewritePackageJson(pkgPath: string, name: string, insideWorkspace: boolean, targetAbs: string): void {
  const raw = readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw) as {
    name?: string;
    dependencies?: Record<string, string>;
    [key: string]: unknown;
  };
  pkg.name = name;
  if (!insideWorkspace && pkg.dependencies?.['@wright/ui'] === 'workspace:*') {
    // Use a relative file: path so the dep is hoistable and editable
    // in place; absolute paths would break if either repo moves.
    const relPath = relative(targetAbs, UI_PKG_DIR);
    pkg.dependencies['@wright/ui'] = `file:${relPath}`;
  }
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

// ─── main ────────────────────────────────────────────────────────────

const args = parseArgs(process.argv);

if (args.help) {
  printHelp();
  process.exit(0);
}
if (!args.target) {
  printHelp();
  process.exit(1);
}

const targetAbs = resolve(process.cwd(), expandHome(args.target));
const pkgName = args.name ?? `@wright/${basename(targetAbs)}`;

if (!looksEmpty(targetAbs) && !args.force) {
  console.error(
    `Error: ${targetAbs} is not empty.\n` +
      `       Pass --force to scaffold over the existing contents (use cautiously).`
  );
  process.exit(1);
}

mkdirSync(targetAbs, { recursive: true });
copyTemplate(TEMPLATE_DIR, targetAbs);

const insideWorkspace = isInsideWorkspace(targetAbs);
rewritePackageJson(resolve(targetAbs, 'package.json'), pkgName, insideWorkspace, targetAbs);

console.log(`
✓ Created ${pkgName}
  at: ${targetAbs}
  @wright/ui dep: ${insideWorkspace ? 'workspace:*' : `file:${relative(targetAbs, UI_PKG_DIR)}`}

Next steps:
  cd ${args.target}
  bun install
  bun run check     # type-check the scaffold
  bun run dev       # start the dev server at http://localhost:5173

Then walk these recipes to confirm:
  http://localhost:5173/                       Dashboard (Cards, Modal, Toast)
  http://localhost:5173/queue                  Server-rendered table (csr=false)
  http://localhost:5173/queue/DOC-1842/edit    Superforms + Zod
  http://localhost:5173/settings               Multi-form page
  http://localhost:5173/operations/OP-9012     Polling + log
  http://localhost:5173/triage                 Mobile-first card stack
  http://localhost:5173/login                  Stub auth
`.trim());

import { compile } from 'svelte/compiler';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

function walk(root: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    if (statSync(path).isDirectory()) {
      out.push(...walk(path));
    } else if (entry.endsWith('.svelte')) {
      out.push(path);
    }
  }
  return out;
}

let bad = 0;
for (const path of walk('src/lib')) {
  const src = readFileSync(path, 'utf8');
  try {
    const r = compile(src, { generate: 'client', dev: false });
    const w = r.warnings ?? [];
    console.log(path.padEnd(40), w.length ? `WARNINGS(${w.length})` : 'clean');
    for (const x of w) console.log('   -', x.message);
  } catch (e) {
    console.log(path.padEnd(40), 'COMPILE ERROR');
    console.log('   ', (e as Error).message.split('\n')[0]);
    bad++;
  }
}
process.exit(bad ? 1 : 0);

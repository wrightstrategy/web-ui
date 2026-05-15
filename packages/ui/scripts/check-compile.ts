import { compile } from 'svelte/compiler';
import { readdirSync, readFileSync } from 'fs';

const dir = 'src/lib/components';
let bad = 0;
for (const f of readdirSync(dir).filter((n) => n.endsWith('.svelte'))) {
  const src = readFileSync(`${dir}/${f}`, 'utf8');
  try {
    const r = compile(src, { generate: 'client', dev: false });
    const w = r.warnings ?? [];
    console.log(f.padEnd(20), w.length ? `WARNINGS(${w.length})` : 'clean');
    for (const x of w) console.log('   -', x.message);
  } catch (e) {
    console.log(f.padEnd(20), 'COMPILE ERROR');
    console.log('   ', (e as Error).message.split('\n')[0]);
    bad++;
  }
}
process.exit(bad ? 1 : 0);

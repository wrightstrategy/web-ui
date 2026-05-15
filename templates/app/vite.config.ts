import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    // Critical for Bun workspaces: packages/ui has its own svelte dep and
    // sveltekit-superforms has its own — without dedupe, two copies of
    // Svelte's runtime load, and Superforms' onDestroy() runs against a
    // different lifecycle instance than the page's component, throwing
    // "lifecycle_outside_component" and breaking form-state subscription.
    dedupe: ['svelte'],
  },
  optimizeDeps: {
    // Force Vite to pre-bundle Superforms alongside the app's other deps
    // so it shares the same Svelte instance.
    include: ['sveltekit-superforms', 'sveltekit-superforms/client'],
    // Force re-optimization so stale "?v=" pre-bundle hashes don't leave
    // a second Svelte runtime hanging around in the dev server's deps cache.
    force: true,
  },
  ssr: {
    // Superforms ships .svelte files (SuperDebug). Bundling for SSR so
    // Vite transforms them instead of letting Node try to import a
    // .svelte extension directly.
    noExternal: ['sveltekit-superforms'],
  },
});

<script lang="ts" module>
  export type Crumb = {
    /** Omit href on the trailing crumb to render it as plain text. */
    href?: string;
    label: string;
  };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    title: string;
    crumbs?: Crumb[];
    badges?: Snippet;
    actions?: Snippet;
    tabs?: Snippet;
    /** Optional suffix joined to the document title with " · ". Apps that
        want a global suffix can set it on PageHeader instances. */
    titleSuffix?: string;
  };

  let { title, crumbs = [], badges, actions, tabs, titleSuffix }: Props = $props();
</script>

<svelte:head>
  <title>{titleSuffix ? `${title} · ${titleSuffix}` : title}</title>
</svelte:head>

<header class="wf-topbar">
  {#if crumbs.length > 0}
    <nav class="wf-crumb" aria-label="Breadcrumb">
      {#each crumbs as c, i (i)}
        {#if i > 0}<span aria-hidden="true"> › </span>{/if}
        {#if c.href}<a href={c.href}>{c.label}</a>{:else}<span>{c.label}</span>{/if}
      {/each}
    </nav>
  {/if}
  <h1>{title}</h1>
  {#if badges}
    <div class="wf-pageheader-badges">{@render badges()}</div>
  {/if}
  <div class="wf-spacer"></div>
  {#if actions}
    <div class="wf-pageheader-actions">{@render actions()}</div>
  {/if}
</header>
{#if tabs}
  <div class="wf-pageheader-tabs">{@render tabs()}</div>
{/if}

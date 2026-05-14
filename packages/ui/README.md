# @wright/ui

Shared UI kit for Wright Family homelab apps. Svelte 5 components on top of
canonical semantic tokens.

## Usage

```ts
// In a SvelteKit app's root +layout.svelte:
import '@wright/ui/tokens.css';
import '@wright/ui/styles.css';

import { Button } from '@wright/ui';
```

Theme is controlled by a `data-theme` attribute on `<html>`:

```html
<html data-theme="dark">  <!-- default -->
<html data-theme="light"> <!-- inverted -->
```

Apps either wrap their top-level container with `class="wf-root"` or use the
`AppShell` component, which applies it automatically.

## Source of truth

The canvas at `design/v1.0/project/Wright UI System.html` is the visual spec.
If a component looks subtly different in code, the code is wrong.

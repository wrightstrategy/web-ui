<script lang="ts">
  import { tick, type Snippet } from 'svelte';

  type Size = 'sm' | 'md' | 'lg';

  type Props = {
    open?: boolean;
    onClose?: () => void;
    title: string;
    description?: string;
    size?: Size;
    closeOnEscape?: boolean;
    closeOnOutsideClick?: boolean;
    children?: Snippet;
    actions?: Snippet;
  };

  let {
    open = $bindable(false),
    onClose,
    title,
    description,
    size = 'md',
    closeOnEscape = true,
    closeOnOutsideClick = true,
    children,
    actions,
  }: Props = $props();

  let dialogEl: HTMLDivElement | undefined = $state();
  let previousFocus: HTMLElement | null = null;
  const titleId = `wf-modal-title-${Math.random().toString(36).slice(2, 10)}`;
  const descId = `wf-modal-desc-${Math.random().toString(36).slice(2, 10)}`;

  function close() {
    open = false;
    onClose?.();
  }

  function getFocusables(): HTMLElement[] {
    if (!dialogEl) return [];
    const sel =
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(dialogEl.querySelectorAll<HTMLElement>(sel));
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && closeOnEscape) {
      e.stopPropagation();
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const list = getFocusables();
    if (list.length === 0) {
      e.preventDefault();
      return;
    }
    const first = list[0];
    const last = list[list.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || (active && !list.includes(active))) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || (active && !list.includes(active))) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onBackdropClick(e: MouseEvent) {
    if (!closeOnOutsideClick) return;
    if (e.target === e.currentTarget) close();
  }

  $effect(() => {
    if (!open) return;

    previousFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    tick().then(() => {
      const list = getFocusables();
      const target =
        list.find((el) => !el.classList.contains('wf-modal-close')) ?? list[0];
      target?.focus({ preventScroll: true });
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      try {
        previousFocus?.focus({ preventScroll: true });
      } catch {
        /* previous element removed; ignore */
      }
      previousFocus = null;
    };
  });

  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

{#if open}
  <div
    class="wf-modal-shell wf-modal-overlay"
    role="presentation"
    use:portal
    onclick={onBackdropClick}
    onkeydown={onKeydown}
  >
    <div
      bind:this={dialogEl}
      class={['wf-modal', size !== 'md' ? size : ''].filter(Boolean).join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <header class="wf-modal-head">
        <div class="wf-modal-titles">
          <h3 id={titleId}>{title}</h3>
          {#if description}
            <p id={descId} class="wf-modal-desc">{description}</p>
          {/if}
        </div>
        <button
          type="button"
          class="wf-modal-close"
          aria-label="Close dialog"
          onclick={close}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2 2 L12 12 M12 2 L2 12"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </header>

      <div class="wf-modal-body">
        {@render children?.()}
      </div>

      {#if actions}
        <div class="actions">
          {@render actions()}
        </div>
      {/if}
    </div>
  </div>
{/if}

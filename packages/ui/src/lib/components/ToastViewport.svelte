<script lang="ts">
  import { toast, type ToastTone } from '../stores/toast.svelte.js';

  function toneClass(tone: ToastTone): string {
    switch (tone) {
      case 'success':
        return 'ok';
      case 'warning':
        return 'warn';
      case 'error':
        return 'err';
      case 'info':
        return 'info';
      default:
        return '';
    }
  }
</script>

<div class="wf-toast-viewport" role="region" aria-label="Notifications">
  {#each toast.toasts as t (t.id)}
    {@const cls = ['wf-toast', toneClass(t.tone)].filter(Boolean).join(' ')}
    <div
      class={cls}
      role="status"
      aria-live="polite"
      onmouseenter={() => toast.pause(t.id)}
      onmouseleave={() => toast.resume(t.id)}
      onfocusin={() => toast.pause(t.id)}
      onfocusout={() => toast.resume(t.id)}
    >
      <div class="wf-grow">
        <div class="title">{t.title}</div>
        {#if t.description}<div class="body">{t.description}</div>{/if}
      </div>
      {#if t.action}
        {@const action = t.action}
        <button
          type="button"
          class="wf-btn ghost wf-toast-action"
          onclick={() => {
            action.onClick();
            toast.dismiss(t.id);
          }}
        >
          {action.label}
        </button>
      {/if}
      <button
        type="button"
        class="wf-toast-close"
        aria-label="Dismiss notification"
        onclick={() => toast.dismiss(t.id)}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2 2 L10 10 M10 2 L2 10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  {/each}
</div>

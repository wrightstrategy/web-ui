/*
 * @wright/ui · toast store
 *
 * Singleton toast queue. SSR-safe by guard: importing this module on the
 * server is harmless; calling mutating methods during SSR no-ops. Render
 * <ToastViewport /> once (typically in the root +layout.svelte) and call
 * `toast.success(...)` from anywhere client-side.
 */

export type ToastTone = 'default' | 'info' | 'success' | 'warning' | 'error';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Auto-dismiss after this many milliseconds. 0 disables auto-dismiss. */
  duration?: number;
  action?: ToastAction;
};

export type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
};

type TimerEntry = {
  timeoutId: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
  paused: boolean;
};

const isBrowser = typeof window !== 'undefined';
const DEFAULT_DURATION = 5000;

class ToastStore {
  toasts: Toast[] = $state([]);

  #timers = new Map<string, TimerEntry>();

  show(input: ToastInput): string {
    if (!isBrowser) return '';

    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const t: Toast = {
      id,
      title: input.title,
      description: input.description,
      tone: input.tone ?? 'default',
      duration: input.duration ?? DEFAULT_DURATION,
      action: input.action,
    };
    this.toasts = [...this.toasts, t];

    if (t.duration > 0) {
      this.#scheduleDismiss(id, t.duration);
    }
    return id;
  }

  dismiss(id: string): void {
    if (!isBrowser) return;
    const timer = this.#timers.get(id);
    if (timer) {
      clearTimeout(timer.timeoutId);
      this.#timers.delete(id);
    }
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  pause(id: string): void {
    if (!isBrowser) return;
    const timer = this.#timers.get(id);
    if (!timer || timer.paused) return;
    clearTimeout(timer.timeoutId);
    const elapsed = Date.now() - timer.startedAt;
    timer.remaining = Math.max(0, timer.remaining - elapsed);
    timer.paused = true;
  }

  resume(id: string): void {
    if (!isBrowser) return;
    const timer = this.#timers.get(id);
    if (!timer || !timer.paused) return;
    timer.paused = false;
    timer.startedAt = Date.now();
    timer.timeoutId = setTimeout(() => this.dismiss(id), timer.remaining);
  }

  /** Remove every active toast. */
  clear(): void {
    if (!isBrowser) return;
    for (const timer of this.#timers.values()) clearTimeout(timer.timeoutId);
    this.#timers.clear();
    this.toasts = [];
  }

  info(title: string, description?: string, opts?: Partial<ToastInput>): string {
    return this.show({ ...opts, title, description, tone: 'info' });
  }
  success(title: string, description?: string, opts?: Partial<ToastInput>): string {
    return this.show({ ...opts, title, description, tone: 'success' });
  }
  warning(title: string, description?: string, opts?: Partial<ToastInput>): string {
    return this.show({ ...opts, title, description, tone: 'warning' });
  }
  error(title: string, description?: string, opts?: Partial<ToastInput>): string {
    return this.show({ ...opts, title, description, tone: 'error' });
  }

  #scheduleDismiss(id: string, duration: number): void {
    const timeoutId = setTimeout(() => this.dismiss(id), duration);
    this.#timers.set(id, {
      timeoutId,
      remaining: duration,
      startedAt: Date.now(),
      paused: false,
    });
  }
}

export const toast = new ToastStore();

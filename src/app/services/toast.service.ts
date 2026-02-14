import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  /** Toast type: success, error, warning, info */
  type?: ToastType;
  /** Duration in ms; 0 = no auto-dismiss */
  duration?: number;
  /** Whether user can dismiss via close button */
  dismissible?: boolean;
  /** Optional title above message */
  title?: string;
}

export interface Toast extends ToastConfig {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  dismissible: boolean;
  createdAt: number;
}

const DEFAULT_DURATION = 5000;
const DEFAULT_DISMISSIBLE = true;

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this.toastsSignal.asReadonly();

  /**
   * Show a toast with full config.
   * @param message - Main message text
   * @param config - Optional type, duration (ms), dismissible, title
   */
  show(message: string, config: ToastConfig = {}): string {
    const type = config.type ?? 'info';
    const duration = config.duration ?? DEFAULT_DURATION;
    const dismissible = config.dismissible ?? DEFAULT_DISMISSIBLE;
    const id = generateId();
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      dismissible,
      title: config.title,
      createdAt: Date.now(),
    };
    this.toastsSignal.update((list) => [...list, toast]);
    if (duration > 0) {
      const timer = setTimeout(() => this.dismiss(id), duration);
      this.timers.set(id, timer);
    }
    return id;
  }

  success(message: string, config?: Omit<ToastConfig, 'type'>): string {
    return this.show(message, { ...config, type: 'success' });
  }

  error(message: string, config?: Omit<ToastConfig, 'type'>): string {
    return this.show(message, { ...config, type: 'error' });
  }

  warning(message: string, config?: Omit<ToastConfig, 'type'>): string {
    return this.show(message, { ...config, type: 'warning' });
  }

  info(message: string, config?: Omit<ToastConfig, 'type'>): string {
    return this.show(message, { ...config, type: 'info' });
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this.toastsSignal.update((list) => list.filter((t) => t.id !== id));
  }

  dismissAll(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.toastsSignal.set([]);
  }
}

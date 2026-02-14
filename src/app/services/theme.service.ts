import { Injectable, signal } from '@angular/core';

export type Theme = 'system' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'autoping-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal = signal<Theme>(this.loadStoredTheme());

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
    this.watchSystemPreference();
  }

  setTheme(value: Theme): void {
    this.themeSignal.set(value);
    this.applyTheme(value);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
  }

  private loadStoredTheme(): Theme {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'system';
  }

  private applyTheme(value: Theme): void {
    const root = document.documentElement;
    const isDark =
      value === 'dark' ||
      (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private watchSystemPreference(): void {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.themeSignal() === 'system') {
          this.applyTheme('system');
        }
      });
  }
}

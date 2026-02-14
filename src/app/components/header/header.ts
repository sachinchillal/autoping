import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matSettings } from '@ng-icons/material-icons/baseline';
import { Settings } from '../settings/settings';
import { ThemeService } from '../../services/theme.service';

export interface HeaderNavItem {
  path: string;
  label: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, NgIcon, Settings],
  providers: [provideIcons({ matSettings })],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly logoPath = '/AutoPingMini.png';
  readonly title = 'AutoPing';
  readonly searchQuery = signal('');
  readonly settingsOpen = signal(false);

  /** Add or reorder items here to change header navigation. */
  readonly navItems: HeaderNavItem[] = [
    { path: '', label: 'Home' },
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'workflows', label: 'Workflows' },
  ];

  constructor(private router: Router, protected readonly themeService: ThemeService) { }

  onSearchSubmit(): void {
    const q = this.searchQuery().trim();
    if (q) {
      this.router.navigate(['/'], { queryParams: { q } });
    }
  }

  openSettings(): void {
    this.settingsOpen.set(true);
  }

  closeSettings(): void {
    this.settingsOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.settingsOpen()) {
      this.closeSettings();
    }
  }
}

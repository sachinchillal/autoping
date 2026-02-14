import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matCheckCircle,
  matError,
  matWarning,
  matInfo,
  matClose,
} from '@ng-icons/material-icons/baseline';
import { ToastService, type Toast, type ToastType } from '../../services/toast.service';

const ICON_MAP: Record<ToastType, string> = {
  success: 'matCheckCircle',
  error: 'matError',
  warning: 'matWarning',
  info: 'matInfo',
};

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIcon],
  providers: [
    provideIcons({
      matCheckCircle,
      matError,
      matWarning,
      matInfo,
      matClose,
    }),
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);

  getIcon(type: ToastType): string {
    return ICON_MAP[type];
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}

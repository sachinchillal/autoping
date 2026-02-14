import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matSchedule } from '@ng-icons/material-icons/baseline';

export interface CronPreset {
  label: string;
  expression: string;
}

@Component({
  selector: 'app-cron-selector',
  imports: [FormsModule, NgIcon],
  providers: [provideIcons({ matSchedule })],
  templateUrl: './cron-selector.html',
  styleUrl: './cron-selector.scss',
})
export class CronSelector {
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  readonly open = signal(false);
  readonly customSecond = signal('0');
  readonly customMinute = signal('0');
  readonly customHour = signal('*');
  readonly customDayOfMonth = signal('*');
  readonly customMonth = signal('*');
  readonly customDayOfWeek = signal('*');

  /** 6-part cron: second minute hour day-of-month month day-of-week */
  readonly customExpression = computed(
    () =>
      `${this.customSecond()} ${this.customMinute()} ${this.customHour()} ${this.customDayOfMonth()} ${this.customMonth()} ${this.customDayOfWeek()}`
  );

  readonly presets: CronPreset[] = [
    { label: 'Every minute', expression: '0 * * * * *' },
    { label: 'Every 5 minutes', expression: '0 */5 * * * *' },
    { label: 'Every 15 minutes', expression: '0 */15 * * * *' },
    { label: 'Every 30 minutes', expression: '0 */30 * * * *' },
    { label: 'Every hour', expression: '0 0 * * * *' },
    { label: 'Every day at midnight', expression: '0 0 0 * * *' },
    { label: 'Every week (Sunday 00:00)', expression: '0 0 0 * * 0' },
    { label: '1st of every month (00:00)', expression: '0 0 0 1 * *' },
  ];

  openModal(): void {
    const v = this.value()?.trim() ?? '';
    if (v) {
      const parts = v.split(/\s+/);
      if (parts.length >= 6) {
        this.customSecond.set(parts[0]);
        this.customMinute.set(parts[1]);
        this.customHour.set(parts[2]);
        this.customDayOfMonth.set(parts[3]);
        this.customMonth.set(parts[4]);
        this.customDayOfWeek.set(parts[5]);
      } else if (parts.length >= 5) {
        this.customSecond.set('0');
        this.customMinute.set(parts[0]);
        this.customHour.set(parts[1]);
        this.customDayOfMonth.set(parts[2]);
        this.customMonth.set(parts[3]);
        this.customDayOfWeek.set(parts[4]);
      }
    }
    this.open.set(true);
  }

  closeModal(): void {
    this.open.set(false);
  }

  selectPreset(preset: CronPreset): void {
    this.valueChange.emit(preset.expression);
    this.closeModal();
  }

  applyCustom(): void {
    this.valueChange.emit(this.customExpression());
    this.closeModal();
  }

  onBackdropClick(): void {
    this.closeModal();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}

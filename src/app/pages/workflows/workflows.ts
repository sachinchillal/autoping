import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matAdd,
  matDelete,
  matEdit,
  matRefresh,
} from '@ng-icons/material-icons/baseline';
import { AppService } from '../../services/app.service';
import { AutoPingWorkflow } from '../../utils/interfaces';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workflows',
  imports: [FormsModule, NgIcon, RouterLink],
  providers: [provideIcons({ matAdd, matDelete, matEdit, matRefresh })],
  templateUrl: './workflows.html',
  styleUrl: './workflows.scss',
})
export class Workflows {
  protected readonly appService = inject(AppService);
  protected newWorkflowName = '';

  protected refreshWorkflows(): void {
    this.appService.getWorkflows();
  }

  protected refreshWorkflowsStatus(): void {
    this.appService.getWorkflowsStatus();
  }

  protected toggleWorkflowsWithConfirmation(): void {
    const willStart = !this.appService.isRunningWorkflows();
    const message = willStart ? 'Start all workflows?' : 'Stop all workflows?';
    if (window.confirm(message)) {
      this.appService.toggleWorkflows();
    }
  }

  protected createWorkflow(): void {
    const name = this.newWorkflowName?.trim();
    if (!name) return;
    this.appService.createWorkflow(name, (ok) => {
      if (ok) this.newWorkflowName = '';
    });
  }

  protected toggleWorkflowEnabled(w: AutoPingWorkflow): void {
    const turnOn = !w.isActive;
    const message = turnOn
      ? `Enable workflow "${w.name}"?`
      : `Disable workflow "${w.name}"?`;
    if (window.confirm(message)) {
      this.appService.updateWorkflow(w.id, { isActive: turnOn }, () => { });
    }
  }

  protected renameWorkflow(w: AutoPingWorkflow): void {
    const name = window.prompt('Rename workflow', w.name);
    if (name != null && name.trim() !== '') {
      this.appService.renameWorkflow(w.id, name.trim(), () => { });
    }
  }

  protected deleteWorkflow(w: AutoPingWorkflow): void {
    if (window.confirm(`Delete workflow "${w.name}"? This cannot be undone.`)) {
      this.appService.deleteWorkflow(w.id, () => { });
    }
  }
}

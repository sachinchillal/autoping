import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matSave, matPlayArrow, matStop, matArrowBack } from '@ng-icons/material-icons/baseline';
import { AppService } from '../../services/app.service';
import { AutoPingWorkflow } from '../../utils/interfaces';
import { CHATS } from '../../utils/constants';
import { CronSelector } from '../../components/cron-selector/cron-selector';

@Component({
  selector: 'app-edit-workflow',
  imports: [FormsModule, RouterLink, NgIcon, CronSelector],
  providers: [provideIcons({ matSave, matPlayArrow, matStop, matArrowBack })],
  templateUrl: './edit-workflow.html',
  styleUrl: './edit-workflow.scss',
})
export class EditWorkflow implements OnInit {
  private route = inject(ActivatedRoute);
  private appService = inject(AppService);

  protected id = signal<number | null>(null);
  protected workflow = signal<AutoPingWorkflow | null>(null);
  protected loading = signal(true);
  protected saving = signal(false);
  protected loadError = signal<string | null>(null);
  protected saveError = signal<string | null>(null);

  protected editName = signal('');
  protected editFolderId = signal<number>(0);
  protected editChatId = signal<string>('');
  protected editCronExpression = signal('');

  protected readonly folders = computed(() => this.appService.virtualFolders());
  protected readonly chats = CHATS;

  protected getFolderName = (folderId: number): string =>
    this.appService.getVirtualFolderById(folderId)?.name ?? '—';

  protected getChatName = (chatId: string): string =>
    CHATS.find((c) => String(c.id) === chatId)?.name ?? '—';

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = Number(idStr);
      this.id.set(id);
      this.loadWorkflow(id);
    } else {
      this.loading.set(false);
      this.loadError.set('Missing workflow id in path');
    }
  }

  private loadWorkflow(id: number): void {
    const w = this.appService.getWorkflowById(id);
    if (w) {
      this.workflow.set(w);
      this.editName.set(w.name ?? '');
      this.editFolderId.set(w.folderID ?? 0);
      this.editChatId.set(String(w.chatId ?? ''));
      this.editCronExpression.set(w.cronExpression ?? '');
    } else {
      this.loadError.set('Workflow not found');
    }
    this.loading.set(false);
  }

  protected save(): void {
    const id = this.id();
    const w = this.workflow();
    if (id == null || !w) return;
    this.saveError.set(null);
    this.saving.set(true);

    const name = this.editName().trim();
    const folderID = this.editFolderId();
    const chatId = String(this.editChatId());
    const cronExpression = this.editCronExpression().trim();

    const payload: Partial<AutoPingWorkflow> = {};
    if (name !== '' && name !== (w.name ?? '')) payload.name = name;
    if (folderID !== (w.folderID ?? 0)) payload.folderID = folderID;
    if (chatId !== '' && chatId !== String(w.chatId ?? '')) payload.chatId = chatId;
    if (cronExpression !== '' && cronExpression !== (w.cronExpression ?? '')) payload.cronExpression = cronExpression;

    if (Object.keys(payload).length === 0) {
      this.saving.set(false);
      return;
    }

    this.appService.updateWorkflow(id, payload, (isSuccess) => {
      this.saving.set(false);
      if (isSuccess) {
        const updated = this.appService.getWorkflowById(id);
        if (updated) this.workflow.set(updated);
      } else {
        this.saveError.set('Failed to save workflow');
      }
    });
  }
}

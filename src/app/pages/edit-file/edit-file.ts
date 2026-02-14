import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-file',
  imports: [RouterLink, FormsModule],
  templateUrl: './edit-file.html',
  styleUrl: './edit-file.scss',
})
export class EditFile implements OnInit {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  private appService = inject(AppService);

  protected id = signal<number | null>(null);
  protected content = signal('');
  protected fileName = signal('');
  protected loading = signal(true);
  protected saving = signal(false);
  protected loadError = signal<string | null>(null);
  protected saveError = signal<string | null>(null);
  protected breadcrumb = signal<string[]>([]);

  constructor() {

  }

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (idStr) {
      const id = Number(idStr);
      this.id.set(id);
      this.loadFile(id);
    } else {
      this.loading.set(false);
      this.loadError.set('Missing file id in path');
    }
  }

  private loadFile(id: number): void {
    console.log('loadFile', id);
    const f = this.appService.getVirtualFileById(id);
    console.log('f', f);
    if (f) {
      const folderIds = f.folderIds ?? [];
      const folderNames = folderIds.map((id) => this.appService.getVirtualFolderById(id)?.name ?? '');
      this.breadcrumb.set(folderNames);
      // this.content.set(f.content ?? '');
      this.fileName.set(f.name ?? '');
      this.apiService.getFileContent(id).subscribe({
        next: ({ data: { content } }: any) => {
          console.log('content', content);
          this.content.set(content ?? '');
          this.loading.set(false);
        },
        error: (err) => {
          this.loadError.set(err?.message ?? 'Failed to load file content');
          this.loading.set(false);
        },
      });
    } else {
      this.loadError.set('File not found');
      this.loading.set(false);
    }
  }

  protected save(): void {
    const id = this.id();
    if (!id) return;
    this.saveError.set(null);
    this.saving.set(true);
    this.apiService.updateFileContent(id, this.content()).subscribe({
      next: () => this.saving.set(false),
      error: (err) => {
        this.saveError.set(err?.message ?? 'Failed to save file');
        this.saving.set(false);
      },
    });
  }
}

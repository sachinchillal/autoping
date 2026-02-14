import { NgTemplateOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppService } from '../../services/app.service';
import { NgIcon } from '@ng-icons/core';
import { provideIcons } from '@ng-icons/core';
import { matCreateNewFolder, matFolder, matRefresh, matFolderOpen, matFileOpen } from '@ng-icons/material-icons/baseline';
import { ROOT_FOLDER_ID } from '../../utils/constants';

@Component({
  selector: 'app-file-explorer',
  imports: [NgTemplateOutlet, NgIcon, RouterLink],
  providers: [provideIcons({ matRefresh, matFolder, matCreateNewFolder, matFolderOpen, matFileOpen, })],
  templateUrl: './file-explorer.html',
  styleUrl: './file-explorer.scss',
})
export class FileExplorer {
  protected addingToParentFolderId = signal<number | null>(null);
  protected newFolderName = signal('');
  protected renamingFolderId = signal<number | null>(null);

  protected addingFileToFolderId = signal<number | null>(null);
  protected newFileName = signal('');
  protected renamingFileId = signal<number | null>(null);

  protected renamingName = signal('');

  constructor(protected readonly appService: AppService) { }

  protected refresh(): void {
    this.appService.getFolders(); // getFiles() is called after folders load
  }

  // Folder Actions
  protected startAddingFolder(parentFolderId: number = ROOT_FOLDER_ID): void {
    this.addingToParentFolderId.set(parentFolderId);
    this.newFolderName.set('');
    this.cancelAddingFile();
    this.cancelRenaming();
  }
  protected cancelAddingFolder(): void {
    this.addingToParentFolderId.set(null);
    this.newFolderName.set('');
  }
  protected confirmAddFolder(name: string, parentFolderId: number = ROOT_FOLDER_ID): void {
    const trimmed = name.trim();
    if (!trimmed) {
      this.cancelAddingFolder();
      return;
    }
    this.appService.createNewFolder(parentFolderId, trimmed, (isSuccess) => {
      if (isSuccess) {
        this.cancelAddingFolder();
      }
    });
  }
  protected startRenamingFolder(currentName: string, parentFolderId: number = ROOT_FOLDER_ID): void {
    this.renamingFolderId.set(parentFolderId);
    this.renamingFileId.set(null);
    this.renamingName.set(currentName);
    this.cancelAddingFolder();
    this.cancelAddingFile();
  }
  protected deleteFolder(folderId: number): void {
    this.appService.deleteFolder(folderId, (isSuccess) => {
      if (isSuccess) {
        this.cancelAddingFolder();
      }
    });
  }



  // File Actions
  protected startAddingFile(parentFolderId: number): void {
    this.addingFileToFolderId.set(parentFolderId);
    this.newFileName.set('');
    this.cancelAddingFolder();
    this.cancelRenaming();
  }
  protected startRenamingFile(fileId: number, currentName: string): void {
    this.renamingFolderId.set(null);
    this.renamingFileId.set(fileId);
    this.renamingName.set(currentName);
    this.cancelAddingFolder();
    this.cancelAddingFile();
  }
  protected cancelAddingFile(): void {
    this.addingFileToFolderId.set(null);
    this.newFileName.set('');
  }

  protected confirmAddFile(parentFolderId: number, name: string): void {
    const trimmed = name.trim();
    if (!trimmed) {
      this.cancelAddingFile();
      return;
    }
    this.appService.createNewFile(parentFolderId, trimmed, (isSuccess) => {
      if (isSuccess) {
        this.cancelAddingFile();
      }
    });
  }
  protected isRenamingFile(folderId: number, fileId: number): boolean {
    return (this.renamingFolderId() === null && this.renamingFileId() === fileId);
  }
  protected deleteFile(fileId: number): void {
    this.appService.deleteFile(fileId, (isSuccess) => {
      if (isSuccess) {
        this.cancelAddingFile();
      }
    });
  }

  protected confirmRename(): void {
    const folderId = this.renamingFolderId();
    const fileId = this.renamingFileId();
    const name = this.renamingName().trim();
    if (!name) {
      this.cancelRenaming();
      return;
    }
    if (fileId !== null) {
      this.appService.renameFile(fileId, name, (isSuccess) => {
        if (isSuccess) {
          this.cancelRenaming();
        }
      });
    } else if (folderId !== null) {
      this.appService.updateFolderName(folderId, name, (isSuccess) => {
        if (isSuccess) {
          this.cancelRenaming();
        }
      });
    } else {
      this.cancelRenaming();
    }
  }

  protected isRenamingFolder(folderId: number): boolean {
    return this.renamingFolderId() === folderId && this.renamingFileId() === null;
  }

  protected cancelRenaming(): void {
    this.renamingFolderId.set(null);
    this.renamingFileId.set(null);
    this.renamingName.set('');
  }
}

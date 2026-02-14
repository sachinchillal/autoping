import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { AutoPingWorkflow, TreeNode, VirtualFile, VirtualFolder } from '../utils/interfaces';
import { buildTree, mergeFilesIntoTree, toggleExpandRecursive } from '../utils/tree.util';
import { STATE_KEYS, DATA_STALE_MS } from '../utils/constants';
import { isDataStale } from '../utils/app.util';
import { ToastService } from './toast.service';

type FileToFoldersMap = Record<number, number[]>;

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly apiService = inject(ApiService);
  private readonly toastService = inject(ToastService);
  readonly virtualFolders = signal<VirtualFolder[]>([]);
  private readonly virtualFiles = signal<VirtualFile[]>([]);
  readonly tree = signal<TreeNode[]>([]);
  readonly fileToFoldersMap = signal<FileToFoldersMap>({});
  // Workflows
  readonly isRunningWorkflows = signal<boolean>(false);
  readonly workflows = signal<AutoPingWorkflow[]>([]);

  constructor() {
    this.init();
  }
  private init(): void {
    const virtualFolders = localStorage.getItem(STATE_KEYS.VIRTUAL_FOLDERS);
    const virtualFiles = localStorage.getItem(STATE_KEYS.VIRTUAL_FILES);
    const workflows = localStorage.getItem(STATE_KEYS.WORKFLOWS);

    if (workflows) {
      this.workflows.set(JSON.parse(workflows));
      if (isDataStale(STATE_KEYS.WORKFLOWS_FETCHED_AT)) {
        this.getWorkflows();
      }
    } else {
      this.getWorkflows();
    }
    if (virtualFolders) {
      this.virtualFolders.set(JSON.parse(virtualFolders));
      if (isDataStale(STATE_KEYS.VIRTUAL_FOLDERS_FETCHED_AT)) {
        this.getFolders();
      }
    } else {
      this.getFolders();
    }
    if (virtualFolders) {
      this.virtualFolders.set(JSON.parse(virtualFolders));
      if (isDataStale(STATE_KEYS.VIRTUAL_FOLDERS_FETCHED_AT)) {
        this.getFolders();
      }
    } else {
      this.getFolders();
    }
    if (virtualFiles) {
      this.virtualFiles.set(JSON.parse(virtualFiles));
      if (isDataStale(STATE_KEYS.VIRTUAL_FILES_FETCHED_AT)) {
        this.getFiles();
      }
    } else {
      this.getFiles();
    }
    this.tree.set(buildTree(this.virtualFolders(), this.virtualFiles()));
    this.tree.set(mergeFilesIntoTree(this.tree(), this.virtualFiles()));

    // Restore and optionally refetch workflows status
    const storedRunning = localStorage.getItem(STATE_KEYS.IS_RUNNING_WORKFLOWS);
    if (storedRunning !== null) {
      this.isRunningWorkflows.set(storedRunning === 'true');
    }
    if (isDataStale(STATE_KEYS.IS_RUNNING_WORKFLOWS_FETCHED_AT)) {
      this.getWorkflowsStatus();
    }
  }

  // Folder API
  public createNewFolder(id: number, name: string, callback: (isSuccess: boolean) => void): void {
    this.apiService.createFolder(id, name).subscribe({
      next: () => {
        this.getFolders();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      }
    });
  }
  public getFolders(): void {
    this.apiService.getFolders().subscribe({
      next: ({ data }: any) => {
        console.log(data);
        this.virtualFolders.set(data);
        this.tree.set(buildTree(this.virtualFolders(), this.virtualFiles()));
        localStorage.setItem(STATE_KEYS.VIRTUAL_FOLDERS, JSON.stringify(this.virtualFolders()));
        // this.getFiles();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  public updateFolderName(id: number, name: string, callback: (isSuccess: boolean) => void): void {
    this.apiService.updateFolder(id, name).subscribe({
      next: () => {
        this.getFolders();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      }
    });
  }
  public deleteFolder(id: number, callback: (isSuccess: boolean) => void): void {
    this.apiService.deleteFolder(id).subscribe({
      next: () => {
        this.getFolders();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      }
    });
  }
  public getFiles(): void {
    this.apiService.getFiles().subscribe({
      next: ({ data }: { data: VirtualFile[] } | any) => {
        console.log(data);
        this.virtualFiles.set(data);
        console.log(this.tree(), this.virtualFiles());
        this.tree.set(mergeFilesIntoTree(this.tree(), this.virtualFiles()));
        localStorage.setItem(STATE_KEYS.VIRTUAL_FILES, JSON.stringify(this.virtualFiles()));
      },
      error: (err) => console.error(err),
    });
  }

  public createNewFile(parentFolderId: number, name: string, callback: (isSuccess: boolean) => void): void {
    this.apiService.createFile(parentFolderId, name).subscribe({
      next: () => {
        this.getFiles();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      },
    });
  }

  public renameFile(fileId: number, name: string, callback: (isSuccess: boolean) => void): void {
    this.apiService.updateFile(fileId, name).subscribe({
      next: () => {
        this.getFiles();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      },
    });
  }

  public deleteFile(fileId: number, callback: (isSuccess: boolean) => void): void {
    this.apiService.deleteFile(fileId).subscribe({
      next: () => {
        this.getFiles();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      },
    });
  }

  // Getter
  public getVirtualFileById(id: number): VirtualFile | undefined {
    return this.virtualFiles().find(f => f.id === id);
  }
  public getVirtualFolderById(id: number): VirtualFolder | undefined {
    return this.virtualFolders().find(f => f.id === id);
  }
  public getWorkflowById(id: number): AutoPingWorkflow | undefined {
    return this.workflows().find(w => w.id === id);
  }
  public getVirtualFolderByFileId(fileId: number): VirtualFolder | undefined {
    // find the fileId from the tree and return the parent folder, until the root folder =id=0
    const file = this.getVirtualFileById(fileId);
    if (file) {
      return this.getVirtualFolderById(file.folderId);
    }
    return undefined;
  }

  // Handle UI actions (mutate then set new array ref so signal notifies and UI updates)
  handleToggleExpand(treeNode: TreeNode): void {
    treeNode.isExpanded = !treeNode.isExpanded;
  }

  handleExpandAll(): void {
    this.tree().forEach((node) => {
      toggleExpandRecursive(node, true);
    });
  }
  handleCollapseAll(): void {
    this.tree().forEach((node) => {
      toggleExpandRecursive(node, false);
    });
  }

  // Workflow API
  public getWorkflowsStatus(): void {
    this.apiService.getWorkflowsStatus().subscribe({
      next: ({ data }: any) => {
        const isRunning: boolean = data.isRunning || false;
        this.isRunningWorkflows.set(isRunning);
        localStorage.setItem(STATE_KEYS.IS_RUNNING_WORKFLOWS, String(isRunning));
        localStorage.setItem(STATE_KEYS.IS_RUNNING_WORKFLOWS_FETCHED_AT, String(Date.now()));
      },
      error: (error) => {
        this.isRunningWorkflows.set(false);
        console.error(error);
      }
    });
  }
  public powerOnWorkflow(): void {
    this.apiService.powerOnWorkflow().subscribe({
      next: () => {
        this.getWorkflowsStatus();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  public powerOffWorkflow(): void {
    this.apiService.powerOffWorkflow().subscribe({
      next: () => {
        this.getWorkflowsStatus();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  public toggleWorkflows(): void {
    if (this.isRunningWorkflows()) {
      this.powerOffWorkflow();
    } else {
      this.powerOnWorkflow();
    }
  }
  public getWorkflows(): void {
    this.apiService.getWorkflows().subscribe({
      next: ({ data }: { data: AutoPingWorkflow[] } | any) => {
        const workflows = data ?? [];
        this.workflows.set(workflows);
        localStorage.setItem(STATE_KEYS.WORKFLOWS, JSON.stringify(workflows));
        localStorage.setItem(STATE_KEYS.WORKFLOWS_FETCHED_AT, String(Date.now()));
      },
      error: (error) => {
        console.error(error);
        this.workflows.set([]);
      },
    });
  }
  public createWorkflow(name: string, callback: (isSuccess: boolean) => void): void {
    this.apiService.createWorkflow(name).subscribe({
      next: () => {
        this.getWorkflows();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      },
    });
  }
  public renameWorkflow(id: number, name: string, callback: (isSuccess: boolean) => void): void {
    this.apiService.renameWorkflow(id, name).subscribe({
      next: () => {
        this.getWorkflows();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      },
    });
  }
  public updateWorkflow(id: number, workflow: Partial<AutoPingWorkflow>, callback: (isSuccess: boolean) => void): void {
    this.apiService.updateWorkflow(id, workflow).subscribe({
      next: () => {
        this.getWorkflows();
        callback(true);
      },
      error: (e) => {
        if (e && e.error && e.error.message) {
          this.toastService.error(e.error.message);
        } else {
          this.toastService.error('Failed to update workflow');
        }
        callback(false);
      },
    });
  }
  public deleteWorkflow(id: number, callback: (isSuccess: boolean) => void): void {
    this.apiService.deleteWorkflow(id).subscribe({
      next: () => {
        this.getWorkflows();
        callback(true);
      },
      error: (error) => {
        console.error(error);
        callback(false);
      },
    });
  }
}

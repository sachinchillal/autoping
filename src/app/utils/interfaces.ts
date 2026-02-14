export interface DateProps {
  createdAt: number;
  updatedAt: number;
}
export interface BaseProps extends DateProps {
  id: number;
  name: string;
  isActive: boolean;
}
export interface VirtualFile extends BaseProps {
  folderId: number;
  folderIds: number[];
}
export interface VirtualFolder extends BaseProps {
  parentId: number;
}

export interface TreeNode extends VirtualFolder {
  children: TreeNode[];
  files: VirtualFile[];
  isExpanded: boolean;
}

export interface AutoPingWorkflow extends BaseProps {
  folderID: number;
  cronExpression: string;
  isDeleted: boolean;
  chatId: string;
}
export interface AutoPingTracker extends BaseProps {
  workflowId: number;
  fileId: number;
  itemIndex: number;
  counter: number;
}
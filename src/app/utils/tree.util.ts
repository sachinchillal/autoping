import { TreeNode, VirtualFile, VirtualFolder } from "./interfaces";

export function toggleExpandRecursive(node: TreeNode, isExpanded: boolean): void {
  node.isExpanded = isExpanded;
  node.children.forEach((child) => {
    toggleExpandRecursive(child, isExpanded);
  });
}

export function buildTree(folders: VirtualFolder[], files: VirtualFile[]): TreeNode[] {
  const m: { [key: number]: TreeNode; } = {};
  folders.forEach((folder: VirtualFolder) => {
    m[folder.id] = {
      ...folder,
      children: [],
      files: [],
      isExpanded: true,
    };
    if (folder.parentId) {
      if (m[folder.parentId]) {
        m[folder.parentId].children.push(m[folder.id]);
      } else {
        console.warn(`Folder ${folder.id} has no parent ${folder.parentId}`);
      }
    }
  });
  files.forEach((file: VirtualFile) => {
    if (m[file.folderId]) {
      m[file.folderId].files.push(file);
    } else {
      console.warn(`File ${file.id} has no folder ${file.folderId}`);
    }
  });
  return Object.values(m).filter((node: TreeNode) => node.parentId === 0);
}

/** Returns a new tree (new references) so signal consumers are notified when tree is set. */
export function mergeFilesIntoTree(
  nodes: TreeNode[],
  virtualFiles: VirtualFile[],
  parentFolderIds: number[] = []
): TreeNode[] {
  nodes.forEach((n) => {
    const pathFromRoot = [...parentFolderIds, n.id];
    const files: VirtualFile[] = [];
    virtualFiles.forEach((f) => {
      if (f.folderId === n.id) {
        f.folderIds = pathFromRoot;
        files.push(f);
      }
    });
    n.children = mergeFilesIntoTree(n.children, virtualFiles, pathFromRoot);
    n.files = files;
  });

  return [...nodes];
}
export function mergeFilesIntoTree2(nodes: TreeNode[], files: VirtualFile[]): TreeNode[] {
  return nodes.map((n) => ({
    ...n,
    files: files.filter((f) => f.folderId === n.id),
    children: mergeFilesIntoTree(n.children ?? [], files),
  }));
}
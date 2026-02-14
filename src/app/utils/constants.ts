export const ROOT_FOLDER_ID = 0;

/** If data was fetched longer ago than this, refetch on app reload. */
export const DATA_STALE_MS = 8 * 60 * 60 * 1000; // 8 hours

export const STATE_KEYS = {
  VIRTUAL_FOLDERS: 'virtualFolders',
  VIRTUAL_FOLDERS_FETCHED_AT: 'virtualFoldersFetchedAt',
  VIRTUAL_FILES: 'virtualFiles',
  VIRTUAL_FILES_FETCHED_AT: 'virtualFilesFetchedAt',
  IS_RUNNING_WORKFLOWS: 'isRunningWorkflows',
  IS_RUNNING_WORKFLOWS_FETCHED_AT: 'isRunningWorkflowsFetchedAt',
  WORKFLOWS: 'workflows',
  WORKFLOWS_FETCHED_AT: 'workflowsFetchedAt',
};
export const CHATS = [
  { id: 1, name: 'All' },
  { id: 2, name: 'English' },
  { id: 3, name: 'Java' },
  { id: 4, name: 'LLD' },
  { id: 5, name: 'SQL' }
]
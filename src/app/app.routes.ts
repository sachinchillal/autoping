import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dashboard } from './pages/dashboard/dashboard';
import { EditFile } from './pages/edit-file/edit-file';
import { Workflows } from './pages/workflows/workflows';
import { EditWorkflow } from './pages/edit-workflow/edit-workflow';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'workflows',
    component: Workflows
  },
  {
    path: 'edit-workflow/:id',
    component: EditWorkflow
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'edit-file/:id',
    component: EditFile
  }
];

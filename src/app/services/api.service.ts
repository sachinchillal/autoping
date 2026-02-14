import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AutoPingWorkflow } from '../utils/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly http = inject(HttpClient);

  // Folder API
  public createFolder(id: number, name: string) {
    return this.http.post(`${this.apiUrl}folders/${id}`, { name });
  }
  public getFolders() {
    return this.http.get(`${this.apiUrl}folders`);
  }
  public updateFolder(id: number, name: string) {
    return this.http.put(`${this.apiUrl}folders/${id}`, { name });
  }
  public deleteFolder(id: number) {
    return this.http.delete(`${this.apiUrl}folders/${id}`);
  }
  // File API
  public createFile(id: number, name: string) {
    return this.http.post(`${this.apiUrl}files/${id}`, { name });
  }
  public getFiles() {
    return this.http.get(`${this.apiUrl}files`);
  }
  public updateFile(id: number, name: string) {
    return this.http.put(`${this.apiUrl}files/${id}`, { name });
  }
  public deleteFile(id: number) {
    return this.http.delete(`${this.apiUrl}files/${id}`);
  }
  // File Content API
  public getFileContent(id: number) {
    return this.http.get(`${this.apiUrl}files/${id}/content`);
  }
  public updateFileContent(id: number, content: string) {
    return this.http.put(`${this.apiUrl}files/${id}/content`, { content });
  }

  // Workflow API
  public getWorkflowsStatus() {
    return this.http.get(`${this.apiUrl}workflows/power/status`);
  }
  public powerOnWorkflow() {
    return this.http.get(`${this.apiUrl}workflows/power/on`);
  }
  public powerOffWorkflow() {
    return this.http.get(`${this.apiUrl}workflows/power/off`);
  }
  public getWorkflows() {
    return this.http.get(`${this.apiUrl}workflows`);
  }
  public createWorkflow(name: string) {
    return this.http.post(`${this.apiUrl}workflows`, { name });
  }
  public renameWorkflow(id: number, name: string) {
    return this.http.put(`${this.apiUrl}workflows/${id}`, { name });
  }
  public updateWorkflow(id: number, workflow: Partial<AutoPingWorkflow>) {
    return this.http.put(`${this.apiUrl}workflows/${id}`, workflow);
  }
  public deleteWorkflow(id: number) {
    return this.http.delete(`${this.apiUrl}workflows/${id}`);
  }
}

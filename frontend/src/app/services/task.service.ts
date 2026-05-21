import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyTasks() {
    return this.http.get<any[]>(`${this.api}/tasks/my`);
  }

  getOverdueTasks() {
    return this.http.get<any[]>(`${this.api}/tasks/my/overdue`);
  }

  getProjectTasks(projectId: number) {
    return this.http.get<any[]>(`${this.api}/tasks/project/${projectId}`);
  }

  create(data: any) {
    return this.http.post<any>(`${this.api}/tasks`, data);
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.api}/tasks/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/tasks/${id}`);
  }
}

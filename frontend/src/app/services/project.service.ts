import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(`${this.api}/projects`);
  }

  getOne(id: number) {
    return this.http.get<any>(`${this.api}/projects/${id}`);
  }

  create(data: { name: string; description?: string }) {
    return this.http.post<any>(`${this.api}/projects`, data);
  }

  update(id: number, data: { name?: string; description?: string }) {
    return this.http.put<any>(`${this.api}/projects/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/projects/${id}`);
  }

  addMember(projectId: number, email: string, role = 'member') {
    return this.http.post<any>(`${this.api}/projects/${projectId}/members`, { email, role });
  }

  removeMember(projectId: number, userId: number) {
    return this.http.delete(`${this.api}/projects/${projectId}/members/${userId}`);
  }
}

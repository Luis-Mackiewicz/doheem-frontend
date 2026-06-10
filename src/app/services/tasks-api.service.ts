import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateTaskRequest {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: string;
  dueDate?: string;
}

export interface CreateOccurrenceRequest {
  completedAt?: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private http = inject(HttpClient);

  listByGroup(groupId: string) {
    return httpResource<any[]>(() => `${environment.apiUrl}/groups/${groupId}/tasks`);
  }

  getById(id: string) {
    return httpResource<any>(() => `${environment.apiUrl}/tasks/${id}`);
  }

  create(groupId: string, data: CreateTaskRequest) {
    return this.http.post<any>(`${environment.apiUrl}/groups/${groupId}/tasks`, data);
  }

  update(id: number, data: UpdateTaskRequest) {
    return this.http.put<any>(`${environment.apiUrl}/tasks/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/tasks/${id}`);
  }

  getOccurrences(taskId: number) {
    return httpResource<any[]>(() => `${environment.apiUrl}/tasks/${taskId}/occurrences`);
  }

  createOccurrence(taskId: number, data: CreateOccurrenceRequest) {
    return this.http.post<any>(`${environment.apiUrl}/tasks/${taskId}/occurrences`, data);
  }

  completeOccurrence(occurrenceId: number) {
    return this.http.patch<any>(`${environment.apiUrl}/tasks/occurrences/${occurrenceId}/complete`, {});
  }

  discardOccurrence(occurrenceId: number) {
    return this.http.patch<any>(`${environment.apiUrl}/tasks/occurrences/${occurrenceId}/discard`, {});
  }
}

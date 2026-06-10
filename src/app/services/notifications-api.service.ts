import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateNotificationRequest {
  type: string;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private http = inject(HttpClient);

  list(limit = 50, offset = 0) {
    return this.http.get<any>(`${environment.apiUrl}/notifications?limit=${limit}&offset=${offset}`);
  }

  unread(limit = 50, offset = 0) {
    return this.http.get<any>(`${environment.apiUrl}/notifications/unread?limit=${limit}&offset=${offset}`);
  }

  create(data: CreateNotificationRequest) {
    return this.http.post<any>(`${environment.apiUrl}/notifications`, data);
  }

  markAsRead(id: string) {
    return this.http.patch<void>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.patch<void>(`${environment.apiUrl}/notifications/read-all`, {});
  }

  delete(id: string) {
    return this.http.delete<void>(`${environment.apiUrl}/notifications/${id}`);
  }
}

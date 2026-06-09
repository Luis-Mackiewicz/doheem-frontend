import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateNotificationRequest {
  type: string;
  title: string;
  message: string;
  recipient: string;
  relatedId?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private http = inject(HttpClient);

  readonly list = httpResource<any[]>(() => `${environment.apiUrl}/notifications`);
  readonly unread = httpResource<any[]>(() => `${environment.apiUrl}/notifications/unread`);

  create(data: CreateNotificationRequest) {
    return this.http.post<any>(`${environment.apiUrl}/notifications`, data);
  }

  markAsRead(id: number) {
    return this.http.patch<void>(`${environment.apiUrl}/notifications/${id}/read`, {});
  }

  markAllAsRead() {
    return this.http.patch<void>(`${environment.apiUrl}/notifications/read-all`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/notifications/${id}`);
  }
}

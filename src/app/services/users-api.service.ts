import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
  fotoBase64?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);

  readonly me = httpResource<any>(() => `${environment.apiUrl}/users/me`);

  updateProfile(data: UpdateUserRequest) {
    return this.http.put<any>(`${environment.apiUrl}/users/me`, data);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put<void>(`${environment.apiUrl}/users/me/password`, data);
  }
}

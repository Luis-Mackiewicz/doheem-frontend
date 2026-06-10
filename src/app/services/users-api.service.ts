import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  document?: string;
  birth_date?: string;
  cep?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  readonly me = httpResource<any>(() => {
    const token = this.auth.token();
    if (!token) return undefined;
    return `${environment.apiUrl}/users/me`;
  });

  updateProfile(data: UpdateUserRequest) {
    return this.http.put<any>(`${environment.apiUrl}/users/me`, data);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put<void>(`${environment.apiUrl}/users/me/password`, data);
  }
}

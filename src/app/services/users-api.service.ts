import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly _me = signal<any>(undefined);

  readonly me = {
    value: this._me.asReadonly(),
    hasValue: computed(() => this._me() !== undefined),
  };

  constructor() {
    effect(() => {
      if (this.auth.token()) {
        this.fetchMe();
      }
    });
  }

  private fetchMe(): void {
    this.http.get<any>(`${environment.apiUrl}/users/me`).subscribe({
      next: res => this._me.set(res),
    });
  }

  reloadMe(): void {
    this.fetchMe();
  }

  updateProfile(data: UpdateUserRequest) {
    return this.http.put<any>(`${environment.apiUrl}/users/me`, data);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put<void>(`${environment.apiUrl}/users/me/password`, data);
  }
}

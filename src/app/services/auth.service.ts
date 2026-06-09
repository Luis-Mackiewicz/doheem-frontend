import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'doheem_token';
const USER_KEY = 'doheem_user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  document?: string;
  birth_date?: string;
  cep?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  documento?: string;
  dataNascimento?: string;
  cep?: string;
  fotoBase64?: string;
  admin?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(this.loadToken());
  private readonly userSignal = signal<UserProfile | null>(this.loadUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly token$ = toObservable(this.tokenSignal);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(data: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data);
  }

  refresh() {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, {});
  }

  logout() {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {});
  }

  setSession(auth: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, auth.token);
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
    this.tokenSignal.set(auth.token);
    this.userSignal.set(auth.user);
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private loadToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  private loadUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}

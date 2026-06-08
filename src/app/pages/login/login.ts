import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';
import { CardComponent } from '../../components/card/card';
import { PasswordInputComponent } from '../../components/password-input/password-input';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent, PasswordInputComponent],
  template: `
    <section class="min-h-dvh bg-page overflow-y-auto transition-colors duration-150">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 pt-24 pb-6">

        <app-card>
          <a routerLink="/" aria-label="Voltar" class="text-secondary hover-text-primary text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← Voltar
          </a>

          <div class="flex gap-1 bg-card border border-theme rounded-xl p-1 mb-8">
            <span class="flex-1 text-center rounded-lg px-4 py-2 text-sm font-semibold bg-page text-primary">Login</span>
            <a routerLink="/register" class="flex-1 text-center rounded-lg px-4 py-2 text-sm font-semibold text-secondary hover-text-primary hover-bg transition">Registrar</a>
          </div>

          <button type="button" class="inline-flex items-center justify-center gap-3 border border-theme text-primary font-semibold px-8 py-3 rounded-xl hover-bg transition backdrop-blur-sm cursor-pointer w-full mb-4">
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Entrar com Google
          </button>

          <div class="flex items-center gap-3 mb-4">
            <div class="flex-1 h-px border-soft"></div>
            <span class="text-muted text-sm">ou</span>
            <div class="flex-1 h-px border-soft"></div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Email ou telefone
              <input formControlName="credential" type="text" placeholder="entrar com email ou telefone"
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition" />
            </label>
            @if (submitted() && form.controls['credential'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Informe seu email ou telefone</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Senha
              <app-password-input formControlName="password" />
            </label>
            @if (submitted() && form.controls['password'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Informe sua senha</p>
            }

            <app-button type="submit" variant="solid" label="Entrar" [disabled]="submitted() && form.invalid || loading()" [loading]="loading()"></app-button>

            <p class="text-center text-secondary text-sm">
              Não tem conta?
              <a routerLink="/register" class="text-purple-300 font-semibold hover:underline">Registrar</a>
            </p>

          </form>
        </app-card>

      </div>
    </section>
  `,
})
export class LoginPage {
  protected form;
  protected readonly loading = signal(false);
  protected readonly submitted = signal(false);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private notif = inject(NotificationService);

  constructor() {
    this.form = this.fb.group({
      credential: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    this.notif.add('info', 'Bem-vindo de volta', 'Login realizado com sucesso', 'Carlos Silva');
    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/groups']);
    }, 600);
  }
}
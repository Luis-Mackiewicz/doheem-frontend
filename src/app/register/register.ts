import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../card/card';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-linear-to-br from-purple-dark to-purple-medium">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">

        <app-card title="Criar conta">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">

            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
              Nome
              <input formControlName="name" type="text" placeholder="Seu nome"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
              Email
              <input formControlName="email" type="email" placeholder="seu@email.com"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
              Senha
              <input formControlName="password" type="password" placeholder="••••••••"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
              Confirmar senha
              <input formControlName="confirmPassword" type="password" placeholder="••••••••"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition" />
            </label>

            <app-button type="submit" variant="solid">Criar conta</app-button>

            <div class="flex items-center gap-3 my-1">
              <div class="flex-1 h-px bg-white/10"></div>
              <span class="text-white/40 text-sm">ou</span>
              <div class="flex-1 h-px bg-white/10"></div>
            </div>

            <app-button type="button" variant="outline">
              <span class="flex items-center gap-3">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Entrar com Google
              </span>
            </app-button>

            <p class="text-center text-white/50 text-sm mt-2">
              Já tem conta?
              <a routerLink="/login" class="text-white font-semibold hover:underline">Entrar</a>
            </p>

          </form>
        </app-card>

      </div>
    </section>
  `,
})
export class RegisterPage {
  protected form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    console.log('Register:', this.form.value);
  }
}

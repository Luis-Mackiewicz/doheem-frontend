import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';
import { CardComponent } from '../../components/card/card';
import { PasswordInputComponent } from '../../components/password-input/password-input';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

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
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private auth = inject(AuthService);

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
    this.auth.login({ email: this.form.value.credential ?? '', password: this.form.value.password ?? '' }).subscribe({
      next: (res) => {
        this.auth.setSession(res);
        this.toast.show(`Bem-vindo de volta, ${res.user.name}!`, 'success');
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/groups';
        this.router.navigateByUrl(redirect);
      },
      error: () => {
        this.toast.show('Erro ao entrar. Credenciais inválidas.', 'error');
        this.loading.set(false);
      },
    });
  }
}
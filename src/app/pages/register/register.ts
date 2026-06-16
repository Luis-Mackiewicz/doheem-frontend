import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../components/card/card';
import { ButtonComponent } from '../../components/button/button';
import { PhoneInputComponent } from '../../components/phone-input/phone-input';
import { PasswordInputComponent } from '../../components/password-input/password-input';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { documentValidator, passwordsMatchValidator } from '../../utils/validators';
import { DocumentMaskDirective } from '../../directives/document-mask.directive';
import { DateMaskDirective } from '../../directives/date-mask.directive';
import { CepMaskDirective } from '../../directives/cep-mask.directive';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent, PhoneInputComponent, PasswordInputComponent, DocumentMaskDirective, DateMaskDirective, CepMaskDirective],
  template: `
    <section class="min-h-dvh bg-page overflow-y-auto transition-colors duration-150">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 pt-24 pb-6">

        <app-card>
          <a routerLink="/" aria-label="Voltar" class="text-secondary hover-text-primary text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← Voltar
          </a>

          <div class="flex gap-1 bg-card border border-theme rounded-xl p-1 mb-8">
            <a routerLink="/login" class="flex-1 text-center rounded-lg px-4 py-2 text-sm font-semibold text-secondary hover-text-primary hover-bg transition">Login</a>
            <span class="flex-1 text-center rounded-lg px-4 py-2 text-sm font-semibold bg-page text-primary">Registrar</span>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Nome
              <input formControlName="name" type="text" placeholder="Seu nome"
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition" />
            </label>
            @if (submitted() && form.controls['name'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Nome deve ter ao menos 3 caracteres</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              CPF ou CNPJ
              <input formControlName="documento" type="text" placeholder="000.000.000-00" appDocumentMask
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition" />
            </label>
            @if (submitted() && form.controls['documento'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Informe um CPF ou CNPJ válido</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Data de nascimento
              <input formControlName="dataNascimento" type="text" placeholder="DD/MM/AAAA" appDateMask
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition" />
            </label>
            @if (submitted() && form.controls['dataNascimento'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Informe uma data válida</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              CEP
              <input formControlName="cep" type="text" placeholder="00000-000" appCepMask
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition" />
            </label>
            @if (submitted() && form.controls['cep'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Informe um CEP</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Telefone
              <app-phone-input formControlName="phone" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Email
              <input formControlName="email" type="email" placeholder="seu@email.com"
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition" />
            </label>
            @if (submitted() && form.controls['email'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Informe um email válido</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Senha
              <app-password-input formControlName="password" />
            </label>
            @if (submitted() && form.controls['password'].invalid) {
              <p class="text-red-400 text-xs -mt-3">Senha deve ter no mínimo 6 caracteres</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Confirmar senha
              <app-password-input formControlName="confirmPassword" />
            </label>
            @if (submitted() && form.errors?.['mismatch']) {
              <p class="text-red-400 text-xs -mt-3">Senhas não conferem</p>
            }

            <app-button type="submit" variant="solid" label="Criar conta" [disabled]="submitted() && form.invalid || loading()" [loading]="loading()"></app-button>

            <p class="text-center text-secondary text-sm">
              Já tem conta?
              <a routerLink="/login" class="text-purple-300 font-semibold hover:underline">Entrar</a>
            </p>

          </form>
        </app-card>

      </div>
    </section>
  `,
})
export class RegisterPage {
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
      name: ['', [Validators.required, Validators.minLength(3)]],
      documento: ['', [Validators.required, documentValidator()]],
      dataNascimento: ['', Validators.required],
      cep: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: passwordsMatchValidator('password', 'confirmPassword') });
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.invalid || this.loading()) return;

    this.loading.set(true);
    const val = this.form.value;
    this.auth.register({
      name: val.name ?? '',
      email: val.email ?? '',
      phone: val.phone ?? '',
      password: val.password ?? '',
      document: val.documento ?? undefined,
      birth_date: this.formatDate(val.dataNascimento ?? undefined),
      cep: val.cep ?? undefined,
    }).subscribe({
      next: (res) => {
        this.auth.setSession(res);
        this.toast.show(`Bem-vindo, ${res.user.name}! Conta criada com sucesso.`, 'success');
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/groups';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        const msg = err.error?.error ?? 'Erro ao criar conta. Verifique os dados e tente novamente.';
        this.toast.show(msg, 'error');
        this.loading.set(false);
      },
    });
  }

  private formatDate(date: string | undefined): string | undefined {
    if (!date) return undefined;
    const [day, month, year] = date.replace(/\D/g, '').match(/(\d{2})(\d{2})(\d{4})/)?.slice(1) ?? [];
    if (!day || !month || !year) return undefined;
    return `${year}-${month}-${day}`;
  }
}

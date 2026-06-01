import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../components/card/card';
import { ButtonComponent } from '../../components/button/button';
import { PhoneInputComponent } from '../../components/phone-input/phone-input';
import { PasswordInputComponent } from '../../components/password-input/password-input';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent, PhoneInputComponent, PasswordInputComponent],
  template: `
    <section class="h-dvh bg-page overflow-y-auto">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 pt-24 pb-6">

        <app-card>
          <button (click)="goBack()" class="text-secondary hover:text-primary text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← 
          </button>
          <div class="flex flex-col items-center gap-1 mb-8">
            <div class="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-2">
              <svg class="w-10 h-10 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 class="text-white text-xl font-bold">Luís</h2>
            <p class="text-secondary text-sm">luis@email.com</p>
          </div>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary mb-6">
            Telefone
            <app-phone-input value="5511999990001" (phoneChange)="onPhoneChange($event)" />
          </label>

          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-px border-soft"></div>
            <span class="text-muted text-sm font-medium">Alterar senha</span>
            <div class="flex-1 h-px border-soft"></div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Nova senha
              <app-password-input [value]="form.get('newPassword')?.value ?? ''" (valueChange)="form.get('newPassword')?.setValue($event)" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Confirmar senha
              <app-password-input [value]="form.get('confirmPassword')?.value ?? ''" (valueChange)="form.get('confirmPassword')?.setValue($event)" />
            </label>

            @if (form.errors?.['mismatch'] && form.touched) {
              <p class="text-red-400 text-xs">Senhas não conferem</p>
            }

            <app-button type="submit" variant="solid" label="Salvar"></app-button>
          </form>

          <div class="mt-6 pt-4 border-t border-theme">
            <a routerLink="/login" class="flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition cursor-pointer">
              Sair da conta
            </a>
          </div>
        </app-card>

      </div>
    </section>
  `,
})
export class PerfilPage {
  protected form;
  protected phone = '5511999990001';

  constructor(private fb: FormBuilder, private location: Location) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(group: { get: (key: string) => any }) {
    const pwd = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd === confirm ? null : { mismatch: true };
  }

  goBack(): void {
    this.location.back();
  }

  onPhoneChange(value: string): void {
    this.phone = value;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    console.log('Senha alterada');
    console.log('Telefone:', this.phone);
    this.form.reset();
  }
}

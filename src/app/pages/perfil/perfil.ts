import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../components/card/card';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, CardComponent, ButtonComponent],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-linear-to-br from-purple-dark to-purple-medium">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">

        <app-card customClass="h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button (click)="goBack()" class="text-white/50 hover:text-white text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← 
          </button>
          <div class="flex flex-col items-center gap-1 mb-8">
            <div class="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-2">
              <svg class="w-10 h-10 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h2 class="text-white text-xl font-bold">Luís</h2>
            <p class="text-white/50 text-sm">luis@email.com</p>
          </div>

          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-white/40 text-sm font-medium">Alterar senha</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">
            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
              Nova senha
              <input formControlName="newPassword" type="password" placeholder="••••••••"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
              Confirmar senha
              <input formControlName="confirmPassword" type="password" placeholder="••••••••"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition" />
            </label>

            @if (form.errors?.['mismatch'] && form.touched) {
              <p class="text-red-400 text-xs">Senhas não conferem</p>
            }

            <app-button type="submit" variant="solid" label="Salvar"></app-button>
          </form>
        </app-card>

      </div>
    </section>
  `,
})
export class PerfilPage {
  protected form;

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

  onSubmit(): void {
    if (this.form.invalid) return;
    console.log('Senha alterada');
    this.form.reset();
  }
}

import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../components/card/card';
import { ButtonComponent } from '../../components/button/button';
import { PhoneInputComponent } from '../../components/phone-input/phone-input';
import { PasswordInputComponent } from '../../components/password-input/password-input';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification-service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent, PhoneInputComponent, PasswordInputComponent],
  template: `
    <section class="min-h-dvh bg-page overflow-y-auto transition-colors">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 pt-24 pb-6">

        <app-card>
          <button (click)="goBack()" aria-label="Voltar" class="text-secondary hover-text-primary text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← Voltar
          </button>

          <div class="flex flex-col items-center gap-1 mb-8">
            <div class="relative mb-2">
              @if (photoPreview()) {
                <img [src]="photoPreview()" alt="Foto do perfil"
                  class="w-24 h-24 rounded-full object-cover border-2 border-purple-500/30">
              } @else {
                <div class="w-24 h-24 rounded-full badge-purple border-2 border-purple-500/30 flex items-center justify-center">
                  <span class="text-3xl font-bold">{{ userInitials }}</span>
                </div>
              }
              <label class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center cursor-pointer shadow-lg transition">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <input type="file" accept="image/*" (change)="onPhotoSelected($event)" class="hidden" />
              </label>
            </div>
            <h2 class="text-primary text-xl font-bold">{{ userName }}</h2>
            <p class="text-secondary text-sm">{{ userEmail }}</p>
          </div>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary mb-1">
            Telefone
            <app-phone-input [value]="phone()" (phoneChange)="onPhoneChange($event)" />
          </label>
          @if (phoneError()) {
            <p class="text-red-400 text-xs mb-5">{{ phoneError() }}</p>
          }

          <div class="flex items-center gap-3 my-6">
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

            <app-button type="submit" variant="solid" label="Salvar" [disabled]="form.invalid || saving()" [loading]="saving()"></app-button>
          </form>

          <div class="mt-6 pt-4 border-t border-theme">
            <button (click)="showLogoutModal.set(true)" class="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition cursor-pointer">
              Sair da conta
            </button>
          </div>
        </app-card>

      </div>
    </section>

    <!-- Logout confirmation -->
    @if (showLogoutModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="showLogoutModal.set(false)">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm rounded-xl p-6 shadow-2xl flex flex-col bg-card border border-theme">
          <h3 class="text-primary font-bold text-lg mb-2">Sair da conta</h3>
          <p class="text-secondary text-sm">Tem certeza que deseja sair?</p>
          <div class="flex gap-3 mt-6">
            <button (click)="showLogoutModal.set(false)"
              class="flex-1 px-4 py-2.5 rounded-xl border border-theme text-secondary font-medium text-sm hover:text-primary hover-bg transition cursor-pointer">Cancelar</button>
            <a routerLink="/login" (click)="showLogoutModal.set(false)"
              class="flex-1 px-4 py-2.5 rounded-xl badge-rose font-medium text-sm hover:bg-rose-500/30 transition text-center cursor-pointer block">Sair</a>
          </div>
        </div>
      </div>
    }
  `,
})
export class PerfilPage {
  protected form;

  protected readonly saving = signal(false);
  protected readonly showLogoutModal = signal(false);
  protected readonly phone = signal('');
  protected readonly phoneError = signal('');
  protected readonly photoPreview = signal<string | null>(null);

  private mockData = inject(MockDataService);
  private notif = inject(NotificationService);
  private fb = inject(FormBuilder);
  private location = inject(Location);

  constructor() {
    const currentUser = this.mockData.membros().find(m => m.nome === this.mockData.CURRENT_USER);
    this.phone.set(currentUser?.telefone ?? '');
    if (currentUser?.fotoBase64) {
      this.photoPreview.set(currentUser.fotoBase64);
    }
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  protected get userName(): string {
    return this.mockData.CURRENT_USER;
  }

  protected get userEmail(): string {
    const member = this.mockData.membros().find(m => m.nome === this.mockData.CURRENT_USER);
    return member?.email ?? '';
  }

  protected get userInitials(): string {
    return this.mockData.CURRENT_USER.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
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
    this.phone.set(value);
    const digits = value.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 10) {
      this.phoneError.set('Telefone inválido — mínimo de 10 dígitos');
    } else {
      this.phoneError.set('');
    }
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.photoPreview.set(result);
      this.mockData.atualizarFoto(this.mockData.CURRENT_USER, result);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;

    if (this.phoneError()) return;

    this.saving.set(true);

    const phoneDigits = this.phone().replace(/\D/g, '');
    if (phoneDigits.length > 0 && phoneDigits.length < 10) {
      this.phoneError.set('Telefone inválido — mínimo de 10 dígitos');
      this.saving.set(false);
      return;
    }

    this.mockData.atualizarTelefone(this.mockData.CURRENT_USER, this.phone());

    if (this.form.get('newPassword')?.value) {
      this.notif.add('info', 'Perfil atualizado',
        'Senha alterada com sucesso',
        this.mockData.CURRENT_USER);
    }

    this.notif.add('info', 'Perfil atualizado',
      'Suas informações foram salvas',
      this.mockData.CURRENT_USER);

    this.form.reset();
    setTimeout(() => this.saving.set(false), 600);
  }
}
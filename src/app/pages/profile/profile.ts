import { Component, inject, signal, computed, effect } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../components/card/card';
import { ButtonComponent } from '../../components/button/button';
import { PhoneInputComponent } from '../../components/phone-input/phone-input';
import { PasswordInputComponent } from '../../components/password-input/password-input';
import { AuthService } from '../../services/auth.service';
import { UsersApiService } from '../../services/users-api.service';
import { NotificationService } from '../../services/notification-service';
import { ToastService } from '../../services/toast.service';
import { passwordsMatchValidator } from '../../utils/validators';
import { DocumentMaskDirective } from '../../directives/document-mask.directive';
import { CepMaskDirective } from '../../directives/cep-mask.directive';
import { DateMaskDirective } from '../../directives/date-mask.directive';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CardComponent, ButtonComponent, PhoneInputComponent, PasswordInputComponent, DocumentMaskDirective, CepMaskDirective, DateMaskDirective],
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

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-5">

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              CPF ou CNPJ
              <input formControlName="documento" type="text" placeholder="000.000.000-00" appDocumentMask
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Data de nascimento
              <input formControlName="dataNascimento" type="text" placeholder="DD/MM/AAAA" appDateMask
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Telefone
              <app-phone-input formControlName="phone" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              CEP
              <input formControlName="cep" type="text" placeholder="00000-000" appCepMask
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition" />
            </label>

            <div class="flex items-center gap-3 my-2">
              <div class="flex-1 h-px border-soft"></div>
              <span class="text-muted text-sm font-medium">Alterar senha</span>
              <div class="flex-1 h-px border-soft"></div>
            </div>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Nova senha
              <app-password-input formControlName="newPassword" />
            </label>

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Confirmar senha
              <app-password-input formControlName="confirmPassword" />
            </label>

            @if (form.errors?.['mismatch'] && form.touched) {
              <p class="text-red-400 text-xs">Senhas não conferem</p>
            }

            <app-button type="submit" variant="solid" label="Salvar" [disabled]="form.invalid || saving()" [loading]="saving()"></app-button>
          </form>

          <div class="mt-6 pt-4 border-t border-theme">
            <button (click)="confirmLogout()" class="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition cursor-pointer">
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
            <button (click)="logout()"
              class="flex-1 px-4 py-2.5 rounded-xl badge-rose font-medium text-sm hover:bg-rose-500/30 transition text-center cursor-pointer">Sair</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ProfilePage {
  protected form;

  protected readonly saving = signal(false);
  protected readonly showLogoutModal = signal(false);
  protected readonly photoPreview = signal<string | null>(null);

  private auth = inject(AuthService);
  private usersApi = inject(UsersApiService);
  private notif = inject(NotificationService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private location = inject(Location);
  private router = inject(Router);

  protected readonly profile = computed(() => {
    const me = this.usersApi.me;
    return me.hasValue() ? me.value() : undefined;
  });

  constructor() {
    const user = this.auth.currentUser();
    this.form = this.fb.group({
      documento: [''],
      dataNascimento: [''],
      phone: [user?.phone ?? ''],
      cep: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: [''],
    }, { validators: passwordsMatchValidator('newPassword', 'confirmPassword') });

    effect(() => {
      if (!this.usersApi.me.hasValue()) return;
      const p = this.usersApi.me.value();
      if (p) {
        this.form.patchValue({
          documento: p.document ?? '',
          dataNascimento: p.birth_date ?? '',
          phone: p.phone ?? '',
          cep: p.cep ?? '',
        });
        if (p.avatar_url) {
          this.photoPreview.set(p.avatar_url);
        }
      }
    });
  }

  protected get userName(): string {
    return this.auth.currentUser()?.name ?? '';
  }

  protected get userEmail(): string {
    return this.auth.currentUser()?.email ?? '';
  }

  protected get userInitials(): string {
    return this.userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  goBack(): void {
    this.location.back();
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.photoPreview.set(result);
      this.usersApi.updateProfile({ avatar_url: result }).subscribe();
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving()) return;

    this.saving.set(true);

    const { documento, dataNascimento, phone, cep, newPassword } = this.form.value;

    this.usersApi.updateProfile({
      document: documento || undefined,
      birth_date: dataNascimento || undefined,
      phone: phone || undefined,
      cep: cep || undefined,
    }).subscribe({
      next: () => {
        if (newPassword) {
          this.usersApi.changePassword({ currentPassword: '', newPassword }).subscribe();
        }
        this.toast.show('Perfil atualizado com sucesso', 'success');
        this.form.reset({ documento, dataNascimento, phone, cep });
        this.saving.set(false);
      },
      error: (err) => {
        this.toast.show(err.error?.message ?? 'Erro ao atualizar perfil', 'error');
        this.saving.set(false);
      },
    });
  }

  confirmLogout(): void {
    this.showLogoutModal.set(true);
  }

  logout(): void {
    this.auth.logout().subscribe({
      complete: () => {
        this.auth.clearSession();
        this.showLogoutModal.set(false);
        this.router.navigate(['/login']);
      },
    });
  }
}

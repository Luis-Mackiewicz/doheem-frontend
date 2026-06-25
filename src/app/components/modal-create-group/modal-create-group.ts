import { Component, EventEmitter, Output, signal, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card';
import { ButtonComponent } from '../button/button';
import { LucideX, LucideCamera, LucideBuilding2 } from '@lucide/angular';


@Component({
  selector: 'app-modal-create-group',
  imports: [FormsModule, CardComponent, ButtonComponent, LucideX, LucideCamera, LucideBuilding2],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div (click)="$event.stopPropagation()" class="w-full max-w-md">
        <app-card customClass="gap-5">
          <div class="flex items-center justify-between">
            <h2 class="text-primary font-bold text-lg">Criar grupo</h2>
            <button (click)="close.emit()" aria-label="Fechar" class="text-muted hover-text-primary transition cursor-pointer">
              <svg lucideX class="w-5 h-5"></svg>
            </button>
          </div>

          <div class="flex flex-col items-center gap-2">
            <button type="button" (click)="fileInput.click()" class="cursor-pointer group relative">
              @if (imagemPreview(); as img) {
                <img [src]="img" class="w-20 h-20 rounded-2xl object-cover border border-theme" alt="Foto do grupo" />
              } @else {
                <div class="w-20 h-20 rounded-2xl bg-card-hover border border-theme flex items-center justify-center group-hover-bg transition">
                  <svg lucideBuilding2 class="w-8 h-8 text-muted"></svg>
                </div>
              }
              <div class="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium backdrop-blur-sm gap-1">
                <svg lucideCamera class="w-3.5 h-3.5"></svg>
                Alterar
              </div>
            </button>
            <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden" />
            <span class="text-muted text-xs">Clique na foto para alterar</span>
          </div>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
            Nome do grupo
            <input type="text" placeholder="Ex: República Solaris" [(ngModel)]="name" required
              class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition w-full" />
          </label>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
            Descrição
            <textarea placeholder="Descreva o grupo..." [(ngModel)]="description" rows="3"
              class="bg-input border-theme rounded-xl px-4 py-3 text-primary placeholder:text-muted outline-none focus:border-purple-400/60 transition w-full resize-none"></textarea>
          </label>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
            Moeda
            <select [(ngModel)]="currency"
              class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full appearance-none cursor-pointer">
              @for (m of currencies; track m) {
                <option [value]="m" class="bg-card text-primary">{{ m }}</option>
              }
            </select>
          </label>

          <app-button type="button" variant="solid" label="Criar grupo" (click)="create()"></app-button>
        </app-card>
      </div>
    </div>
  `,
})
export class CreateGroupModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<{ name: string; description: string; currency: string; photo_url?: string }>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  protected name = '';
  protected description = '';
  protected currency = 'BRL';

  protected currencies = ['BRL', 'USD', 'EUR', 'GBP', 'ARS', 'PYG', 'UYU'];
  protected photoBase64 = '';
  protected readonly imagemPreview = signal('');

  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.photoBase64 = dataUrl;
      this.imagemPreview.set(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  create(): void {
    if (!this.name.trim()) return;
    this.created.emit({
      name: this.name.trim(),
      description: this.description.trim(),
      currency: this.currency,
      photo_url: this.photoBase64 || undefined,
    });
    this.close.emit();
  }
}

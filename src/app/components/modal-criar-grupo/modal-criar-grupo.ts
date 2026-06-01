import { Component, EventEmitter, Output, signal, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-modal-criar-grupo',
  imports: [FormsModule, CardComponent, ButtonComponent],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div (click)="$event.stopPropagation()" class="w-full max-w-md">
        <app-card customClass="gap-5">
          <div class="flex items-center justify-between">
            <h2 class="text-white font-bold text-lg">Criar grupo</h2>
            <button (click)="close.emit()" class="text-white/40 hover:text-white transition cursor-pointer text-xl leading-none">&times;</button>
          </div>

          <div class="flex flex-col items-center gap-2">
            <button type="button" (click)="fileInput.click()" class="cursor-pointer group relative">
              @if (imagemPreview(); as img) {
                <img [src]="img" class="w-20 h-20 rounded-2xl object-cover border border-white/20" />
              } @else {
                <div class="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl group-hover:bg-white/20 transition">🏠</div>
              }
              <div class="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium backdrop-blur-sm">
                Alterar
              </div>
            </button>
            <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden" />
            <span class="text-white/40 text-xs">Clique na foto para alterar</span>
          </div>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
            Nome do grupo
            <input type="text" placeholder="Ex: República Solaris" [(ngModel)]="nome" required
              class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full" />
          </label>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
            Descrição
            <textarea placeholder="Descreva o grupo..." [(ngModel)]="descricao" rows="3"
              class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full resize-none"></textarea>
          </label>

          <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
            Moeda
            <select [(ngModel)]="moeda"
              class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full appearance-none cursor-pointer">
              @for (m of moedas; track m) {
                <option [value]="m" class="bg-purple-dark text-white">{{ m }}</option>
              }
            </select>
          </label>

          <app-button type="button" variant="solid" label="Criar grupo" (click)="criar()"></app-button>
        </app-card>
      </div>
    </div>
  `,
})
export class ModalCriarGrupoComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<{ nome: string; descricao: string; moeda: string; imagemBase64: string }>();

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  protected nome = '';
  protected descricao = '';
  protected moeda = 'BRL';
  protected moedas = ['BRL', 'USD', 'EUR', 'GBP', 'ARS', 'PYG', 'UYU'];
  protected imagemBase64 = '';
  protected readonly imagemPreview = signal('');

  onFileSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.imagemBase64 = dataUrl;
      this.imagemPreview.set(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  criar(): void {
    if (!this.nome.trim()) return;
    this.created.emit({
      nome: this.nome.trim(),
      descricao: this.descricao.trim(),
      moeda: this.moeda,
      imagemBase64: this.imagemBase64,
    });
    this.close.emit();
  }
}

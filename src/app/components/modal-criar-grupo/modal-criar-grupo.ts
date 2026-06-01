import { Component, EventEmitter, Output, signal } from '@angular/core';
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

          <div class="flex flex-col items-center gap-3">
            @if (imagemPreview(); as img) {
              <img [src]="img" class="w-20 h-20 rounded-2xl object-cover border border-white/20" />
            } @else {
              <div class="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">🏠</div>
            }
            <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70 w-full">
              Imagem do grupo (URL)
              <input type="url" placeholder="https://..." [(ngModel)]="imagemUrl" (input)="onUrlChange()"
                class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full text-sm" />
            </label>
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
  @Output() created = new EventEmitter<{ nome: string; descricao: string; moeda: string; imagemUrl: string }>();

  protected nome = '';
  protected descricao = '';
  protected moeda = 'BRL';
  protected moedas = ['BRL', 'USD', 'EUR', 'GBP', 'ARS', 'PYG', 'UYU'];
  protected imagemUrl = '';
  protected readonly imagemPreview = signal('');

  onUrlChange(): void {
    const url = this.imagemUrl.trim();
    this.imagemPreview.set(url);
  }

  criar(): void {
    if (!this.nome.trim()) return;
    this.created.emit({
      nome: this.nome.trim(),
      descricao: this.descricao.trim(),
      moeda: this.moeda,
      imagemUrl: this.imagemUrl.trim(),
    });
    this.close.emit();
  }
}

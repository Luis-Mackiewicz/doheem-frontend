import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CardComponent } from '../card/card';

interface Membro {
  nome: string;
  telefone: string;
}

const MEMBROS: Membro[] = [
  { nome: 'Carlos Silva', telefone: '(11) 99999-0001' },
  { nome: 'Ana Oliveira', telefone: '(11) 99999-0002' },
  { nome: 'Pedro Santos', telefone: '(11) 99999-0003' },
  { nome: 'Mariana Costa', telefone: '(11) 99999-0004' },
  { nome: 'João Pereira', telefone: '(11) 99999-0005' },
  { nome: 'Fernanda Lima', telefone: '(11) 99999-0006' },
  { nome: 'Rafael Souza', telefone: '(11) 99999-0007' },
];

@Component({
  selector: 'app-modal-membros',
  imports: [CardComponent],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div (click)="$event.stopPropagation()" class="w-full max-w-md">
        <app-card>
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-primary font-bold text-lg">Membros</h2>
            <button (click)="close.emit()" class="text-muted hover:text-primary transition cursor-pointer text-xl leading-none">&times;</button>
          </div>
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-linear-to-r from-green-400 to-emerald-400 transition-all" [style.width.%]="(todos.length / maxMembros) * 100"></div>
            </div>
            <span class="text-muted text-xs whitespace-nowrap">{{ todos.length }} / {{ maxMembros }} membros</span>
          </div>

          <div class="relative mb-4">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted select-none text-sm">🔍</span>
            <input #searchInput type="text" placeholder="Pesquisar membros..."
              class="w-full bg-input border-theme rounded-xl pl-9 pr-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm"
              (input)="onSearch(searchInput.value)" />
          </div>

          <div class="flex flex-col gap-1 h-72 overflow-y-auto">
            @for (m of filtered(); track m.nome) {
              <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover-bg transition">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span class="text-secondary text-sm font-semibold">{{ m.nome.charAt(0) }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-primary text-sm font-medium truncate">{{ m.nome }}</p>
                  <p class="text-muted text-xs">{{ m.telefone }}</p>
                </div>
              </div>
            } @empty {
              <p class="text-muted text-sm text-center py-8">Nenhum membro encontrado</p>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class ModalMembrosComponent {
  @Output() close = new EventEmitter<void>();

  protected readonly maxMembros = 30;
  protected readonly todos = MEMBROS;
  protected readonly filtered = signal(MEMBROS);

  onSearch(value: string): void {
    const q = value.toLowerCase();
    this.filtered.set(this.todos.filter(m => m.nome.toLowerCase().includes(q)));
  }
}

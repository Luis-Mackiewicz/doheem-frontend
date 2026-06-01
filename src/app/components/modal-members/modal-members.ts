import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme-service';
import { LucideSearch, LucideCopy, LucideCheck, LucideX } from '@lucide/angular';

interface Membro {
  nome: string;
  telefone: string;
  admin: boolean;
}

const MEMBROS: Membro[] = [
  { nome: 'Carlos Silva', telefone: '(11) 99999-0001', admin: false },
  { nome: 'Ana Oliveira', telefone: '(11) 99999-0002', admin: true },
  { nome: 'Pedro Santos', telefone: '(11) 99999-0003', admin: false },
  { nome: 'Mariana Costa', telefone: '(11) 99999-0004', admin: false },
  { nome: 'João Pereira', telefone: '(11) 99999-0005', admin: false },
  { nome: 'Fernanda Lima', telefone: '(11) 99999-0006', admin: false },
  { nome: 'Rafael Souza', telefone: '(11) 99999-0007', admin: false },
];

@Component({
  selector: 'app-modal-membros',
  imports: [LucideSearch, LucideCopy, LucideCheck, LucideX],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div (click)="$event.stopPropagation()" class="w-full max-w-md">
        <div class="w-full rounded-xl p-6 md:p-8 border-theme shadow-2xl flex flex-col"
          [class.bg-page]="theme.theme() === 'light'"
          [class.bg-card]="theme.theme() === 'dark'"
          [class.border]="theme.theme() === 'light'"
          [class.border-theme]="theme.theme() === 'dark'">
          <div class="flex items-center justify-between mb-1">
            <h2 class="text-primary font-bold text-lg">Membros</h2>
            <button (click)="close.emit()" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
          </div>
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-linear-to-r from-green-400 to-emerald-400 transition-all" [style.width.%]="(todos.length / maxMembros) * 100"></div>
            </div>
            <span class="text-muted text-xs whitespace-nowrap">{{ todos.length }} / {{ maxMembros }} membros</span>
          </div>

          <div class="relative mb-4">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted select-none"><svg lucideSearch class="w-4 h-4"></svg></span>
            <input #searchInput type="text" placeholder="Pesquisar membros..."
              class="w-full bg-input border border-theme rounded-xl pl-9 pr-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm"
              (input)="onSearch(searchInput.value)" />
          </div>

          <div class="flex flex-col gap-1 h-72 overflow-y-auto">
            @for (m of filtered(); track m.nome) {
              <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover-bg transition">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span class="text-secondary text-sm font-semibold">{{ m.nome.charAt(0) }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="text-primary text-sm font-medium truncate">{{ m.nome }}</p>
                    @if (m.admin) {
                      <span class="text-[10px] font-medium bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full shrink-0">Admin</span>
                    }
                  </div>
                  <p class="text-muted text-xs">{{ m.telefone }}</p>
                </div>
                <button (click)="copiarTelefone(m.telefone)" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted hover:text-primary transition cursor-pointer shrink-0">
                  @if (copiedTel() === m.telefone) {
                    <svg lucideCheck class="w-4 h-4 text-emerald-400"></svg>
                  } @else {
                    <svg lucideCopy class="w-4 h-4"></svg>
                  }
                </button>
              </div>
            } @empty {
              <p class="text-muted text-sm text-center py-8">Nenhum membro encontrado</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ModalMembrosComponent {
  @Output() close = new EventEmitter<void>();

  protected theme = inject(ThemeService);
  protected readonly maxMembros = 30;
  protected readonly todos = MEMBROS;
  protected readonly filtered = signal(MEMBROS);
  protected readonly copiedTel = signal('');

  onSearch(value: string): void {
    const q = value.toLowerCase();
    this.filtered.set(this.todos.filter(m => m.nome.toLowerCase().includes(q)));
  }

  copiarTelefone(tel: string): void {
    navigator.clipboard.writeText(tel);
    this.copiedTel.set(tel);
    setTimeout(() => {
      if (this.copiedTel() === tel) this.copiedTel.set('');
    }, 1500);
  }
}

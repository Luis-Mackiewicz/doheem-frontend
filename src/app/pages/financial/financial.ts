import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  dueDate: string;
  participants: string[];
  fixed: boolean;
}

const MOCK_MEMBERS = ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'];

const CATEGORIES = [
  { value: 'moradia', label: 'Moradia', icon: '🏠' },
  { value: 'agua', label: 'Água', icon: '💧' },
  { value: 'luz', label: 'Luz', icon: '⚡' },
  { value: 'internet', label: 'Internet', icon: '🌐' },
  { value: 'aluguel', label: 'Aluguel', icon: '🔑' },
  { value: 'mercado', label: 'Mercado', icon: '🛒' },
  { value: 'lazer', label: 'Lazer', icon: '🎮' },
  { value: 'outros', label: 'Outros', icon: '📦' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 1, description: 'Conta de luz', amount: 320, category: 'luz', createdAt: '2026-05-01', dueDate: '2026-06-10', participants: ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'], fixed: false },
  { id: 2, description: 'Água', amount: 150, category: 'agua', createdAt: '2026-05-01', dueDate: '2026-06-15', participants: ['Ana', 'Carlos', 'Pedro'], fixed: false },
  { id: 3, description: 'Internet', amount: 200, category: 'internet', createdAt: '2026-05-01', dueDate: '2026-06-05', participants: ['Mariana', 'João'], fixed: true },
  { id: 4, description: 'Mercado', amount: 580, category: 'mercado', createdAt: '2026-05-20', dueDate: '2026-06-01', participants: ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'], fixed: false },
  { id: 5, description: 'Gás', amount: 95, category: 'moradia', createdAt: '2026-05-18', dueDate: '2026-06-20', participants: ['Ana', 'Pedro'], fixed: false },
];

@Component({
  selector: 'app-financeiro',
  imports: [FormsModule, ButtonComponent, DatePipe],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Financeiro</h1>
          <p class="text-white/40 text-sm mt-1">Gerencie as despesas do grupo</p>
          <div class="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mt-3"></div>
        </div>
        <app-button type="button" variant="solid" label="+ Nova Despesa" (click)="openCreate()"></app-button>
      </div>

      <!-- Total -->
      <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-lg shadow-black/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg">💰</div>
            <div>
              <p class="text-white/50 text-sm font-medium">Total do mês</p>
              <p class="text-2xl font-bold text-white tracking-tight">R$ {{ totalAmount().toFixed(2) }}</p>
            </div>
          </div>
          <span class="text-white/30 text-xs border border-white/10 rounded-lg px-2.5 py-1">{{ expenses().length }} despesas</span>
        </div>
      </div>

      <!-- List -->
      <div class="flex flex-col gap-4">
        @for (e of expenses(); track e.id) {
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/10 hover:bg-white/[0.12] transition">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg shrink-0">{{ categoryIcon(e.category) }}</div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-white font-semibold truncate">{{ e.description }}</p>
                    @if (e.fixed) {
                      <span class="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">📌 Fixa</span>
                    }
                  </div>
                  <p class="text-white/40 text-xs mt-0.5">{{ categoryLabel(e.category) }} · Vence {{ e.dueDate | date:'dd/MM' }}</p>
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                    @for (p of e.participants; track p) {
                      <span class="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{{ p }}</span>
                    }
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-white font-bold text-lg">R$ {{ e.amount.toFixed(2) }}</span>
                <div class="flex flex-col gap-1">
                  <button (click)="openEdit(e)" class="text-white/40 hover:text-white transition cursor-pointer text-sm">✏️</button>
                  <button (click)="confirmDelete(e)" class="text-white/40 hover:text-rose-400 transition cursor-pointer text-sm">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 text-center">
            <p class="text-white/40">Nenhuma despesa cadastrada</p>
          </div>
        }
      </div>
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeModal()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-lg">
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-white font-bold text-lg">{{ editingId() ? 'Editar despesa' : 'Nova despesa' }}</h2>
              <button (click)="closeModal()" class="text-white/40 hover:text-white transition cursor-pointer text-xl leading-none">&times;</button>
            </div>

            <div class="flex flex-col gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                Descrição
                <input type="text" placeholder="Ex: Conta de luz" [(ngModel)]="form.description"
                  class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full" />
              </label>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Valor
                  <input type="number" placeholder="0,00" [(ngModel)]="form.amount"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full" />
                </label>
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Categoria
                  <select [(ngModel)]="form.category"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full appearance-none cursor-pointer">
                    @for (c of categories; track c.value) {
                      <option [value]="c.value" class="bg-purple-dark text-white">{{ c.icon }} {{ c.label }}</option>
                    }
                  </select>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Data de criação
                  <input type="date" [(ngModel)]="form.createdAt"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full [color-scheme:dark]" />
                </label>
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Data de vencimento
                  <input type="date" [(ngModel)]="form.dueDate"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full [color-scheme:dark]" />
                </label>
              </div>

              <label class="flex items-center justify-between text-sm font-medium text-white/70 py-2">
                <span>Despesa fixa</span>
                <button type="button" (click)="form.fixed = !form.fixed"
                  class="relative w-11 h-6 rounded-full transition cursor-pointer"
                  [class.bg-purple-500]="form.fixed"
                  [class.bg-white/20]="!form.fixed">
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition shadow"
                    [class.translate-x-5]="form.fixed"></span>
                </button>
              </label>

              <div class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                <span>Participantes</span>
                <div class="grid grid-cols-2 gap-2 mt-1">
                  @for (m of members; track m) {
                    <label class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer text-sm">
                      <div class="w-4 h-4 rounded border-2 flex items-center justify-center transition shrink-0"
                        [class.border-purple-400]="isParticipantSelected(m)"
                        [class.border-white/30]="!isParticipantSelected(m)">
                        @if (isParticipantSelected(m)) {
                          <span class="text-purple-400 text-[10px]">✓</span>
                        }
                      </div>
                      <input type="checkbox" [checked]="isParticipantSelected(m)" (change)="toggleParticipant(m)" class="hidden" />
                      <span class="text-white">{{ m }}</span>
                    </label>
                  }
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="closeModal()"></app-button>
              <app-button type="button" variant="solid" label="{{ editingId() ? 'Salvar' : 'Criar' }}" (click)="save()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Delete confirmation -->
    @if (deleting()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelDelete()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <h2 class="text-white font-bold text-lg mb-2">Excluir despesa?</h2>
            <p class="text-white/60 text-sm">Tem certeza que deseja excluir "{{ deleting()?.description }}"?</p>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="cancelDelete()"></app-button>
              <app-button type="button" variant="solid" label="Excluir" (click)="deleteExpense()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class FinanceiroPage {
  protected readonly members = MOCK_MEMBERS;
  protected readonly categories = CATEGORIES;

  protected expenses = signal<Expense[]>([...MOCK_EXPENSES]);
  protected showModal = signal(false);
  protected editingId = signal<number | null>(null);
  protected deleting = signal<Expense | null>(null);

  protected form = this.emptyForm();

  protected totalAmount = () => this.expenses().reduce((sum, e) => sum + e.amount, 0);

  private emptyForm() {
    return {
      description: '',
      amount: 0,
      category: 'outros',
      createdAt: '',
      dueDate: '',
      participants: [] as string[],
      fixed: false,
    };
  }

  categoryLabel(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  categoryIcon(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.icon ?? '📦';
  }

  isParticipantSelected(name: string): boolean {
    return this.form.participants.includes(name);
  }

  toggleParticipant(name: string): void {
    const idx = this.form.participants.indexOf(name);
    if (idx >= 0) {
      this.form.participants.splice(idx, 1);
    } else {
      this.form.participants.push(name);
    }
  }

  openCreate(): void {
    this.editingId.set(null);
    this.form = this.emptyForm();
    this.showModal.set(true);
  }

  openEdit(e: Expense): void {
    this.editingId.set(e.id);
    this.form = { ...e, participants: [...e.participants] };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
  }

  save(): void {
    if (!this.form.description.trim() || !this.form.amount) return;
    const expense: Expense = {
      id: this.editingId() ?? Date.now(),
      description: this.form.description.trim(),
      amount: this.form.amount,
      category: this.form.category,
      createdAt: this.form.createdAt || new Date().toISOString().slice(0, 10),
      dueDate: this.form.dueDate || new Date().toISOString().slice(0, 10),
      participants: this.form.participants.length ? this.form.participants : [...this.members],
      fixed: this.form.fixed,
    };
    this.expenses.update(list => {
      if (this.editingId()) {
        return list.map(e => e.id === expense.id ? expense : e);
      }
      return [...list, expense];
    });
    this.closeModal();
  }

  confirmDelete(e: Expense): void {
    this.deleting.set(e);
  }

  cancelDelete(): void {
    this.deleting.set(null);
  }

  deleteExpense(): void {
    const target = this.deleting();
    if (!target) return;
    this.expenses.update(list => list.filter(e => e.id !== target.id));
    this.deleting.set(null);
  }
}

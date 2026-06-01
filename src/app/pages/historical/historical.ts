import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

interface SplitValue {
  name: string;
  value: number;
}

type SplitMode = 'equal' | 'some' | 'custom';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  competenceDate: string;
  dueDate: string;
  paidBy: string;
  splitMode: SplitMode;
  splitValues: SplitValue[];
  installments: number;
  firstDueDate: string;
  fixed: boolean;
}

const MOCK_MEMBERS = ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'];

const CATEGORIES = [
  { value: 'aluguel', label: 'Aluguel', icon: '🔑' },
  { value: 'energia', label: 'Energia', icon: '⚡' },
  { value: 'internet', label: 'Internet', icon: '🌐' },
  { value: 'agua', label: 'Água', icon: '💧' },
  { value: 'compras', label: 'Compras', icon: '🛒' },
  { value: 'limpeza', label: 'Limpeza', icon: '🧹' },
  { value: 'outros', label: 'Outros', icon: '📦' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 1, description: 'Conta de luz', amount: 320, category: 'energia', competenceDate: '2025-03-10', dueDate: '2025-04-10', paidBy: 'Ana', splitMode: 'equal', splitValues: MOCK_MEMBERS.map(n => ({ name: n, value: 64 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 2, description: 'Água', amount: 150, category: 'agua', competenceDate: '2025-04-01', dueDate: '2025-05-01', paidBy: 'Carlos', splitMode: 'some', splitValues: ['Ana', 'Carlos', 'Pedro'].map(n => ({ name: n, value: 50 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 3, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2025-04-05', dueDate: '2025-05-05', paidBy: 'Mariana', splitMode: 'some', splitValues: ['Mariana', 'João'].map(n => ({ name: n, value: 100 })), installments: 3, firstDueDate: '2025-04-05', fixed: true },
  { id: 4, description: 'Aluguel', amount: 1800, category: 'aluguel', competenceDate: '2025-05-01', dueDate: '2026-06-05', paidBy: 'Pedro', splitMode: 'equal', splitValues: MOCK_MEMBERS.map(n => ({ name: n, value: 360 })), installments: 1, firstDueDate: '', fixed: true },
  { id: 5, description: 'Compras mercado', amount: 580, category: 'compras', competenceDate: '2025-05-20', dueDate: '2025-06-01', paidBy: 'Pedro', splitMode: 'equal', splitValues: MOCK_MEMBERS.map(n => ({ name: n, value: 116 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 6, description: 'Material de limpeza', amount: 95, category: 'limpeza', competenceDate: '2025-05-22', dueDate: '2025-06-20', paidBy: 'Ana', splitMode: 'some', splitValues: ['Ana', 'Pedro'].map(n => ({ name: n, value: 47.5 })), installments: 2, firstDueDate: '2025-05-22', fixed: false },
  { id: 7, description: 'Conta de luz', amount: 340, category: 'energia', competenceDate: '2026-05-01', dueDate: '2026-06-10', paidBy: 'Ana', splitMode: 'equal', splitValues: MOCK_MEMBERS.map(n => ({ name: n, value: 68 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 8, description: 'Água', amount: 155, category: 'agua', competenceDate: '2026-05-05', dueDate: '2026-06-15', paidBy: 'Carlos', splitMode: 'some', splitValues: ['Ana', 'Carlos', 'Pedro'].map(n => ({ name: n, value: 51.67 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 9, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2026-05-10', dueDate: '2026-06-05', paidBy: 'Mariana', splitMode: 'some', splitValues: ['Mariana', 'João'].map(n => ({ name: n, value: 100 })), installments: 3, firstDueDate: '2026-05-10', fixed: true },
  { id: 10, description: 'Mercado do mês', amount: 620, category: 'compras', competenceDate: '2026-06-01', dueDate: '2026-06-25', paidBy: 'Pedro', splitMode: 'equal', splitValues: MOCK_MEMBERS.map(n => ({ name: n, value: 124 })), installments: 1, firstDueDate: '', fixed: false },
];

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

@Component({
  selector: 'app-historico',
  imports: [DatePipe],
  template: `
    <div class="flex flex-col gap-8 h-full">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tight">Histórico</h1>
        <p class="text-white/40 text-sm mt-1">Consulte todas as despesas desde a criação do grupo</p>
        <div class="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mt-3"></div>
      </div>

      <!-- Month navigator -->
      <div class="flex items-center justify-between rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 shadow-lg shadow-black/10">
        <button (click)="prevMonth()" class="text-white/60 hover:text-white transition text-lg px-2 cursor-pointer">◄</button>
        <div class="flex items-center gap-3">
          <span class="text-white font-bold text-lg">{{ selectedMonthName() }}</span>
          <span class="text-white/50 text-sm">{{ selectedYear() }}</span>
        </div>
        <button (click)="nextMonth()" class="text-white/60 hover:text-white transition text-lg px-2 cursor-pointer">►</button>
      </div>

      <!-- Total do mês -->
      <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-lg shadow-black/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg">📋</div>
            <div>
              <p class="text-white/50 text-sm font-medium">Total do mês</p>
              <p class="text-2xl font-bold text-white tracking-tight">R$ {{ monthlyTotal().toFixed(2) }}</p>
            </div>
          </div>
          <span class="text-white/30 text-xs border border-white/10 rounded-lg px-2.5 py-1">{{ monthlyExpenses().length }} despesas</span>
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 flex flex-col gap-4 min-h-0">
        @if (monthlyExpenses().length > 0) {
          @for (e of monthlyExpenses(); track e.id) {
            <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/10 hover:bg-white/[0.12] transition">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-4 min-w-0 flex-1">
                  <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg shrink-0">{{ categoryIcon(e.category) }}</div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-white font-semibold truncate">{{ e.description }}</p>
                      @if (e.installments > 1) {
                        <span class="text-[10px] font-medium bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{{ e.installments }}x R$ {{ (e.amount / e.installments).toFixed(2) }}</span>
                      }
                      @if (e.fixed) {
                        <span class="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">📌 Fixa</span>
                      }
                    </div>
                    <p class="text-white/40 text-xs mt-0.5">{{ categoryLabel(e.category) }} · {{ e.competenceDate | date:'dd/MM/yyyy' }} · Pago por {{ e.paidBy }}</p>
                    <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span class="text-[11px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{{ splitModeLabel(e.splitMode) }}</span>
                      @for (sv of e.splitValues; track sv.name) {
                        <span class="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{{ sv.name }} R$ {{ sv.value.toFixed(2) }}</span>
                      }
                    </div>
                  </div>
                </div>
                <span class="text-white font-bold text-lg shrink-0">R$ {{ e.amount.toFixed(2) }}</span>
              </div>
            </div>
          }
        } @else {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <p class="text-4xl mb-3">📭</p>
              <p class="text-white/40 text-lg font-medium">Nenhuma despesa neste mês</p>
              <p class="text-white/30 text-sm mt-1">Não houve despesas registradas em {{ selectedMonthName() }} de {{ selectedYear() }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class HistoricoPage {
  private readonly today = new Date();
  protected readonly selectedYear = signal(this.today.getFullYear());
  protected readonly selectedMonth = signal(this.today.getMonth()); // 0-indexed

  private readonly allExpenses = [...MOCK_EXPENSES];

  protected readonly selectedMonthName = computed(() => MONTHS[this.selectedMonth()]);

  protected readonly monthlyExpenses = computed(() => {
    return this.allExpenses.filter(e => {
      const d = new Date(e.competenceDate + 'T00:00:00');
      return d.getFullYear() === this.selectedYear() && d.getMonth() === this.selectedMonth();
    });
  });

  protected readonly monthlyTotal = computed(() => {
    return this.monthlyExpenses().reduce((sum, e) => sum + e.amount, 0);
  });

  prevMonth(): void {
    if (this.selectedMonth() === 0) {
      this.selectedYear.update(y => y - 1);
      this.selectedMonth.set(11);
    } else {
      this.selectedMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.selectedMonth() === 11) {
      this.selectedYear.update(y => y + 1);
      this.selectedMonth.set(0);
    } else {
      this.selectedMonth.update(m => m + 1);
    }
  }

  categoryLabel(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  categoryIcon(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.icon ?? '📦';
  }

  splitModeLabel(mode: SplitMode): string {
    const map: Record<SplitMode, string> = { equal: 'Igualitário', some: 'Parcial', custom: 'Personalizado' };
    return map[mode] ?? '';
  }
}

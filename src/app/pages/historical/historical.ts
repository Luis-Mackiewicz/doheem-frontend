import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { BuscaComponent } from '../../components/busca/busca';
import {
  LucideHouse,
  LucideZap,
  LucideWifi,
  LucideDroplets,
  LucideShoppingCart,
  LucideSparkles,
  LucidePackage,
  LucideChevronLeft,
  LucideChevronRight,
  LucideHistory,
  LucidePin,
  LucideInbox,
} from '@lucide/angular';

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
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'energia', label: 'Energia' },
  { value: 'internet', label: 'Internet' },
  { value: 'agua', label: 'Água' },
  { value: 'compras', label: 'Compras' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'outros', label: 'Outros' },
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
  imports: [DatePipe, PaginacaoComponent, BuscaComponent,
    LucideHouse, LucideZap, LucideWifi, LucideDroplets, LucideShoppingCart,
    LucideSparkles, LucidePackage, LucideChevronLeft, LucideChevronRight,
    LucideHistory, LucidePin, LucideInbox,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full">
      <div>
        <h1 class="text-3xl font-bold text-primary tracking-tight">Histórico</h1>
      </div>

      <div class="flex items-center justify-between rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10">
        <button (click)="prevMonth()" [class.opacity-40]="atMinMonth()" [class.cursor-not-allowed]="atMinMonth()" [class.hover:text-white/60]="atMinMonth()" class="text-secondary hover:text-primary transition px-2 cursor-pointer"><svg lucideChevronLeft class="w-5 h-5"></svg></button>
        <div class="flex items-center gap-3">
          <span class="text-primary font-bold text-lg">{{ selectedMonthName() }}</span>
          <span class="text-secondary text-sm">{{ selectedYear() }}</span>
        </div>
        <button (click)="nextMonth()" class="text-secondary hover:text-primary transition px-2 cursor-pointer"><svg lucideChevronRight class="w-5 h-5"></svg></button>
      </div>

      <div class="rounded-2xl bg-card border border-theme p-6 shadow-lg shadow-black/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><svg lucideHistory class="w-5 h-5 text-purple-300"></svg></div>
            <div>
              <p class="text-secondary text-sm font-medium">Total do mês</p>
              <p class="text-2xl font-bold text-primary tracking-tight">R$ {{ monthlyTotal().toFixed(2) }}</p>
            </div>
          </div>
          <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ monthlyExpenses().length }} despesas</span>
        </div>
      </div>

      <app-search placeholder="Pesquisar por descrição, categoria ou responsável..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col gap-4 min-h-0">
        @if (searchedExpenses().length > 0) {
          @for (e of paginatedExpenses(); track e.id) {
            <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 hover:bg-card-hover transition">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-4 min-w-0 flex-1">
                  <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    @switch (e.category) {
                      @case ('aluguel') { <svg lucideHouse class="w-5 h-5 text-purple-300"></svg> }
                      @case ('energia') { <svg lucideZap class="w-5 h-5 text-purple-300"></svg> }
                      @case ('internet') { <svg lucideWifi class="w-5 h-5 text-purple-300"></svg> }
                      @case ('agua') { <svg lucideDroplets class="w-5 h-5 text-purple-300"></svg> }
                      @case ('compras') { <svg lucideShoppingCart class="w-5 h-5 text-purple-300"></svg> }
                      @case ('limpeza') { <svg lucideSparkles class="w-5 h-5 text-purple-300"></svg> }
                      @default { <svg lucidePackage class="w-5 h-5 text-purple-300"></svg> }
                    }
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-primary font-semibold truncate">{{ e.description }}</p>
                      @if (e.installments > 1) {
                        <span class="text-[10px] font-medium bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{{ e.installments }}x R$ {{ (e.amount / e.installments).toFixed(2) }}</span>
                      }
                      @if (e.fixed) {
                        <span class="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-0.5"><svg lucidePin class="w-3 h-3"></svg> Fixa</span>
                      }
                    </div>
                    <p class="text-muted text-xs mt-0.5">{{ categoryLabel(e.category) }} · {{ e.competenceDate | date:'dd/MM/yyyy' }} · Pago por {{ e.paidBy }}</p>
                    <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span class="text-[11px] bg-white/10 text-secondary px-2 py-0.5 rounded-full">{{ splitModeLabel(e.splitMode) }}</span>
                      @for (sv of e.splitValues; track sv.name) {
                        <span class="text-[11px] bg-white/10 text-secondary px-2 py-0.5 rounded-full">{{ sv.name }} R$ {{ sv.value.toFixed(2) }}</span>
                      }
                    </div>
                  </div>
                </div>
                <span class="text-primary font-bold text-lg shrink-0">R$ {{ e.amount.toFixed(2) }}</span>
              </div>
            </div>
          }
          <app-paginator [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="goToPage($event)" />
        } @else {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <svg lucideInbox class="w-10 h-10 text-muted mb-3 mx-auto"></svg>
              <p class="text-muted text-lg font-medium">Nenhuma despesa neste mês</p>
              <p class="text-muted text-sm mt-1">Não houve despesas registradas em {{ selectedMonthName() }} de {{ selectedYear() }}</p>
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
  protected readonly selectedMonth = signal(this.today.getMonth()); 

  private readonly allExpenses = [...MOCK_EXPENSES];

  private readonly minDate = new Date(Math.min(...this.allExpenses.map(e => new Date(e.competenceDate + 'T00:00:00').getTime())));
  private readonly minYear = this.minDate.getFullYear();
  private readonly minMonth = this.minDate.getMonth();

  protected readonly atMinMonth = computed(() => this.selectedYear() === this.minYear && this.selectedMonth() === this.minMonth);

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

  // Search
  protected readonly searchQuery = signal('');

  protected readonly searchedExpenses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let list = this.monthlyExpenses();
    if (query) {
      list = list.filter(e =>
        e.description.toLowerCase().includes(query) ||
        this.categoryLabel(e.category).toLowerCase().includes(query) ||
        e.paidBy.toLowerCase().includes(query)
      );
    }
    return list;
  });

  // Pagination
  protected readonly pageSize = 3;
  protected readonly currentPage = signal(1);

  protected readonly paginatedExpenses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.searchedExpenses().slice(start, start + this.pageSize);
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.searchedExpenses().length / this.pageSize)
  );

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  prevMonth(): void {
    if (this.atMinMonth()) return;
    this.currentPage.set(1);
    if (this.selectedMonth() === 0) {
      this.selectedYear.update(y => y - 1);
      this.selectedMonth.set(11);
    } else {
      this.selectedMonth.update(m => m - 1);
    }
  }

  nextMonth(): void {
    this.currentPage.set(1);
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

  splitModeLabel(mode: SplitMode): string {
    const map: Record<SplitMode, string> = { equal: 'Igualitário', some: 'Parcial', custom: 'Personalizado' };
    return map[mode] ?? '';
  }
}

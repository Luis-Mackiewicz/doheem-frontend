import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { SearchComponent } from '../../components/search/search';
import { MockDataService, Payment } from '../../services/mock-data.service';
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
  LucideCheckCircle,
  LucideImage,
} from '@lucide/angular';

@Component({
  selector: 'app-historical',
  imports: [DatePipe, PaginatorComponent, SearchComponent,
    LucideHouse, LucideZap, LucideWifi, LucideDroplets, LucideShoppingCart,
    LucideSparkles, LucidePackage, LucideChevronLeft, LucideChevronRight,
    LucideHistory, LucidePin, LucideInbox, LucideCheckCircle, LucideImage,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <div>
        <h1 class="text-3xl font-bold text-primary tracking-tight">Histórico</h1>
      </div>

      <div class="flex items-center justify-between rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10">
        <button (click)="prevMonth()" [class.opacity-40]="atMinMonth()" [class.cursor-not-allowed]="atMinMonth()" aria-label="Mês anterior"
          class="text-secondary hover-text-primary transition px-2 cursor-pointer"><svg lucideChevronLeft class="w-5 h-5"></svg></button>
        <div class="flex items-center gap-3">
          <span class="text-primary font-bold text-lg">{{ selectedMonthName() }}</span>
          <span class="text-secondary text-sm">{{ selectedYear() }}</span>
        </div>
        <button (click)="nextMonth()" aria-label="Próximo mês"
          class="text-secondary hover-text-primary transition px-2 cursor-pointer"><svg lucideChevronRight class="w-5 h-5"></svg></button>
      </div>

      <div class="rounded-2xl bg-card border border-theme p-6 shadow-lg shadow-black/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl badge-purple flex items-center justify-center"><svg lucideHistory class="w-5 h-5"></svg></div>
            <div>
              <p class="text-secondary text-sm font-medium">Total do mês</p>
              <p class="text-2xl font-bold text-primary tracking-tight">R$ {{ fmt(monthlyTotal()) }}</p>
            </div>
          </div>
          <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ monthlyExpenses().length }} despesas</span>
        </div>
      </div>

      <app-search placeholder="Pesquisar por descrição, categoria ou responsável..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col gap-4 min-h-0">
        @for (e of paginatedExpenses(); track e.id) {
          <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 hover:bg-card-hover transition">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  @switch (e.category) {
                    @case ('aluguel') { <svg lucideHouse class="w-5 h-5 text-(--badge-purple)"></svg> }
                    @case ('energia') { <svg lucideZap class="w-5 h-5 text-(--badge-purple)"></svg> }
                    @case ('internet') { <svg lucideWifi class="w-5 h-5 text-(--badge-purple)"></svg> }
                    @case ('agua') { <svg lucideDroplets class="w-5 h-5 text-(--badge-purple)"></svg> }
                    @case ('compras') { <svg lucideShoppingCart class="w-5 h-5 text-(--badge-purple)"></svg> }
                    @case ('limpeza') { <svg lucideSparkles class="w-5 h-5 text-(--badge-purple)"></svg> }
                    @default { <svg lucidePackage class="w-5 h-5 text-(--badge-purple)"></svg> }
                  }
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-primary font-semibold truncate">{{ e.description }}</p>
                    @if (e.installmentGroup; as ig) {
                      <span class="text-[10px] font-medium badge-purple px-2 py-0.5 rounded-full">Parcela {{ ig.index }}/{{ ig.total }}</span>
                    }
                    @if (e.fixed) {
                      <span class="text-[10px] font-medium badge-amber px-2 py-0.5 rounded-full flex items-center gap-0.5"><svg lucidePin class="w-3 h-3"></svg> Fixa</span>
                    }
                  </div>
                  <p class="text-muted text-xs mt-0.5">{{ categoryLabel(e.category) }} · {{ monthLabel(e.competenceDate) }} · Pago por {{ e.paidBy }} @if (e.dueDate) { · Vence {{ e.dueDate | date:'dd/MM/yyyy' }} }</p>
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span class="text-[11px] bg-card-hover text-secondary px-2 py-0.5 rounded-full">{{ splitModeLabel(e.splitMode) }}</span>
                    @for (sv of e.splitValues; track sv.name) {
                      <span class="text-[11px] bg-card-hover text-secondary px-2 py-0.5 rounded-full">{{ sv.name }} R$ {{ fmt(sv.value) }}</span>
                    }
                  </div>
                </div>
              </div>
              <span class="text-primary font-bold text-lg shrink-0">R$ {{ fmt(e.amount) }}</span>
            </div>
            @if (paymentsByExpense().get(e.id)?.length) {
              <div class="border-t border-theme mt-4 pt-4">
                <p class="text-secondary text-xs font-medium mb-3 flex items-center gap-1.5"><svg lucideCheckCircle class="w-3.5 h-3.5 text-emerald-400"></svg> Comprovantes</p>
                @for (p of paymentsByExpense().get(e.id)!; track p.memberName) {
                  <div class="flex items-start gap-3 rounded-xl bg-card-strong p-3 mb-2 last:mb-0">
                    @if (p.receiptBase64) {
                      <img [src]="p.receiptBase64" class="w-12 h-12 rounded-lg object-cover border border-theme shrink-0 cursor-pointer hover:opacity-80 transition" (click)="expandReceipt.set(p.receiptBase64)" />
                    } @else {
                      <div class="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-dashed border-amber-500/30"><svg lucideImage class="w-5 h-5 text-amber-400/60"></svg></div>
                    }
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-primary text-sm font-semibold">{{ p.memberName }}</span>
                        <span class="text-muted text-[11px]">{{ p.paidAt }}</span>
                      </div>
                      <div class="flex items-center gap-2 flex-wrap mt-0.5">
                        <span class="text-secondary text-xs">R$ {{ fmt(paymentAmount(e, p)) }}</span>
                        @if (p.approvedBy) {
                          <span class="text-[11px] text-emerald-400/80">Aprovado por {{ p.approvedBy }}</span>
                        }
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        } @empty {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <svg lucideInbox class="w-10 h-10 text-muted mb-3 mx-auto"></svg>
              <p class="text-muted text-lg font-medium">Nenhuma despesa neste mês</p>
              <p class="text-muted text-sm mt-1">Não houve despesas registradas em {{ selectedMonthName() }} de {{ selectedYear() }}</p>
            </div>
          </div>
        }
      </div>
      <app-paginator [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="goToPage($event)" />
    </div>

    <!-- Receipt expand -->
    @if (expandReceipt(); as url) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4" (click)="expandReceipt.set('')">
        <img [src]="url" class="max-w-full max-h-full object-contain rounded-2xl" (click)="$event.stopPropagation()" />
      </div>
    }
  `,
})
export class HistoricalPage {
  private mockData = inject(MockDataService);
  private readonly today = new Date();

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected expandReceipt = signal('');
  protected readonly payments = this.mockData.payments;

  protected readonly paymentsByExpense = computed(() => {
    const map = new Map<number, Payment[]>();
    for (const p of this.payments()) {
      if (p.status !== 'approved' && p.status !== 'awaiting') continue;
      const list = map.get(p.expenseId) ?? [];
      list.push(p);
      map.set(p.expenseId, list);
    }
    return map;
  });

  protected paymentAmount(expense: { splitValues: { name: string; value: number }[] }, payment: Payment): number {
    return expense.splitValues.find(sv => sv.name === payment.memberName)?.value ?? 0;
  }

  protected readonly selectedYear = signal(this.today.getFullYear());
  protected readonly selectedMonth = signal(this.today.getMonth()); 

  private readonly allExpenses = this.mockData.historicalExpenses;

  private readonly minDate = new Date(Math.min(...this.allExpenses.map(e => new Date(e.competenceDate + 'T00:00:00').getTime())));
  private readonly minYear = this.minDate.getFullYear();
  private readonly minMonth = this.minDate.getMonth();

  protected readonly atMinMonth = computed(() => this.selectedYear() === this.minYear && this.selectedMonth() === this.minMonth);

  protected readonly selectedMonthName = computed(() => {
    const d = new Date(this.selectedYear(), this.selectedMonth());
    return d.toLocaleDateString('pt-BR', { month: 'long' });
  });

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

  protected monthLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

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
    return this.mockData.CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  splitModeLabel(mode: string): string {
    const map: Record<string, string> = { equal: 'Igualitário', some: 'Parcial', custom: 'Personalizado' };
    return map[mode] ?? '';
  }
}
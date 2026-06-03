import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { BuscaComponent } from '../../components/busca/busca';
import { MockDataService } from '../../services/mock-data.service';
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
  private mockData = inject(MockDataService);
  private readonly today = new Date();
  protected readonly selectedYear = signal(this.today.getFullYear());
  protected readonly selectedMonth = signal(this.today.getMonth()); 

  private readonly allExpenses = this.mockData.historicalExpenses;

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
    return this.mockData.CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  splitModeLabel(mode: string): string {
    const map: Record<string, string> = { equal: 'Igualitário', some: 'Parcial', custom: 'Personalizado' };
    return map[mode] ?? '';
  }
}

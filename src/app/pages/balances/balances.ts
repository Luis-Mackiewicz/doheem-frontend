import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService, ResidentBalance } from '../../services/mock-data.service';
import { BuscaComponent } from '../../components/busca/busca';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { LucideUsers } from '@lucide/angular';

@Component({
  selector: 'app-balances',
  imports: [BuscaComponent, PaginacaoComponent, LucideUsers],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <svg lucideUsers class="w-5 h-5 text-purple-300"></svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-primary tracking-tight">Saldo dos Moradores</h1>
          </div>
        </div>
        <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ filtered().length }} moradores</span>
      </div>

      <app-search placeholder="Pesquisar por nome..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col gap-4 min-h-0">
        <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-muted border-b border-theme">
                  <th class="text-left pb-3 font-medium">Morador</th>
                  <th class="text-right pb-3 font-medium">Deve</th>
                  <th class="text-right pb-3 font-medium">A receber</th>
                </tr>
              </thead>
              <tbody>
                @for (r of paginated(); track r.name) {
                  <tr class="border-b border-soft last:border-b-0">
                    <td class="py-3.5 text-primary font-medium">{{ r.name }}</td>
                    <td class="py-3.5 text-right">
                      @if (r.owes > 0) {
                        <span class="text-primary font-medium">R$ {{ fmt(r.owes) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                    <td class="py-3.5 text-right">
                      @if (r.toReceive > 0) {
                        <span class="text-primary font-medium">R$ {{ fmt(r.toReceive) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="text-center py-8 text-muted">Nenhum morador encontrado</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <app-paginator [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="goToPage($event)" />
      </div>
    </div>
  `,
})
export class BalancesPage {
  private mockData = inject(MockDataService);
  protected readonly pageSize = 5;

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected readonly searchQuery = signal('');
  protected readonly currentPage = signal(1);

  protected readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    let list = this.mockData.residents;
    if (q) {
      list = list.filter(r => r.name.toLowerCase().includes(q));
    }
    return list;
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filtered().length / this.pageSize)
  );

  protected readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}

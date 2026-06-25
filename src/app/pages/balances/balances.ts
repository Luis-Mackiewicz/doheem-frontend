import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupStoreService } from '../../services/group-store.service';
import { SearchComponent } from '../../components/search/search';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { LucideUsers, LucideArrowDown, LucideArrowUp, LucideWallet } from '@lucide/angular';

@Component({
  selector: 'app-balances',
  imports: [SearchComponent, PaginatorComponent, LucideUsers, LucideArrowDown, LucideArrowUp, LucideWallet],
  template: `
    <div class="flex flex-col gap-6 h-full transition-colors duration-150">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl badge-purple flex items-center justify-center">
            <svg lucideUsers class="w-5 h-5"></svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-primary tracking-tight">Saldo dos Moradores</h1>
          </div>
        </div>
        <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ filtered().length }} moradores</span>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (i of [1,2,3]; track i) {
            <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 animate-pulse">
              <div class="h-4 bg-card-strong rounded w-24 mb-3"></div>
              <div class="h-7 bg-card-strong rounded w-32"></div>
            </div>
          }
        </div>
        <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 animate-pulse">
          <div class="h-6 bg-card-strong rounded w-40 mb-4"></div>
          <div class="space-y-3">
            @for (i of [1,2,3]; track i) {
              <div class="h-4 bg-card-strong rounded w-full"></div>
            }
          </div>
        </div>
      } @else {
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideArrowDown class="w-4 h-4 text-rose-400"></svg>
            <p class="text-secondary text-sm font-medium">Você deve</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ {{ fmt(youOwe()) }}</p>
        </div>
        <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideArrowUp class="w-4 h-4 text-emerald-400"></svg>
            <p class="text-secondary text-sm font-medium">Você tem a receber</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ {{ fmt(youReceive()) }}</p>
        </div>
        <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideWallet class="w-4 h-4 text-(--badge-purple)"></svg>
            <p class="text-secondary text-sm font-medium">Dívida total do grupo</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ {{ fmt(totalDebt()) }}</p>
          <p class="text-muted text-xs mt-1">Em aberto</p>
        </div>
      </div>

      <app-search placeholder="Pesquisar por nome..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col min-h-0">
        <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-muted border-b border-theme">
                  <th scope="col" class="text-left pb-3 font-medium">Morador</th>
                  <th scope="col" class="text-right pb-3 font-medium">Deve</th>
                  <th scope="col" class="text-right pb-3 font-medium">A receber</th>
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
      </div>
      <app-paginator [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="goToPage($event)" />
      }
    </div>
  `,
})
export class BalancesPage {
  private route = inject(ActivatedRoute);
  protected store = inject(GroupStoreService);
  protected readonly pageSize = 5;

  protected readonly searchQuery = signal('');
  protected readonly currentPage = signal(1);

  constructor() {
    const groupId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    this.store.setGroupId(groupId);
  }

  protected readonly loading = computed(() =>
    this.store.balancesLoading()
  );

  protected readonly youOwe = computed(() => this.store.balanceSummary().youOwe);
  protected readonly youReceive = computed(() => this.store.balanceSummary().youReceive);
  protected readonly totalDebt = computed(() => this.store.balanceSummary().totalDebt);

  protected readonly allResidents = computed(() => this.store.balanceSummary().residents);

  protected readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const list = this.allResidents();
    if (!q) return list;
    return list.filter(r => r.name.toLowerCase().includes(q));
  });

  protected readonly totalPages = computed(() =>
    Math.ceil(this.filtered().length / this.pageSize)
  );

  protected readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

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
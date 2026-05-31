import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';

interface Group {
  id: number;
  name: string;
  members: number;
  monthlyFee: number;
}

const MOCK_GROUPS: Group[] = [
  { id: 1, name: 'República Solaris', members: 12, monthlyFee: 450 },
  { id: 2, name: 'Casa do Estudante', members: 8, monthlyFee: 320 },
  { id: 3, name: 'Alojamento Universitário', members: 5, monthlyFee: 280 },
  { id: 4, name: 'República Bela Vista', members: 10, monthlyFee: 520 },
  { id: 5, name: 'Pensionato Central', members: 6, monthlyFee: 390 },
  { id: 6, name: 'Kitnet Compartilhada', members: 4, monthlyFee: 250 },
  { id: 7, name: 'Casa da Praia', members: 7, monthlyFee: 600 },
  { id: 8, name: 'República Aurora', members: 9, monthlyFee: 410 },
  { id: 9, name: 'Alojamento Rural', members: 3, monthlyFee: 200 },
  { id: 10, name: 'Vila Estudantil', members: 15, monthlyFee: 350 },
  { id: 11, name: 'Casa República Nova', members: 6, monthlyFee: 480 },
  { id: 12, name: 'Pensionato São Jorge', members: 8, monthlyFee: 370 },
];

@Component({
  selector: 'app-groups',
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-linear-to-br from-purple-dark to-purple-medium">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">

        <div class="w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-10">

          <a routerLink="/" class="text-white/50 hover:text-white text-sm flex items-center gap-1.5 mb-6 transition">
            ← Voltar
          </a>

          <h2 class="text-2xl font-bold text-white mb-6">Grupos</h2>

          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 select-none">🔍</span>
              <input #searchInput type="text" placeholder="Pesquisar grupos..."
                class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition"
                (input)="onSearch(searchInput.value)" />
            </div>
            <app-button variant="solid" type="button" label="+ Criar"></app-button>
            <app-button variant="outline" type="button" label="Entrar"></app-button>
          </div>

          <div class="flex flex-col">
            @for (group of filteredGroups(); track group.id) {
              <a [routerLink]="'/groups/' + group.id + '/dashboard'" class="flex items-center justify-between py-4 px-3 -mx-3 rounded-xl transition cursor-pointer border-b border-white/10 last:border-b-0 hover:bg-white/5">
                <div class="flex items-center gap-4 min-w-0">
                  <span class="text-2xl shrink-0">🏠</span>
                  <div class="min-w-0">
                    <p class="text-white font-semibold truncate">{{ group.name }}</p>
                    <p class="text-white/50 text-sm">{{ group.members }} membros · R$ {{ group.monthlyFee }}/mês</p>
                  </div>
                </div>
                <span class="text-white/30 text-lg shrink-0">›</span>
              </a>
            } @empty {
              <p class="text-white/40 text-center py-12">Nenhum grupo encontrado</p>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="flex items-center justify-center gap-1 mt-6 pt-4 border-t border-white/10">
              <button (click)="goToPage(currentPage() - 1)"
                [class.opacity-30]="currentPage() === 1"
                [disabled]="currentPage() === 1"
                class="text-white/70 hover:text-white transition px-2 py-1 text-sm disabled:cursor-default">
                ◄
              </button>

              @for (page of visiblePages(); track page) {
                <button (click)="goToPage(page)"
                  [class]="page === currentPage()
                    ? 'bg-white text-purple-dark font-semibold rounded-lg px-3 py-1 text-sm'
                    : 'text-white/70 hover:text-white transition rounded-lg px-3 py-1 text-sm'">
                  {{ page }}
                </button>
              }

              <button (click)="goToPage(currentPage() + 1)"
                [class.opacity-30]="currentPage() === totalPages()"
                [disabled]="currentPage() === totalPages()"
                class="text-white/70 hover:text-white transition px-2 py-1 text-sm disabled:cursor-default">
                ►
              </button>
            </div>
          }

        </div>

      </div>
    </section>
  `,
})
export class GroupsPage {
  readonly pageSize = 5;
  readonly searchQuery = signal('');
  readonly currentPage = signal(1);

  readonly allFiltered = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return MOCK_GROUPS;
    return MOCK_GROUPS.filter(g => g.name.toLowerCase().includes(query));
  });

  readonly totalPages = computed(() =>
    Math.ceil(this.allFiltered().length / this.pageSize),
  );

  readonly filteredGroups = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.allFiltered().slice(start, start + this.pageSize);
  });

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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

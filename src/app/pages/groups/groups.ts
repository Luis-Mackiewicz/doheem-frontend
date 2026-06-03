import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';
import { ModalCriarGrupoComponent } from '../../components/modal-create-group/modal-create-group';

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
];

@Component({
  selector: 'app-groups',
  imports: [RouterLink, ButtonComponent, ModalCriarGrupoComponent],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-page">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">

        <div class="w-full max-w-xl rounded-3xl bg-card border-theme shadow-2xl p-8 md:p-10">

          <a routerLink="/" class="text-secondary hover:text-primary text-sm flex items-center gap-1.5 mb-6 transition">
            ← 
          </a>

          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-violet-800">Grupos</h2>
          </div>

          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div class="h-full rounded-full bg-linear-to-r from-green-400 to-emerald-400 transition-all" [style.width.%]="(totalGroups / 10) * 100"></div>
            </div>
            <span class="text-muted text-xs whitespace-nowrap">{{ totalGroups }} / 10 repúblicas</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted select-none">🔍</span>
              <input #searchInput type="text" placeholder="Pesquisar grupos..."
                class="w-full bg-input border-theme rounded-xl pl-10 pr-4 py-3 text-primary outline-none focus:border-white/50 transition"
                (input)="onSearch(searchInput.value)" />
            </div>
            <app-button variant="solid" type="button" label="+ Criar" (click)="showCriarModal.set(true)"></app-button>
            <app-button variant="outline" type="button" label="Entrar"></app-button>
          </div>

          <div class="flex flex-col">
            @for (group of filteredGroups(); track group.id) {
              <a [routerLink]="'/groups/' + group.id + '/dashboard'" class="flex items-center justify-between py-4 px-3 -mx-3 rounded-xl transition cursor-pointer border-b border-theme last:border-b-0 hover-bg">
                <div class="flex items-center gap-4 min-w-0">
                  <span class="text-2xl shrink-0">🏠</span>
                  <div class="min-w-0">
                    <p class="text-violet-700/80 font-semibold truncate">{{ group.name }}</p>
                    <p class="text-secondary text-sm">{{ group.members }} membros · R$ {{ group.monthlyFee }}/mês</p>
                  </div>
                </div>
                <span class="text-muted text-lg shrink-0">›</span>
              </a>
            } @empty {
              <p class="text-muted text-center py-12">Nenhum grupo encontrado</p>
            }
          </div>

          @if (totalPages() > 1) {
            <div class="flex items-center justify-center gap-1 mt-6 pt-4 border-t border-theme">
              <button (click)="goToPage(currentPage() - 1)"
                [class.opacity-30]="currentPage() === 1"
                [disabled]="currentPage() === 1"
                class="text-secondary hover:text-white transition px-2 py-1 text-sm disabled:cursor-default">
                ◄
              </button>

              @for (page of visiblePages(); track page) {
                <button (click)="goToPage(page)"
                  [class]="page === currentPage()
                    ? 'bg-white text-purple-dark font-semibold rounded-lg px-3 py-1 text-sm'
                    : 'text-secondary hover:text-white transition rounded-lg px-3 py-1 text-sm'">
                  {{ page }}
                </button>
              }

              <button (click)="goToPage(currentPage() + 1)"
                [class.opacity-30]="currentPage() === totalPages()"
                [disabled]="currentPage() === totalPages()"
                class="text-secondary hover:text-white transition px-2 py-1 text-sm disabled:cursor-default">
                ►
              </button>
            </div>
          }

        </div>

      </div>
    </section>

    @if (showCriarModal()) {
      <app-modal-create-group (close)="showCriarModal.set(false)" (created)="onGroupCreated($event)" />
    }
  `,
})
export class GroupsPage {
  protected readonly totalGroups = MOCK_GROUPS.length;
  protected readonly showCriarModal = signal(false);
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

  onGroupCreated(data: { nome: string; descricao: string; moeda: string }): void {
    console.log('Grupo criado:', data);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}

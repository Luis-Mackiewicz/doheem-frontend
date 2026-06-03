import { Component, inject, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';
import { ModalCriarGrupoComponent } from '../../components/modal-create-group/modal-create-group';
import { MockDataService } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification-service';
import {
  LucideSearch,
  LucideHome,
  LucideChevronRight,
  LucideChevronLeft,
} from '@lucide/angular';

@Component({
  selector: 'app-groups',
  imports: [RouterLink, ButtonComponent, ModalCriarGrupoComponent,
    LucideSearch, LucideHome, LucideChevronRight, LucideChevronLeft,
  ],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-page transition-colors duration-150">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">

        <div class="w-full max-w-xl rounded-3xl bg-card border-theme shadow-2xl p-8 md:p-10">

          <a routerLink="/" aria-label="Voltar" class="text-secondary hover-text-primary text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← Voltar
          </a>

          <div class="flex items-center justify-between mb-2">
            <h2 class="text-2xl font-bold text-primary">Grupos</h2>
          </div>

          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-1.5 rounded-full bg-card-hover overflow-hidden">
              <div class="h-full rounded-full bg-linear-to-r from-green-400 to-emerald-400 transition-all" [style.width.%]="(groups().length / 10) * 100"></div>
            </div>
            <span class="text-muted text-xs whitespace-nowrap">{{ groups().length }} / 10 repúblicas</span>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 mb-6">
            <div class="relative flex-1">
              <svg lucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"></svg>
              <input #searchInput type="text" placeholder="Pesquisar grupos..."
                class="w-full bg-input border-theme rounded-xl pl-10 pr-4 py-3 text-primary outline-none focus:border-purple-400/60 transition"
                (input)="onSearch(searchInput.value)" />
            </div>
            <app-button variant="solid" type="button" label="+ Criar" (click)="showCriarModal.set(true)"></app-button>
            <app-button variant="outline" type="button" label="Entrar"></app-button>
          </div>

          <div class="flex flex-col min-h-[360px]">
            @for (group of filteredGroups(); track group.id) {
              <a [routerLink]="'/groups/' + group.id + '/dashboard'"
                class="flex items-center justify-between py-4 px-3 -mx-3 rounded-xl transition cursor-pointer border-b border-theme last:border-b-0 hover-bg">
                <div class="flex items-center gap-4 min-w-0">
                  @if (group.imagemBase64) {
                    <img [src]="group.imagemBase64" alt="" class="w-10 h-10 rounded-xl object-cover shrink-0" />
                  } @else {
                    <div class="w-10 h-10 rounded-xl badge-purple flex items-center justify-center shrink-0">
                      <svg lucideHome class="w-5 h-5"></svg>
                    </div>
                  }
                  <div class="min-w-0">
                    <p class="text-primary font-semibold truncate">{{ group.name }}</p>
                    <p class="text-secondary text-sm">{{ group.members }} membros · R$ {{ group.monthlyFee }}/mês</p>
                  </div>
                </div>
                <svg lucideChevronRight class="w-5 h-5 text-muted shrink-0"></svg>
              </a>
            } @empty {
              <p class="text-muted text-center flex items-center justify-center h-full">Nenhum grupo encontrado</p>
            }
          </div>

          <div class="flex items-center justify-center gap-1 mt-6 pt-4 border-t border-theme"
               [class.invisible]="totalPages() <= 1">
              <button (click)="goToPage(currentPage() - 1)"
                [class.opacity-30]="currentPage() === 1"
                [disabled]="currentPage() === 1"
                aria-label="Página anterior"
                class="text-secondary hover-text-primary transition px-2 py-1 text-sm disabled:cursor-default">
                <svg lucideChevronLeft class="w-4 h-4"></svg>
              </button>

              @for (page of visiblePages(); track page) {
                <button (click)="goToPage(page)"
                  [class]="page === currentPage()
                    ? 'bg-page text-primary font-semibold rounded-lg px-3 py-1 text-sm border border-theme'
                    : 'text-secondary hover-text-primary transition rounded-lg px-3 py-1 text-sm'">
                  {{ page }}
                </button>
              }

              <button (click)="goToPage(currentPage() + 1)"
                [class.opacity-30]="currentPage() === totalPages()"
                [disabled]="currentPage() === totalPages()"
                aria-label="Próxima página"
                class="text-secondary hover-text-primary transition px-2 py-1 text-sm disabled:cursor-default">
                <svg lucideChevronRight class="w-4 h-4"></svg>
              </button>
            </div>

        </div>

      </div>
    </section>

    @if (showCriarModal()) {
      <app-modal-create-group (close)="showCriarModal.set(false)" (created)="onGroupCreated($event)" />
    }
  `,
})
export class GroupsPage {
  protected readonly showCriarModal = signal(false);
  readonly pageSize = 5;
  readonly searchQuery = signal('');
  readonly currentPage = signal(1);

  private mockData = inject(MockDataService);
  private router = inject(Router);
  private notif = inject(NotificationService);

  protected readonly groups = this.mockData.groups;

  readonly allFiltered = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const list = this.groups();
    if (!query) return list;
    return list.filter(g => g.name.toLowerCase().includes(query));
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

  onGroupCreated(data: { nome: string; descricao: string; moeda: string; imagemBase64: string }): void {
    const newId = this.mockData.criarGrupo(data);
    this.notif.add('info', 'Grupo criado',
      `Grupo "${data.nome}" criado com sucesso!`,
      this.mockData.CURRENT_USER);
    this.router.navigate([`/groups/${newId}/dashboard`]);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
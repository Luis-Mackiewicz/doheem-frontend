import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService, Membro } from '../../services/mock-data.service';
import { BuscaComponent } from '../../components/busca/busca';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import {
  LucideCopy,
  LucideCheck,
  LucideShield,
  LucideTrash2,
  LucideLogOut,
  LucideUsers,
} from '@lucide/angular';

@Component({
  selector: 'app-membros',
  imports: [BuscaComponent, PaginacaoComponent,
    LucideCopy, LucideCheck, LucideShield, LucideTrash2, LucideLogOut, LucideUsers,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl badge-purple flex items-center justify-center">
            <svg lucideUsers class="w-5 h-5"></svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-primary tracking-tight">Membros</h1>
            <p class="text-secondary text-sm">{{ total() }} membro{{ total() !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ filtered().length }} / {{ total() }}</span>
      </div>

      <app-search placeholder="Pesquisar membros..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col gap-4 min-h-0">
        @for (m of paginated(); track m.nome) {
          <div class="rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10 hover:bg-card-hover transition">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden
                {{ m.fotoBase64 ? '' : 'bg-purple-500/15' }}">
                @if (m.fotoBase64) {
                  <img [src]="m.fotoBase64" [alt]="m.nome" class="w-full h-full object-cover" />
                } @else {
                  <span class="text-secondary text-lg font-semibold">{{ m.nome.charAt(0) }}</span>
                }
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="text-primary font-semibold truncate">{{ m.nome }}</p>
                  @if (m.admin) {
                    <span class="text-[10px] font-medium badge-amber px-2 py-0.5 rounded-full shrink-0">Admin</span>
                  }
                </div>
                <p class="text-muted text-sm">{{ m.telefone }}</p>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button (click)="copiarTelefone(m.telefone)"
                  class="w-9 h-9 flex items-center justify-center rounded-lg hover-bg text-muted hover-text-primary transition cursor-pointer"
                  aria-label="Copiar telefone de {{ m.nome }}"
                  title="Copiar telefone">
                  @if (copiedTel() === m.telefone) {
                    <svg lucideCheck class="w-4 h-4 text-emerald-400"></svg>
                  } @else {
                    <svg lucideCopy class="w-4 h-4"></svg>
                  }
                </button>
                @if (isAdmin()) {
                  @if (!m.admin) {
                    <button (click)="promover(m)"
                      class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-amber-500/20 text-muted hover:text-amber-400 transition cursor-pointer"
                      aria-label="Promover {{ m.nome }} a admin"
                      title="Promover a admin">
                      <svg lucideShield class="w-4 h-4"></svg>
                    </button>
                  }
                  @if (m.nome !== currentUserName) {
                    <button (click)="confirmRemove(m)"
                      class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-rose-500/20 text-muted hover:text-rose-400 transition cursor-pointer"
                      aria-label="Remover {{ m.nome }} do grupo"
                      title="Remover do grupo">
                      <svg lucideTrash2 class="w-4 h-4"></svg>
                    </button>
                  }
                }
                @if (m.nome === currentUserName) {
                  <button (click)="sair(m)"
                    class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-rose-500/20 text-muted hover:text-rose-400 transition cursor-pointer"
                    aria-label="Sair do grupo"
                    title="Sair do grupo">
                    <svg lucideLogOut class="w-4 h-4"></svg>
                  </button>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="flex-1 flex items-center justify-center">
            <p class="text-muted text-lg">Nenhum membro encontrado</p>
          </div>
        }
      </div>
      <app-paginator [currentPage]="currentPage()" [totalPages]="totalPages()" (pageChange)="goToPage($event)" />
    </div>

    <!-- Remove confirmation -->
    @if (removing(); as m) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelRemove()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-xl p-6 shadow-2xl flex flex-col bg-card border border-theme">
            <h3 class="text-primary font-bold text-lg mb-2">Remover membro</h3>
            <p class="text-secondary text-sm">Tem certeza que deseja remover <strong class="text-primary">{{ m.nome }}</strong> do grupo?</p>
            <div class="flex gap-3 mt-6">
              <button (click)="cancelRemove()"
                class="flex-1 px-4 py-2.5 rounded-xl border border-theme text-secondary font-medium text-sm hover:text-primary hover-bg transition cursor-pointer">Cancelar</button>
              <button (click)="remover()"
                class="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-medium text-sm hover:bg-rose-500/30 transition cursor-pointer">Remover</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Leave error -->
    @if (leaveError(); as msg) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="leaveError.set('')">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-xl p-6 shadow-2xl flex flex-col bg-card border border-theme">
            <h3 class="text-primary font-bold text-lg mb-2">Não é possível sair</h3>
            <p class="text-secondary text-sm">{{ msg }}</p>
            <div class="flex gap-3 mt-6">
              <button (click)="leaveError.set('')"
                class="flex-1 px-4 py-2.5 rounded-xl badge-purple font-medium text-sm hover:bg-purple-500/30 transition cursor-pointer">OK</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Leave confirmation -->
    @if (leaving(); as m) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelarSaida()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-xl p-6 shadow-2xl flex flex-col bg-card border border-theme">
            <h3 class="text-primary font-bold text-lg mb-2">Sair do grupo</h3>
            <p class="text-secondary text-sm">Tem certeza que deseja sair do grupo?</p>
            <div class="flex gap-3 mt-6">
              <button (click)="cancelarSaida()"
                class="flex-1 px-4 py-2.5 rounded-xl border border-theme text-secondary font-medium text-sm hover:text-primary hover-bg transition cursor-pointer">Cancelar</button>
              <button (click)="confirmarSaida()"
                class="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-medium text-sm hover:bg-rose-500/30 transition cursor-pointer">Sair</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class MembrosPage {
  protected mockData = inject(MockDataService);

  protected readonly isAdmin = computed(() =>
    this.mockData.membros().find(m => m.nome === this.currentUserName)?.admin ?? false
  );
  protected readonly currentUserName = this.mockData.CURRENT_USER;
  protected readonly pageSize = 5;

  protected readonly copiedTel = signal('');
  protected readonly removing = signal<Membro | null>(null);
  protected readonly leaving = signal<Membro | null>(null);
  protected readonly leaveError = signal('');
  protected readonly searchQuery = signal('');
  protected readonly currentPage = signal(1);

  protected readonly total = computed(() => this.mockData.membros().length);

  protected readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    let list = this.mockData.membros();
    if (q) {
      list = list.filter(m => m.nome.toLowerCase().includes(q));
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

  copiarTelefone(tel: string): void {
    navigator.clipboard.writeText(tel);
    this.copiedTel.set(tel);
    setTimeout(() => {
      if (this.copiedTel() === tel) this.copiedTel.set('');
    }, 1500);
  }

  promover(m: Membro): void {
    this.mockData.promoverParaAdmin(m.nome);
  }

  confirmRemove(m: Membro): void {
    this.removing.set(m);
  }

  cancelRemove(): void {
    this.removing.set(null);
  }

  remover(): void {
    const target = this.removing();
    if (!target) return;
    this.mockData.removerMembro(target.nome);
    this.removing.set(null);
  }

  sair(m: Membro): void {
    if (this.mockData.temDividasPendentes(m.nome)) {
      this.leaveError.set('Você possui dívidas pendentes. Quite-as antes de sair do grupo.');
      return;
    }
    if (this.mockData.temTarefasPendentes(m.nome)) {
      this.leaveError.set('Você possui tarefas pendentes. Conclua-as antes de sair do grupo.');
      return;
    }
    const outrosAdmins = this.mockData.membros().filter(item => item.admin && item.nome !== m.nome);
    if (m.admin && outrosAdmins.length === 0) {
      const maisAntigo = this.mockData.getMembroMaisAntigo(m.nome);
      if (maisAntigo) {
        this.leaveError.set(`Você é o único admin do grupo. Transfira o cargo para ${maisAntigo.nome} antes de sair.`);
      } else {
        this.leaveError.set('Você é o único admin do grupo e não há outros membros para assumir.');
      }
      return;
    }
    this.leaving.set(m);
  }

  cancelarSaida(): void {
    this.leaving.set(null);
  }

  confirmarSaida(): void {
    const target = this.leaving();
    if (!target) return;
    this.mockData.removerMembro(target.nome);
    this.leaving.set(null);
  }
}

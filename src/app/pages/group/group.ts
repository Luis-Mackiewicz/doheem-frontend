import { Component, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsApiService } from '../../services/groups-api.service';
import { AuthService } from '../../services/auth.service';
import { GroupStoreService } from '../../services/group-store.service';
import { SearchComponent } from '../../components/search/search';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { FormsModule } from '@angular/forms';
import {
  LucideCopy,
  LucideCheck,
  LucideShield,
  LucideTrash2,
  LucideLogOut,
  LucideUsers,
  LucideCog,
  LucideCamera,
  LucideX,
} from '@lucide/angular';

interface Member {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  admin: boolean;
  fotoBase64?: string;
}

@Component({
  selector: 'app-group',
  imports: [SearchComponent, PaginatorComponent, FormsModule,
    LucideCopy, LucideCheck, LucideShield, LucideTrash2, LucideLogOut, LucideUsers,
    LucideCog, LucideCamera, LucideX,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">

      <!-- Group header -->
      <div class="rounded-2xl bg-card border border-theme p-6 shadow-lg shadow-black/10">
        <div class="flex items-start gap-5">
          <div class="relative shrink-0">
            <div class="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-purple-500/15">
              @if (group()?.imagemBase64) {
                <img [src]="group()!.imagemBase64" alt="Foto do grupo" class="w-full h-full object-cover" />
              } @else {
                <svg lucideUsers class="w-8 h-8 text-secondary"></svg>
              }
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-4">
              <h1 class="text-2xl md:text-3xl font-bold text-primary tracking-tight truncate">
                {{ group()?.name ?? 'Grupo' }}
              </h1>
              <button (click)="openSettings()"
                class="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition shrink-0"
                [class.hover-bg]="true"
                [class.hover:text-primary]="true"
                class="text-muted hover:text-primary hover-bg"
                aria-label="Configurações do grupo"
                title="Configurações">
                <svg lucideCog class="w-5 h-5"></svg>
              </button>
            </div>
            @if (group()?.description) {
              <p class="text-secondary text-sm mt-1.5 leading-relaxed">{{ group()!.description }}</p>
            }
            <p class="text-muted text-xs mt-2">{{ total() }} membro{{ total() !== 1 ? 's' : '' }}</p>
          </div>
        </div>
      </div>

      <!-- Members section -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl badge-purple flex items-center justify-center">
            <svg lucideUsers class="w-5 h-5"></svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-primary tracking-tight">Membros</h2>
            <p class="text-secondary text-sm">{{ total() }} membro{{ total() !== 1 ? 's' : '' }}</p>
          </div>
        </div>
        <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ filtered().length }} / {{ total() }}</span>
      </div>

      <app-search placeholder="Pesquisar por nome..." (searchChange)="onSearch($event)" />

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
                <button (click)="copyPhone(m.telefone)"
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
                    <button (click)="promote(m)"
                      class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-amber-500/20 text-muted hover:text-amber-400 transition cursor-pointer"
                      aria-label="Promover {{ m.nome }} a admin"
                      title="Promover a admin">
                      <svg lucideShield class="w-4 h-4"></svg>
                    </button>
                  }
                  @if (m.nome !== currentUserName()) {
                    <button (click)="confirmRemove(m)"
                      class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-rose-500/20 text-muted hover:text-rose-400 transition cursor-pointer"
                      aria-label="Remover {{ m.nome }} do grupo"
                      title="Remover do grupo">
                      <svg lucideTrash2 class="w-4 h-4"></svg>
                    </button>
                  }
                }
                @if (m.nome === currentUserName()) {
                  <button (click)="leave(m)"
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

    <!-- Settings modal -->
    @if (configOpen()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeSettings()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-md">
          <div class="rounded-xl p-6 shadow-2xl flex flex-col bg-card border border-theme">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-primary font-bold text-lg">Configurações do grupo</h3>
              <button (click)="closeSettings()"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-primary hover-bg transition cursor-pointer"
                aria-label="Fechar">
                <svg lucideX class="w-4 h-4"></svg>
              </button>
            </div>

            <!-- Photo -->
            <div class="flex flex-col items-center gap-3 mb-6">
              <div class="relative">
                <div class="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center bg-purple-500/15 border-2 border-dashed border-theme">
                  @if (editFotoPreview()) {
                    <img [src]="editFotoPreview()" alt="Preview da foto do grupo" class="w-full h-full object-cover" />
                  } @else if (group()?.imagemBase64) {
                    <img [src]="group()!.imagemBase64" alt="Foto do grupo" class="w-full h-full object-cover" />
                  } @else {
                    <svg lucideUsers class="w-10 h-10 text-secondary"></svg>
                  }
                </div>
                <button (click)="fileInput.click()"
                  class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center bg-violet-600 text-white hover:bg-violet-500 transition shadow-lg cursor-pointer"
                  aria-label="Alterar foto do grupo">
                  <svg lucideCamera class="w-4 h-4"></svg>
                </button>
              </div>
              <span class="text-xs text-muted">Clique no ícone para alterar a foto</span>
              <input #fileInput type="file" accept="image/*" (change)="onFotoSelected($event)" class="hidden" />
            </div>

            <!-- Name -->
            <label class="text-sm font-medium text-primary mb-1.5">Nome do grupo</label>
            <input [(ngModel)]="editName"
              class="w-full px-4 py-2.5 rounded-xl bg-input border border-theme text-primary text-sm placeholder:text-muted focus:outline-none focus:border-purple-500 transition mb-4"
              placeholder="Nome do grupo" />

            <!-- Description -->
            <label class="text-sm font-medium text-primary mb-1.5">Descrição</label>
            <textarea [(ngModel)]="editDescription" rows="3"
              class="w-full px-4 py-2.5 rounded-xl bg-input border border-theme text-primary text-sm placeholder:text-muted focus:outline-none focus:border-purple-500 transition resize-none mb-6"
              placeholder="Descreva o grupo..."></textarea>

            <!-- Actions -->
            <div class="flex gap-3">
              <button (click)="closeSettings()"
                class="flex-1 px-4 py-2.5 rounded-xl border border-theme text-secondary font-medium text-sm hover:text-primary hover-bg transition cursor-pointer">Cancelar</button>
              <button (click)="saveSettings()"
                class="flex-1 px-4 py-2.5 rounded-xl bg-violet-600 text-white font-medium text-sm hover:bg-violet-500 transition cursor-pointer">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    }

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
              <button (click)="remove()"
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
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelLeave()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-xl p-6 shadow-2xl flex flex-col bg-card border border-theme">
            <h3 class="text-primary font-bold text-lg mb-2">Sair do grupo</h3>
            <p class="text-secondary text-sm">Tem certeza que deseja sair do grupo?</p>
            <div class="flex gap-3 mt-6">
              <button (click)="cancelLeave()"
                class="flex-1 px-4 py-2.5 rounded-xl border border-theme text-secondary font-medium text-sm hover:text-primary hover-bg transition cursor-pointer">Cancelar</button>
              <button (click)="confirmLeave()"
                class="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-medium text-sm hover:bg-rose-500/30 transition cursor-pointer">Sair</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class GroupPage {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private route = inject(ActivatedRoute);
  private groupsApi = inject(GroupsApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  protected readonly groupId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
  protected readonly groupIdNum = computed(() => Number(this.groupId));

  protected store = inject(GroupStoreService);
  protected readonly group = this.store.group;

  protected readonly currentUserName = computed(() => this.auth.currentUser()?.name ?? '');
  protected readonly isAdmin = computed(() =>
    this.store.members().find(m => m.nome === this.currentUserName())?.admin ?? false
  );
  protected readonly pageSize = 5;

  protected readonly copiedTel = signal('');
  protected readonly removing = signal<Member | null>(null);
  protected readonly leaving = signal<Member | null>(null);
  protected readonly leaveError = signal('');
  protected readonly searchQuery = signal('');
  protected readonly currentPage = signal(1);

  protected readonly total = computed(() => this.store.members().length);

  protected readonly filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    let list = this.store.members();
    if (q) {
      list = list.filter((m: Member) => m.nome.toLowerCase().includes(q));
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

  // Settings modal state
  protected readonly configOpen = signal(false);
  protected editName = '';
  protected editDescription = '';
  protected editFotoPreview = signal('');

  openSettings(): void {
    const g = this.group();
    this.editName = g?.name ?? '';
    this.editDescription = g?.description ?? '';
    this.editFotoPreview.set('');
    this.configOpen.set(true);
  }

  closeSettings(): void {
    this.configOpen.set(false);
    this.editFotoPreview.set('');
  }

  onFotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.editFotoPreview.set(result);
    };
    reader.readAsDataURL(file);
  }

  saveSettings(): void {
    const id = this.groupIdNum();
    this.groupsApi.update(id, {
      name: this.editName,
      description: this.editDescription,
      imagemBase64: this.editFotoPreview() || undefined,
    }).subscribe(() => {
      this.closeSettings();
    });
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

  copyPhone(tel: string): void {
    navigator.clipboard.writeText(tel);
    this.copiedTel.set(tel);
    setTimeout(() => {
      if (this.copiedTel() === tel) this.copiedTel.set('');
    }, 1500);
  }

  promote(m: Member): void {
    this.groupsApi.updateMemberRole(this.groupIdNum(), m.id, { role: 'admin' }).subscribe();
  }

  confirmRemove(m: Member): void {
    this.removing.set(m);
  }

  cancelRemove(): void {
    this.removing.set(null);
  }

  remove(): void {
    const target = this.removing();
    if (!target) return;
    this.groupsApi.removeMember(this.groupIdNum(), target.id).subscribe(() => {
      this.removing.set(null);
    });
  }

  leave(m: Member): void {
    this.leaving.set(m);
  }

  cancelLeave(): void {
    this.leaving.set(null);
  }

  confirmLeave(): void {
    const target = this.leaving();
    if (!target) return;
    this.groupsApi.removeMember(this.groupIdNum(), target.id).subscribe({
      next: () => {
        this.leaving.set(null);
        this.router.navigate(['/groups']);
      },
      error: (err) => {
        this.leaveError.set(err.error?.message ?? 'Não foi possível sair do grupo.');
        this.leaving.set(null);
      },
    });
  }
}

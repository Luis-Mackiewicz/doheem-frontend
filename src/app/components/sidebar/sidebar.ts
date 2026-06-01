import { Component, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalMembrosComponent } from '../modal-membros/modal-membros';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ModalMembrosComponent],
  template: `
    <!-- Desktop sidebar -->
    <aside class="hidden lg:flex fixed left-0 top-0 h-dvh w-64 bg-purple-dark/90 backdrop-blur-xl border-r border-white/10 flex-col z-40">
      <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <img src="doheem_loogo.png" alt="Doheem" class="h-7 w-auto rounded-full" />
        <span class="text-white font-bold text-lg tracking-tight">Doheem</span>
      </div>

      <nav class="flex flex-col gap-1 p-3">
        @for (item of navItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="bg-white/10 text-white" [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium">
            <span class="text-lg">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
      </nav>

      <hr class="border-white/10 mx-4" />
      <div class="p-3 flex flex-col gap-1">
        <a routerLink="/perfil" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium">
          <span class="text-lg">👤</span>
          Perfil
        </a>
        <button (click)="showModal.set(true)" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium cursor-pointer w-full text-left">
          <span class="text-lg">👥</span>
          Grupo
        </button>
      </div>
      <hr class="border-white/10 mx-4" />
      <div class="p-3">
        <a [routerLink]="['/groups']" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition text-sm font-medium">
          <span class="text-lg">←</span>
          Voltar aos grupos
        </a>
      </div>
    </aside>

    <!-- Mobile top bar -->
    <div class="flex lg:hidden fixed top-0 left-0 right-0 z-40 bg-purple-dark/95 backdrop-blur-xl border-b border-white/10 items-center justify-between px-4 py-3">
      <a [routerLink]="['/groups']" class="flex items-center gap-2 text-white/60 hover:text-white transition text-sm font-medium">
        <span class="text-lg">←</span>
        Voltar
      </a>
      <div class="flex items-center gap-2">
        <img src="doheem_loogo.png" alt="Doheem" class="h-6 w-auto rounded-full" />
        <span class="text-white font-bold text-sm">Doheem</span>
      </div>
      <div class="flex items-center gap-3">
        <a routerLink="/perfil" class="text-white/60 hover:text-white transition text-lg cursor-pointer">👤</a>
        <button (click)="showModal.set(true)" class="flex items-center gap-1 text-white/60 hover:text-white transition text-sm font-medium cursor-pointer">
          <span class="text-lg">👥</span>
        </button>
      </div>
    </div>

    <!-- Mobile bottom nav -->
    <nav class="flex lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-purple-dark/95 backdrop-blur-xl border-t border-white/10 px-1 pb-[env(safe-area-inset-bottom,0px)]">
      @for (item of navItems; track item.path; let i = $index) {
        <a [routerLink]="item.path" routerLinkActive="bg-white/10 text-white" [routerLinkActiveOptions]="{exact: item.exact}"
           class="flex flex-col items-center gap-0.5 py-2 flex-1 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition text-[10px] font-medium min-w-0">
          <span class="text-lg leading-none">{{ item.icon }}</span>
          <span class="truncate w-full text-center">{{ item.label }}</span>
        </a>
      }
      <a routerLink="/perfil" routerLinkActive="bg-white/10 text-white"
         class="flex flex-col items-center gap-0.5 py-2 flex-1 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition text-[10px] font-medium min-w-0">
        <span class="text-lg leading-none">👤</span>
        <span class="truncate w-full text-center">Perfil</span>
      </a>
    </nav>

    @if (showModal()) {
      <app-modal-membros (close)="showModal.set(false)" />
    }
  `,
})
export class SidebarComponent {
  @Input() groupId!: string;

  protected showModal = signal(false);

  get navItems() {
    return [
      { path: `/groups/${this.groupId}/dashboard`, label: 'Dashboard', icon: '📊', exact: true },
      { path: `/groups/${this.groupId}/financeiro`, label: 'Financeiro', icon: '💰', exact: false },
      { path: `/groups/${this.groupId}/tarefas`, label: 'Tarefas', icon: '✅', exact: false },
      { path: `/groups/${this.groupId}/historico`, label: 'Histórico', icon: '📋', exact: false },
      { path: `/groups/${this.groupId}/notificacoes`, label: 'Notificações', icon: '🔔', exact: false },
    ];
  }
}

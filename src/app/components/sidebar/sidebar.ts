import { Component, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalMembrosComponent } from '../modal-membros/modal-membros';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ModalMembrosComponent],
  template: `
    <aside class="fixed left-0 top-0 h-dvh w-64 bg-purple-dark/90 backdrop-blur-xl border-r border-white/10 flex flex-col z-40">
      <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <img src="doheem_loogo.png" alt="Doheem" class="h-7 w-auto" />
        <span class="text-white font-bold text-lg tracking-tight">Doheem</span>
      </div>

      <nav class="flex flex-col gap-1 p-3 flex-1">
        @for (item of navItems; track item.path) {
          <a [routerLink]="item.path" routerLinkActive="bg-white/10 text-white" [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium">
            <span class="text-lg">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
        <button (click)="showModal.set(true)" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition text-sm font-medium cursor-pointer w-full text-left">
          <span class="text-lg">👥</span>
          Grupo
        </button>
      </nav>

      <div class="p-4 border-t border-white/10">
        <a [routerLink]="['/groups']" class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition text-sm font-medium">
          <span class="text-lg">←</span>
          Voltar aos grupos
        </a>
      </div>
    </aside>

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

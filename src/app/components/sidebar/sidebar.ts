import { Component, Input, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ModalMembrosComponent } from '../modal-members/modal-members';
import { ThemeService } from '../../services/theme-service';
import { NotificationService } from '../../services/notification-service';
import {
  LucideLayoutDashboard,
  LucideDollarSign,
  LucideListTodo,
  LucideHistory,
  LucideBell,
  LucideUsers,
  LucideUser,
  LucideArrowLeft,
} from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, ModalMembrosComponent,
    LucideLayoutDashboard, LucideDollarSign, LucideListTodo, LucideHistory,
    LucideBell, LucideUsers, LucideUser, LucideArrowLeft,
  ],
  template: `
    <aside class="hidden lg:flex fixed left-0 top-0 h-dvh w-64 flex-col z-40 transition-colors"
      [class.bg-page]="theme.theme() === 'dark'"
      [class.bg-card]="theme.theme() === 'light'"
      [class.border-r]="true"
      [class.border-white/10]="theme.theme() === 'dark'"
      [class.border-theme]="theme.theme() === 'light'">
      <a routerLink="/" class="flex items-center gap-3 px-6 py-5 cursor-pointer"
        [class.border-b]="true"
        [class.border-white/10]="theme.theme() === 'dark'"
        [class.border-theme]="theme.theme() === 'light'">
        <img src="doheem_logo.png" alt="Doheem" class="h-7 w-auto rounded-full" />
        <span class="font-bold text-lg tracking-tight"
          [class.text-white]="theme.theme() === 'dark'"
          [class.text-primary]="theme.theme() === 'light'">Doheem</span>
      </a>

      <nav class="flex flex-col gap-1 p-3">
        @for (item of navItems; track item.path) {
          <a [routerLink]="item.path"
             [routerLinkActive]="theme.theme() === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/15 text-purple-dark'"
             [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium"
             [class.text-white/60]="theme.theme() === 'dark'"
             [class.text-secondary]="theme.theme() === 'light'"
             [class.hover:text-white]="theme.theme() === 'dark'"
             [class.hover:text-primary]="theme.theme() === 'light'"
             [class.hover:bg-white/5]="theme.theme() === 'dark'"
             [class.hover-bg]="theme.theme() === 'light'">
             <span class="text-lg leading-none">
               @switch (item.label) {
                 @case ('Dashboard') { <svg lucideLayoutDashboard class="w-5 h-5"></svg> }
                 @case ('Financeiro') { <svg lucideDollarSign class="w-5 h-5"></svg> }
                 @case ('Tarefas') { <svg lucideListTodo class="w-5 h-5"></svg> }
                 @case ('Histórico') { <svg lucideHistory class="w-5 h-5"></svg> }
                 @case ('Notificações') { <svg lucideBell class="w-5 h-5"></svg> }
               }
             </span>
             <span class="flex-1">{{ item.label }}</span>
            @if (item.label === 'Notificações' && notif.unreadCount() > 0) {
              <span class="bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{{ notif.unreadCount() }}</span>
            }
          </a>
        }
        <button (click)="showModal.set(true)"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium cursor-pointer w-full text-left"
          [class.text-white/60]="theme.theme() === 'dark'"
          [class.text-secondary]="theme.theme() === 'light'"
          [class.hover:text-white]="theme.theme() === 'dark'"
          [class.hover:text-primary]="theme.theme() === 'light'"
          [class.hover:bg-white/5]="theme.theme() === 'dark'"
          [class.hover-bg]="theme.theme() === 'light'">
          <svg lucideUsers class="w-5 h-5 shrink-0"></svg>
          Grupo
        </button>
      </nav>

      <hr class="mx-4"
        [class.border-white/10]="theme.theme() === 'dark'"
        [class.border-theme]="theme.theme() === 'light'" />
      <div class="p-3">
        <a routerLink="/perfil"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium"
          [class.text-white/60]="theme.theme() === 'dark'"
          [class.text-secondary]="theme.theme() === 'light'"
          [class.hover:text-white]="theme.theme() === 'dark'"
          [class.hover:text-primary]="theme.theme() === 'light'"
          [class.hover:bg-white/5]="theme.theme() === 'dark'"
          [class.hover-bg]="theme.theme() === 'light'">
          <svg lucideUser class="w-5 h-5 shrink-0"></svg>
          Perfil
        </a>
      </div>
      <hr class="mx-4"
        [class.border-white/10]="theme.theme() === 'dark'"
        [class.border-theme]="theme.theme() === 'light'" />
      <div class="p-3">
        <a [routerLink]="['/groups']"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium"
          [class.text-white/40]="theme.theme() === 'dark'"
          [class.text-muted]="theme.theme() === 'light'"
          [class.hover:text-white]="theme.theme() === 'dark'"
          [class.hover:text-primary]="theme.theme() === 'light'"
          [class.hover:bg-white/5]="theme.theme() === 'dark'"
          [class.hover-bg]="theme.theme() === 'light'">
          <svg lucideArrowLeft class="w-5 h-5 shrink-0"></svg>
          Voltar aos grupos
        </a>
      </div>
    </aside>

    <!-- Mobile top bar -->
    <div class="flex lg:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-xl items-center justify-between px-4 py-3 transition-colors"
      [class.bg-page/95]="theme.theme() === 'dark'"
      [class.bg-page/95]="theme.theme() === 'light'"
      [class.border-b]="true"
      [class.border-white/10]="theme.theme() === 'dark'"
      [class.border-theme]="theme.theme() === 'light'">
      <a [routerLink]="['/groups']"
        class="flex items-center gap-2 transition text-sm font-medium"
        [class.text-white/60]="theme.theme() === 'dark'"
        [class.text-secondary]="theme.theme() === 'light'"
        [class.hover:text-white]="theme.theme() === 'dark'"
        [class.hover:text-primary]="theme.theme() === 'light'">
         <svg lucideArrowLeft class="w-5 h-5 shrink-0"></svg>
         Voltar
       </a>
       <div class="flex items-center gap-2">
        <img src="doheem_logo.png" alt="Doheem" class="h-6 w-auto rounded-full" />
        <span class="font-bold text-sm"
          [class.text-white]="theme.theme() === 'dark'"
          [class.text-primary]="theme.theme() === 'light'">Doheem</span>
      </div>
      <div class="flex items-center gap-3">
         <a routerLink="/perfil"
           class="transition cursor-pointer"
           [class.text-white/60]="theme.theme() === 'dark'"
           [class.text-secondary]="theme.theme() === 'light'"
           [class.hover:text-white]="theme.theme() === 'dark'"
           [class.hover:text-primary]="theme.theme() === 'light'">
           <svg lucideUser class="w-5 h-5"></svg>
         </a>
        <button (click)="showModal.set(true)"
          class="flex items-center gap-1 transition text-sm font-medium cursor-pointer"
          [class.text-white/60]="theme.theme() === 'dark'"
          [class.text-secondary]="theme.theme() === 'light'"
          [class.hover:text-white]="theme.theme() === 'dark'"
          [class.hover:text-primary]="theme.theme() === 'light'">
          <svg lucideUsers class="w-5 h-5"></svg>
         </button>
      </div>
    </div>

    <!-- Mobile bottom nav -->
    <nav class="flex lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-1 pb-[env(safe-area-inset-bottom,0px)] transition-colors"
      [class.bg-page/95]="theme.theme() === 'dark'"
      [class.bg-page/95]="theme.theme() === 'light'"
      [class.border-white/10]="theme.theme() === 'dark'"
      [class.border-theme]="theme.theme() === 'light'">
      @for (item of navItems; track item.path; let i = $index) {
        <a [routerLink]="item.path"
          [routerLinkActive]="theme.theme() === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/15 text-purple-dark'"
          [routerLinkActiveOptions]="{exact: item.exact}"
          class="flex flex-col items-center gap-0.5 py-2 flex-1 rounded-lg transition text-[10px] font-medium min-w-0"
          [class.text-white/50]="theme.theme() === 'dark'"
          [class.text-muted]="theme.theme() === 'light'"
          [class.hover:text-white]="theme.theme() === 'dark'"
          [class.hover:text-primary]="theme.theme() === 'light'"
          [class.hover:bg-white/5]="theme.theme() === 'dark'"
          [class.hover-bg]="theme.theme() === 'light'">
          <span class="text-lg leading-none relative">
            @switch (item.label) {
              @case ('Dashboard') { <svg lucideLayoutDashboard class="w-5 h-5"></svg> }
              @case ('Financeiro') { <svg lucideDollarSign class="w-5 h-5"></svg> }
              @case ('Tarefas') { <svg lucideListTodo class="w-5 h-5"></svg> }
              @case ('Histórico') { <svg lucideHistory class="w-5 h-5"></svg> }
              @case ('Notificações') { <svg lucideBell class="w-5 h-5"></svg> }
            }
            @if (item.label === 'Notificações' && notif.unreadCount() > 0) {
              <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center">{{ notif.unreadCount() > 9 ? '9+' : notif.unreadCount() }}</span>
            }
          </span>
          <span class="truncate w-full text-center">{{ item.label }}</span>
        </a>
      }
      <a routerLink="/perfil"
        [routerLinkActive]="theme.theme() === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/15 text-purple-dark'"
        class="flex flex-col items-center gap-0.5 py-2 flex-1 rounded-lg transition text-[10px] font-medium min-w-0"
        [class.text-white/50]="theme.theme() === 'dark'"
        [class.text-muted]="theme.theme() === 'light'"
        [class.hover:text-white]="theme.theme() === 'dark'"
        [class.hover:text-primary]="theme.theme() === 'light'"
        [class.hover:bg-white/5]="theme.theme() === 'dark'"
        [class.hover-bg]="theme.theme() === 'light'">
         <svg lucideUser class="w-5 h-5"></svg>
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
  protected theme = inject(ThemeService);
  protected notif = inject(NotificationService);

  get navItems() {
    return [
      { path: `/groups/${this.groupId}/dashboard`, label: 'Dashboard', exact: true },
      { path: `/groups/${this.groupId}/financeiro`, label: 'Financeiro', exact: false },
      { path: `/groups/${this.groupId}/tarefas`, label: 'Tarefas', exact: false },
      { path: `/groups/${this.groupId}/historico`, label: 'Histórico', exact: false },
      { path: `/groups/${this.groupId}/notificacoes`, label: 'Notificações', exact: false },
    ];
  }
}

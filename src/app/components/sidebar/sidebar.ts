import { Component, computed, input, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme-service';
import { NotificationService } from '../../services/notification-service';
import { AuthService } from '../../services/auth.service';
import {
  LucideLayoutDashboard,
  LucideDollarSign,
  LucideListTodo,
  LucideHistory,
  LucideBell,
  LucideUsers,
  LucideWallet,
  LucideUser,
  LucideArrowLeft,
} from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive,
    LucideLayoutDashboard, LucideDollarSign, LucideListTodo, LucideHistory,
  LucideBell, LucideUsers, LucideWallet,
  LucideArrowLeft,
  ],
  template: `
    <!-- Desktop sidebar -->
    <aside class="hidden lg:flex fixed left-0 top-0 h-dvh w-64 flex-col z-40 bg-page border-r border-theme transition-colors">
      <a routerLink="/" class="flex items-center gap-3 px-6 py-5 cursor-pointer border-b border-theme">
        <img src="doheem_logo.png" alt="Doheem" class="h-7 w-auto rounded-xl" />
        <div class="min-w-0">
          <span class="font-bold text-lg tracking-tight text-primary block truncate">Doheem</span>
          <span class="text-muted text-[10px] font-medium truncate block">{{ groupName() }}</span>
        </div>
      </a>

      <nav aria-label="Main navigation" class="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        @for (item of navItems(); track item.path) {
          <a [routerLink]="item.path"
             [routerLinkActive]="theme.theme() === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/15 text-purple-dark'"
             [routerLinkActiveOptions]="{exact: item.exact}"
             aria-current="page"
             class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium text-secondary hover-text-primary hover-bg">
             <span class="text-lg leading-none" aria-hidden="true">
                 @switch (item.label) {
                   @case ('Dashboard') { <svg lucideLayoutDashboard class="w-5 h-5"></svg> }
                   @case ('Financial') { <svg lucideDollarSign class="w-5 h-5"></svg> }
                   @case ('Group') { <svg lucideUsers class="w-5 h-5"></svg> }
                   @case ('Balances') { <svg lucideWallet class="w-5 h-5"></svg> }
                   @case ('Tasks') { <svg lucideListTodo class="w-5 h-5"></svg> }
                   @case ('History') { <svg lucideHistory class="w-5 h-5"></svg> }
                   @case ('Notifications') { <svg lucideBell class="w-5 h-5"></svg> }
                 }
               </span>
               <span class="flex-1">{{ item.label }}</span>
              @if (item.label === 'Notifications' && notif.unreadCount() > 0) {
               <span class="bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{{ notif.unreadCount() }}</span>
             }
           </a>
         }
       </nav>

      <hr class="mx-4 border-theme" />
      <div class="p-3">
        <a routerLink="/profile"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium text-secondary hover-text-primary hover-bg">
          <div class="w-7 h-7 rounded-full badge-purple flex items-center justify-center text-[11px] font-bold shrink-0" aria-hidden="true">{{ userInitials }}</div>
          <span>{{ userName }}</span>
        </a>
      </div>
      <hr class="mx-4 border-theme" />
      <div class="p-3">
        <a [routerLink]="['/groups']"
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition text-sm font-medium text-muted hover-text-primary hover-bg">
          <svg lucideArrowLeft class="w-5 h-5 shrink-0" aria-hidden="true"></svg>
          Back to groups
        </a>
      </div>
    </aside>

    <!-- Mobile top bar -->
    <div class="flex lg:hidden fixed top-0 left-0 right-0 z-40 bg-page/95 backdrop-blur-xl items-center justify-between px-4 py-3 border-b border-theme transition-colors">
      <a [routerLink]="['/groups']"
        class="flex items-center gap-2 transition text-sm font-medium text-secondary hover-text-primary">
         <svg lucideArrowLeft class="w-5 h-5 shrink-0" aria-hidden="true"></svg>
         Back
       </a>
       <div class="flex items-center gap-2">
        <img src="doheem_logo.png" alt="Doheem" class="h-6 w-auto rounded-full" />
        <span class="font-bold text-sm text-primary">Doheem</span>
      </div>
      <div class="flex items-center gap-3">
         <a routerLink="/profile"
           class="transition cursor-pointer text-secondary hover-text-primary">
           <div class="w-7 h-7 rounded-full badge-purple flex items-center justify-center text-[11px] font-bold" aria-hidden="true">{{ userInitials }}</div>
         </a>
       </div>
    </div>

    <!-- Mobile bottom nav -->
    <nav aria-label="Main navigation" class="flex lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-page/95 backdrop-blur-xl border-t border-theme px-1 pb-[env(safe-area-inset-bottom,0px)] transition-colors">
      @for (item of navItems(); track item.path; let i = $index) {
        <a [routerLink]="item.path"
          [routerLinkActive]="theme.theme() === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/15 text-purple-dark'"
          [routerLinkActiveOptions]="{exact: item.exact}"
          aria-current="page"
          class="flex flex-col items-center gap-0.5 py-2 flex-1 rounded-lg transition text-[10px] font-medium min-w-0 text-muted hover-text-primary hover-bg">
          <span class="text-lg leading-none relative" aria-hidden="true">
              @switch (item.label) {
                @case ('Dashboard') { <svg lucideLayoutDashboard class="w-5 h-5"></svg> }
                @case ('Financial') { <svg lucideDollarSign class="w-5 h-5"></svg> }
                @case ('Group') { <svg lucideUsers class="w-5 h-5"></svg> }
                @case ('Balances') { <svg lucideWallet class="w-5 h-5"></svg> }
                @case ('Tasks') { <svg lucideListTodo class="w-5 h-5"></svg> }
                @case ('History') { <svg lucideHistory class="w-5 h-5"></svg> }
                @case ('Notifications') { <svg lucideBell class="w-5 h-5"></svg> }
              }
            @if (item.label === 'Notifications' && notif.unreadCount() > 0) {
              <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center">{{ notif.unreadCount() > 9 ? '9+' : notif.unreadCount() }}</span>
            }
          </span>
          <span class="truncate w-full text-center">{{ item.label }}</span>
        </a>
      }
      <a routerLink="/profile"
        [routerLinkActive]="theme.theme() === 'dark' ? 'bg-white/10 text-white' : 'bg-purple-500/15 text-purple-dark'"
        aria-current="page"
        class="flex flex-col items-center gap-0.5 py-2 flex-1 rounded-lg transition text-[10px] font-medium min-w-0 text-muted hover-text-primary hover-bg">
         <div class="w-5 h-5 rounded-full badge-purple flex items-center justify-center text-[9px] font-bold" aria-hidden="true">{{ userInitials }}</div>
         <span class="truncate w-full text-center">Profile</span>
       </a>
     </nav>

  `,
})
export class SidebarComponent {
  readonly groupId = input('');

  protected theme = inject(ThemeService);
  protected notif = inject(NotificationService);

  protected readonly auth = inject(AuthService);

  protected get userName(): string {
    return this.auth.currentUser()?.name ?? '';
  }

  protected get userInitials(): string {
    return this.userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  protected readonly groupName = computed(() => `Group ${this.groupId()}`);

  protected readonly navItems = computed(() => [
    { path: `/groups/${this.groupId()}/dashboard`, label: 'Dashboard', exact: true },
    { path: `/groups/${this.groupId()}/balances`, label: 'Saldos', exact: false },
    { path: `/groups/${this.groupId()}/financial`, label: 'Financeiro', exact: false },
    { path: `/groups/${this.groupId()}/group`, label: 'Grupo', exact: false },
    { path: `/groups/${this.groupId()}/tasks`, label: 'Tarefas', exact: false },
    { path: `/groups/${this.groupId()}/historical`, label: 'Histórico', exact: false },
    { path: `/groups/${this.groupId()}/notifications`, label: 'Notificações', exact: false },
  ]);
}

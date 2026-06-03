import { Component, computed, inject, signal } from '@angular/core';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { BuscaComponent } from '../../components/busca/busca';
import { NotificationService, CURRENT_USER } from '../../services/notification-service';
import type { NotificationType } from '../../services/notification-service';
import {
  LucideDollarSign,
  LucideClock,
  LucideListTodo,
  LucideTriangleAlert,
  LucideBell,
  LucideInfo,
} from '@lucide/angular';

const TYPE_BADGE: Record<NotificationType, string> = {
  expense: 'badge-purple',
  debt_reminder: 'badge-amber',
  task_reminder: 'badge-blue',
  task_overdue: 'badge-rose',
  info: 'badge-emerald',
};

@Component({
  selector: 'app-notificacoes',
  imports: [PaginacaoComponent, BuscaComponent,
    LucideDollarSign, LucideClock, LucideListTodo, LucideTriangleAlert, LucideBell, LucideInfo,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Notificações</h1>
          <p class="text-secondary text-sm">{{ filteredNotifications().length }} notificação{{ filteredNotifications().length !== 1 ? 's' : '' }}{{ unreadCount() > 0 ? ', ' + unreadCount() + ' não lida' + (unreadCount() !== 1 ? 's' : '') : '' }}</p>
        </div>
        @if (filteredNotifications().length > 0) {
          <div class="flex gap-2">
            <button (click)="markAllAsRead()"
              aria-label="Marcar todas como lidas"
              class="text-xs font-medium text-secondary hover-text-primary border border-theme rounded-lg px-3 py-1.5 transition cursor-pointer">
              Marcar todas como lidas
            </button>
            <button (click)="clearAll()"
              aria-label="Limpar todas as notificações"
              class="text-xs font-medium text-rose-400 hover:text-rose-300 border border-theme rounded-lg px-3 py-1.5 transition cursor-pointer">
              Limpar todas
            </button>
          </div>
        }
      </div>

      <app-search placeholder="Pesquisar notificações..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col gap-3 min-h-0">
        @for (n of paginatedNotifications(); track n.id) {
          <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 transition"
            [class.opacity-60]="n.read"
            [class.border-l-4]="!n.read"
            [class.border-l-purple-400]="!n.read">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl {{ TYPE_BADGE[n.type] }} flex items-center justify-center shrink-0">
                @switch (n.type) {
                  @case ('expense') { <svg lucideDollarSign class="w-5 h-5"></svg> }
                  @case ('debt_reminder') { <svg lucideClock class="w-5 h-5"></svg> }
                  @case ('task_reminder') { <svg lucideListTodo class="w-5 h-5"></svg> }
                  @case ('task_overdue') { <svg lucideTriangleAlert class="w-5 h-5"></svg> }
                  @case ('info') { <svg lucideInfo class="w-5 h-5"></svg> }
                }
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-sm text-primary">{{ n.title }}</span>
                  @if (!n.read) {
                    <span class="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span>
                  }
                </div>
                <p class="text-secondary text-sm mt-0.5">{{ n.message }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-muted text-xs">{{ createdAtLabel(n.createdAt) }}</span>
                  @if (!n.read) {
                    <button (click)="svc.markAsRead(n.id)"
                      class="text-xs text-purple-400 hover:text-purple-300 transition cursor-pointer">
                      Marcar como lida
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <svg lucideBell class="w-10 h-10 text-muted mb-3 mx-auto"></svg>
              <p class="text-secondary text-lg font-medium">Nenhuma notificação</p>
              <p class="text-muted text-sm mt-1">{{ searchQuery() ? 'Nenhuma notificação encontrada para esta busca' : 'Você está em dia!' }}</p>
            </div>
          </div>
        }
        @if (paginatedNotifications().length > 0) {
          <app-paginator [currentPage]="currentPage()" [totalPages]="totalNotifPages()" (pageChange)="goToNotifPage($event)" />
        }
      </div>
    </div>
  `,
})
export class NotificacoesPage {
  protected readonly TYPE_BADGE = TYPE_BADGE;
  protected readonly svc = inject(NotificationService);
  protected readonly pageSize = 5;
  protected readonly currentPage = signal(1);
  protected readonly searchQuery = signal('');

  protected readonly unreadCount = computed(() =>
    this.filteredNotifications().filter(n => !n.read).length
  );

  protected readonly filteredNotifications = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let list = this.svc.notifications().filter(n => n.recipient === CURRENT_USER);
    if (query) {
      list = list.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }
    return list;
  });

  protected readonly paginatedNotifications = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredNotifications().slice(start, start + this.pageSize);
  });

  protected readonly totalNotifPages = computed(() =>
    Math.ceil(this.filteredNotifications().length / this.pageSize)
  );

  protected createdAtLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  protected goToNotifPage(page: number): void {
    if (page >= 1 && page <= this.totalNotifPages()) {
      this.currentPage.set(page);
    }
  }

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  protected markAllAsRead(): void {
    this.svc.markAllAsRead();
    this.currentPage.set(1);
  }

  protected clearAll(): void {
    this.svc.clearAll();
    this.currentPage.set(1);
  }
}
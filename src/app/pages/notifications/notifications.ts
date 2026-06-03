import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { BuscaComponent } from '../../components/busca/busca';
import { NotificationService, CURRENT_USER, ADMIN_USER } from '../../services/notification-service';
import type { NotificationType } from '../../services/notification-service';
import {
  LucideDollarSign,
  LucideClock,
  LucideListTodo,
  LucideTriangleAlert,
  LucideBell,
} from '@lucide/angular';

const TYPE_CONFIG: Record<NotificationType, { color: string; bg: string }> = {
  expense: { color: 'text-purple-300', bg: 'bg-purple-500/15' },
  debt_reminder: { color: 'text-amber-300', bg: 'bg-amber-500/15' },
  task_reminder: { color: 'text-blue-300', bg: 'bg-blue-500/15' },
  task_overdue: { color: 'text-rose-300', bg: 'bg-rose-500/15' },
};

@Component({
  selector: 'app-notificacoes',
  imports: [DatePipe, FormsModule, PaginacaoComponent, BuscaComponent,
    LucideDollarSign, LucideClock, LucideListTodo, LucideTriangleAlert, LucideBell,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Notificações</h1>
        </div>
        @if (filteredNotifications().length > 0) {
          <button (click)="markAllAsRead()"
            class="text-xs font-medium text-secondary hover:text-primary border border-theme rounded-lg px-3 py-1.5 transition cursor-pointer">
            Marcar todas como lidas
          </button>
        }
      </div>

      <app-search placeholder="Pesquisar notificações..." (searchChange)="onSearch($event)" />

      <div class="flex-1 flex flex-col gap-3 min-h-0">
        @if (filteredNotifications().length > 0) {
          @for (n of paginatedNotifications(); track n.id) {
            <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 transition"
              [class.opacity-60]="n.read"
              [class.border-l-4]="!n.read"
              [class.border-l-purple-400]="!n.read">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl {{ TYPE_CONFIG[n.type].bg }} flex items-center justify-center shrink-0">
                  @switch (n.type) {
                    @case ('expense') { <svg lucideDollarSign class="w-5 h-5 {{ TYPE_CONFIG[n.type].color }}"></svg> }
                    @case ('debt_reminder') { <svg lucideClock class="w-5 h-5 {{ TYPE_CONFIG[n.type].color }}"></svg> }
                    @case ('task_reminder') { <svg lucideListTodo class="w-5 h-5 {{ TYPE_CONFIG[n.type].color }}"></svg> }
                    @case ('task_overdue') { <svg lucideTriangleAlert class="w-5 h-5 {{ TYPE_CONFIG[n.type].color }}"></svg> }
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
                    <span class="text-muted text-xs">{{ n.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
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
          }
          <app-paginator [currentPage]="currentPage()" [totalPages]="totalNotifPages()" (pageChange)="goToNotifPage($event)" />
        } @else {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <svg lucideBell class="w-10 h-10 text-muted mb-3 mx-auto"></svg>
              <p class="text-secondary text-lg font-medium">Nenhuma notificação</p>
              <p class="text-muted text-sm mt-1">Você está em dia!</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class NotificacoesPage {
  protected readonly TYPE_CONFIG = TYPE_CONFIG;
  protected readonly svc = inject(NotificationService);
  protected readonly pageSize = 5;
  protected readonly currentPage = signal(1);
  protected readonly searchQuery = signal('');

  protected readonly filteredNotifications = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let list = this.svc.notifications().filter(n => n.recipient === CURRENT_USER || n.recipient === ADMIN_USER);
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
}

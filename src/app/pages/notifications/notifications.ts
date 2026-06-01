import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationService, CURRENT_USER, ADMIN_USER } from '../../services/notification-service';
import type { NotificationType } from '../../services/notification-service';
import {
  LucideDollarSign,
  LucideClock,
  LucideListTodo,
  LucideTriangleAlert,
  LucideBell,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';

const TYPE_CONFIG: Record<NotificationType, { color: string; bg: string }> = {
  expense: { color: 'text-purple-300', bg: 'bg-purple-500/15' },
  debt_reminder: { color: 'text-amber-300', bg: 'bg-amber-500/15' },
  task_reminder: { color: 'text-blue-300', bg: 'bg-blue-500/15' },
  task_overdue: { color: 'text-rose-300', bg: 'bg-rose-500/15' },
};

@Component({
  selector: 'app-notificacoes',
  imports: [DatePipe,
    LucideDollarSign, LucideClock, LucideListTodo, LucideTriangleAlert, LucideBell,
    LucideChevronLeft, LucideChevronRight,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full">
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
          @if (totalNotifPages() > 1) {
            <div class="flex items-center justify-center gap-1 mt-auto pt-4 border-t border-theme">
              <button (click)="goToNotifPage(currentPage() - 1)"
                [class.opacity-30]="currentPage() === 1"
                [disabled]="currentPage() === 1"
                class="text-secondary hover:text-primary transition px-2 py-1 disabled:cursor-default">
                <svg lucideChevronLeft class="w-4 h-4"></svg>
              </button>
              @for (page of visibleNotifPages(); track page) {
                <button (click)="goToNotifPage(page)"
                  [class]="page === currentPage()
                    ? 'bg-white text-purple-dark font-semibold rounded-lg px-3 py-1 text-sm'
                    : 'text-secondary hover:text-primary transition rounded-lg px-3 py-1 text-sm'">
                  {{ page }}
                </button>
              }
              <button (click)="goToNotifPage(currentPage() + 1)"
                [class.opacity-30]="currentPage() === totalNotifPages()"
                [disabled]="currentPage() === totalNotifPages()"
                class="text-secondary hover:text-primary transition px-2 py-1 disabled:cursor-default">
                <svg lucideChevronRight class="w-4 h-4"></svg>
              </button>
            </div>
          }
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

  protected readonly filteredNotifications = computed(() =>
    this.svc.notifications().filter(n => n.recipient === CURRENT_USER || n.recipient === ADMIN_USER)
  );

  protected readonly paginatedNotifications = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredNotifications().slice(start, start + this.pageSize);
  });

  protected readonly totalNotifPages = computed(() =>
    Math.ceil(this.filteredNotifications().length / this.pageSize)
  );

  protected readonly visibleNotifPages = computed(() => {
    const total = this.totalNotifPages();
    const current = this.currentPage();
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  protected goToNotifPage(page: number): void {
    if (page >= 1 && page <= this.totalNotifPages()) {
      this.currentPage.set(page);
    }
  }

  protected markAllAsRead(): void {
    this.svc.markAllAsRead();
    this.currentPage.set(1);
  }
}

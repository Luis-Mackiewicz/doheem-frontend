import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationService, CURRENT_USER, ADMIN_USER } from '../../services/notification-service';
import type { NotificationType } from '../../services/notification-service';

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; bg: string }> = {
  expense: { icon: '💰', color: 'text-purple-300', bg: 'bg-purple-500/15' },
  debt_reminder: { icon: '⏰', color: 'text-amber-300', bg: 'bg-amber-500/15' },
  task_reminder: { icon: '✅', color: 'text-blue-300', bg: 'bg-blue-500/15' },
  task_overdue: { icon: '⚠️', color: 'text-rose-300', bg: 'bg-rose-500/15' },
};

@Component({
  selector: 'app-notificacoes',
  imports: [DatePipe],
  template: `
    <div class="flex flex-col gap-8 h-full">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Notificações</h1>
        </div>
        @if (filteredNotifications().length > 0) {
          <button (click)="svc.markAllAsRead()"
            class="text-xs font-medium text-secondary hover:text-primary border border-theme rounded-lg px-3 py-1.5 transition cursor-pointer">
            Marcar todas como lidas
          </button>
        }
      </div>

      <div class="flex-1 flex flex-col gap-3 min-h-0">
        @if (filteredNotifications().length > 0) {
          @for (n of filteredNotifications(); track n.id) {
            <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 transition"
              [class.opacity-60]="n.read"
              [class.border-l-4]="!n.read"
              [class.border-l-purple-400]="!n.read">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl {{ TYPE_CONFIG[n.type].bg }} flex items-center justify-center text-lg shrink-0">
                  {{ TYPE_CONFIG[n.type].icon }}
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
        } @else {
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <p class="text-4xl mb-3">🔔</p>
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

  protected readonly filteredNotifications = computed(() =>
    this.svc.notifications().filter(n => n.recipient === CURRENT_USER || n.recipient === ADMIN_USER)
  );
}

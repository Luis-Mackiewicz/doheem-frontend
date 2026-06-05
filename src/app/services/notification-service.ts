import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'expense' | 'debt_reminder' | 'task_reminder' | 'task_overdue' | 'info';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  recipient: string;
  relatedId?: number;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, type: 'expense', title: 'Nova despesa', message: 'Conta de luz — sua parte: R$ 64,00', read: false, createdAt: '2026-06-01T10:00:00', recipient: 'Carlos Silva', relatedId: 1 },
  { id: 2, type: 'expense', title: 'Nova despesa', message: 'Água — sua parte: R$ 50,00', read: false, createdAt: '2026-06-01T09:00:00', recipient: 'Carlos Silva', relatedId: 2 },
  { id: 3, type: 'debt_reminder', title: 'Lembrete de dívida', message: 'Conta de luz venceu há 3 dias. Sua parte: R$ 64,00', read: false, createdAt: '2026-05-31T08:00:00', recipient: 'Carlos Silva', relatedId: 1 },
  { id: 4, type: 'task_reminder', title: 'Tarefa próxima do prazo', message: 'Limpar a cozinha vence amanhã!', read: false, createdAt: '2026-06-01T07:00:00', recipient: 'Carlos Silva', relatedId: 1 },
  { id: 5, type: 'task_overdue', title: 'Tarefa atrasada', message: 'Limpar área externa está atrasada — atribuída a Pedro Santos', read: true, createdAt: '2026-05-30T06:00:00', recipient: 'Ana Oliveira', relatedId: 6 },
  { id: 6, type: 'expense', title: 'Nova despesa', message: 'Internet — sua parte: R$ 100,00', read: true, createdAt: '2026-05-28T14:00:00', recipient: 'Carlos Silva', relatedId: 3 },
  { id: 7, type: 'expense', title: 'Nova despesa', message: 'Mercado do mês — sua parte: R$ 116,00', read: true, createdAt: '2026-05-25T11:00:00', recipient: 'Pedro Santos', relatedId: 4 },
  { id: 8, type: 'debt_reminder', title: 'Lembrete de dívida', message: 'Água venceu há 5 dias. Sua parte: R$ 50,00', read: true, createdAt: '2026-05-28T08:00:00', recipient: 'Carlos Silva', relatedId: 2 },
];

export const NOTIFICATION_CONFIG = {
  debtReminderDays: 3,
  maxReminders: 5,
  minIntervalDays: 3,
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSignal = signal<Notification[]>([...MOCK_NOTIFICATIONS]);
  private readonly reminderTracker = signal<Record<string, { count: number; lastSent: string }>>({});

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = computed(() => this.notificationsSignal().filter(n => !n.read).length);

  add(type: NotificationType, title: string, message: string, recipient: string, relatedId?: number): void {
    this.notificationsSignal.update(list => [
      { id: Date.now(), type, title, message, read: false, createdAt: new Date().toISOString(), recipient, relatedId },
      ...list,
    ]);
  }

  markAsRead(id: number): void {
    this.notificationsSignal.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  clearAll(): void {
    this.notificationsSignal.set([]);
  }

  canSendReminder(expenseId: number, memberName: string): boolean {
    const key = `${expenseId}_${memberName}`;
    const entry = this.reminderTracker()[key];
    if (!entry) return true;
    if (entry.count >= NOTIFICATION_CONFIG.maxReminders) return false;
    const last = new Date(entry.lastSent);
    const diff = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= NOTIFICATION_CONFIG.minIntervalDays;
  }

  registerReminder(expenseId: number, memberName: string): void {
    const key = `${expenseId}_${memberName}`;
    this.reminderTracker.update(map => ({
      ...map,
      [key]: {
        count: (map[key]?.count ?? 0) + 1,
        lastSent: new Date().toISOString(),
      },
    }));
  }
}

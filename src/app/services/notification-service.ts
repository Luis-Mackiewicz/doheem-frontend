import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { interval, Subject, merge, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export type NotificationType = 'expense' | 'debt_reminder' | 'task_reminder' | 'task_overdue' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

interface ApiNotificationResponse {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

function fromApiResponse(api: ApiNotificationResponse): Notification {
  return {
    id: api.id,
    type: api.type as NotificationType,
    title: api.title,
    message: api.message,
    read: api.is_read,
    createdAt: api.created_at,
    relatedId: api.related_id ?? undefined,
  };
}

export const NOTIFICATION_CONFIG = {
  debtReminderDays: 3,
  maxReminders: 5,
  minIntervalDays: 3,
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private refresh$ = new Subject<void>();

  private readonly notificationsSignal = signal<Notification[]>([]);
  private readonly reminderTracker = signal<Record<string, { count: number; lastSent: string }>>({});

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = computed(() => this.notificationsSignal().filter(n => !n.read).length);

  constructor() {
    merge(
      interval(30_000).pipe(startWith(0)),
      this.refresh$,
    ).pipe(
      switchMap(() => this.http.get<PaginatedResponse<ApiNotificationResponse>>(`${environment.apiUrl}/notifications`)),
      map(res => res.data.map(fromApiResponse)),
      catchError(() => of<Notification[]>(this.notificationsSignal())),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => this.notificationsSignal.set(data));
  }

  add(type: NotificationType, title: string, message: string): void {
    this.http.post(`${environment.apiUrl}/notifications`, { type, title, message })
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.refresh$.next());
  }

  markAsRead(id: string): void {
    this.notificationsSignal.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
    this.http.patch<void>(`${environment.apiUrl}/notifications/${id}/read`, {})
      .pipe(catchError(() => of(null)))
      .subscribe({ error: () => this.refresh$.next() });
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
    this.http.patch<void>(`${environment.apiUrl}/notifications/read-all`, {})
      .pipe(catchError(() => of(null)))
      .subscribe({ error: () => this.refresh$.next() });
  }

  clearAll(): void {
    const ids = this.notificationsSignal().map(n => n.id);
    this.notificationsSignal.set([]);
    for (const id of ids) {
      this.http.delete<void>(`${environment.apiUrl}/notifications/${id}`)
        .pipe(catchError(() => of(null)))
        .subscribe({ error: () => this.refresh$.next() });
    }
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

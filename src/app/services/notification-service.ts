import { Injectable, signal, computed, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { interval, Subject, merge, of, BehaviorSubject } from 'rxjs';
import { switchMap, map, catchError, startWith, distinctUntilChanged } from 'rxjs/operators';
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

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private refresh$ = new Subject<void>();

  private readonly notificationsSignal = signal<Notification[]>([]);
  private readonly totalSignal = signal(0);

  readonly notifications = this.notificationsSignal.asReadonly();
  readonly total = this.totalSignal.asReadonly();
  readonly unreadCount = computed(() => this.notificationsSignal().filter(n => !n.read).length);

  private readonly paramsSubject = new BehaviorSubject<{ limit: number; offset: number; search: string }>({ limit: 10, offset: 0, search: '' });

  constructor() {
    merge(
      interval(30_000).pipe(startWith(0)),
      this.refresh$,
    ).pipe(
      switchMap(() => this.paramsSubject.pipe(
        distinctUntilChanged((a, b) => a.limit === b.limit && a.offset === b.offset && a.search === b.search),
      )),
      switchMap(({ limit, offset, search }) => {
        let url = `${environment.apiUrl}/notifications?limit=${limit}&offset=${offset}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        return this.http.get<PaginatedResponse<ApiNotificationResponse>>(url);
      }),
      map(res => {
        this.totalSignal.set(res.total);
        return res.data.map(fromApiResponse);
      }),
      catchError(() => of<Notification[]>(this.notificationsSignal())),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(data => this.notificationsSignal.set(data));
  }

  setParams(limit: number, offset: number, search: string): void {
    this.paramsSubject.next({ limit, offset, search });
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
    this.notificationsSignal.set([]);
    this.http.delete<void>(`${environment.apiUrl}/notifications`)
      .pipe(catchError(() => of(null)))
      .subscribe({ error: () => this.refresh$.next() });
  }

  refresh(): void {
    this.refresh$.next();
  }
}

import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';
import { SearchComponent } from '../../components/search/search';
import { TasksApiService } from '../../services/tasks-api.service';
import { AuthService } from '../../services/auth.service';
import { GroupStoreService } from '../../services/group-store.service';
import { NotificationService } from '../../services/notification-service';
import { TaskCardComponent } from './task-card';
import { TaskFormComponent } from './task-form';
import { TaskDetailComponent } from './task-detail';
import { TaskDeleteComponent } from './task-delete';
import {
  LucideClipboardList,
  LucideRefreshCw,
  LucideCircleCheck,
} from '@lucide/angular';

const STATUS_CONFIG: Record<string, { label: string; color: string; border: string; bg: string; badge: string }> = {
  todo: { label: 'A Fazer', color: 'from-blue-400 to-blue-600', border: 'border-blue-500/30', bg: 'bg-blue-500/10', badge: 'badge-blue' },
  doing: { label: 'Fazendo', color: 'from-amber-400 to-amber-600', border: 'border-amber-500/30', bg: 'bg-amber-500/10', badge: 'badge-amber' },
  done: { label: 'Concluído', color: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', badge: 'badge-emerald' },
};

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, ButtonComponent, SearchComponent,
    TaskCardComponent, TaskFormComponent, TaskDetailComponent, TaskDeleteComponent,
    LucideClipboardList, LucideRefreshCw, LucideCircleCheck,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Tarefas</h1>
        </div>
        <app-button type="button" variant="solid" label="+ Nova Tarefa" (click)="openCreate()"></app-button>
      </div>

      <app-search placeholder="Pesquisar por título, responsável..." (searchChange)="onSearch($event)" />

      <!-- Kanban columns -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        @for (s of statuses; track s) {
          <div class="flex flex-col rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10 min-h-0">
            <!-- Column header -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-theme">
              <div class="flex items-center gap-2">
                @switch (s) {
                  @case ('todo') { <svg lucideClipboardList class="w-5 h-5 text-blue-400"></svg> }
                  @case ('doing') { <svg lucideRefreshCw class="w-5 h-5 text-amber-400"></svg> }
                  @case ('done') { <svg lucideCircleCheck class="w-5 h-5 text-emerald-400"></svg> }
                }
                <span class="text-primary font-bold text-sm">{{ STATUS_CONFIG[s].label }}</span>
              </div>
              <span class="text-xs font-medium {{ STATUS_CONFIG[s].badge }} px-2 py-0.5 rounded-full">{{ tasksByStatus(s).length }}</span>
            </div>

            <!-- Column body -->
            <div class="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto"
              [attr.data-status]="s"
              role="list" aria-dropeffect="move"
              (dragover)="onDragOver($event)" (dragenter)="onDragEnter(s)" (dragleave)="onDragLeave(s, $event)" (drop)="onDrop(s)"
              [class.ring-2]="dragOverStatus() === s"
              [class.ring-purple-500/50]="dragOverStatus() === s"
              [class.rounded-xl]="dragOverStatus() === s">
              @if (tasksByStatus(s).length > 0) {
                @for (t of tasksByStatus(s); track t.id; let i = $index) {
                  @if (dragOverStatus() === s && dropIndex() === i) {
                    <div class="h-0.5 rounded-full bg-purple-500/70 shrink-0"></div>
                  }
                  <app-task-card
                    [task]="t"
                    [isOverdue]="isOverdue(t)"
                    [isDragging]="draggedTaskId() === t.id"
                    [canModify]="canModify(t)"
                    [ADMIN_USER]="ADMIN_USER"
                    (edit)="openEdit(t)"
                    (delete)="deleteTask(t.id)"
                    (click)="openDetail(t)"
                    (dragstart)="onDragStart(t.id, $event)"
                    (dragend)="onDragEnd()"
                    (touchstart)="onTouchStart(t.id, t.title, t.assignedTo, $event)"
                    (keydown)="onKeyDown(t.id, t.status, $event)" />
                }
                @if (dragOverStatus() === s && dropIndex() === tasksByStatus(s).length) {
                  <div class="h-0.5 rounded-full bg-purple-500/70 shrink-0"></div>
                }
              } @else {
                <div class="flex-1 flex items-center justify-center">
                  <p class="text-muted text-sm text-center">Nenhuma tarefa</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Create modal -->
    @if (showModal()) {
      <app-task-form mode="create" [members]="members" [today]="today" (save)="confirmCreate($event)" (cancel)="showModal.set(false)" />
    }

    <!-- Detail modal -->
    @if (selectedTask(); as t) {
      <app-task-detail [task]="t" [isOverdue]="isOverdue(t)" [ADMIN_USER]="ADMIN_USER" (close)="selectedTask.set(undefined)" />
    }

    <!-- Edit modal -->
    @if (editingTask(); as t) {
      <app-task-form mode="edit" [task]="t" [members]="members" [today]="today" (save)="confirmEdit(t, $event)" (cancel)="editingTask.set(undefined)" />
    }

    <!-- Delete confirmation -->
    @if (taskToDelete(); as id) {
      <app-task-delete (confirm)="confirmDelete()" (cancel)="cancelDelete()" />
    }

    <div aria-live="polite" aria-atomic="true" class="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none">{{ dropAnnouncement() }}</div>
  `,
})
export class TasksPage {
  private route = inject(ActivatedRoute);
  private tasksApi = inject(TasksApiService);
  private auth = inject(AuthService);
  protected store = inject(GroupStoreService);
  private notif = inject(NotificationService);

  protected readonly STATUS_CONFIG = STATUS_CONFIG;
  protected readonly statuses = ['todo', 'doing', 'done'] as const;
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected showModal = signal(false);
  protected selectedTask = signal<any | undefined>(undefined);
  protected editingTask = signal<any | undefined>(undefined);
  protected taskToDelete = signal<string | undefined>(undefined);
  protected draggedTaskId = signal<string | null>(null);
  protected dragOverStatus = signal<string | null>(null);
  protected dropIndex = signal<number | null>(null);
  protected dropAnnouncement = signal('');

  private readonly tasksSignal = signal<any[]>([]);

  constructor() {
    const groupId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    this.store.setGroupId(groupId);
    effect(() => {
      const tasks = this.store.tasks();
      if (tasks.length) {
        const members = this.store.members();
        this.tasksSignal.set(tasks.map((t: any) => ({
          ...t,
          assignedTo: members.find((m: any) => m.user_id === t.assigned_to)?.nome ?? t.assigned_to,
          dueDate: t.due_date ?? t.dueDate,
        })));
      }
    });
  }

  protected get members(): string[] {
    return this.store.memberNames();
  }

  protected get CURRENT_USER(): string {
    return this.store.currentUser();
  }

  protected get ADMIN_USER(): string {
    return this.store.adminUser();
  }

  protected isOverdue(task: any): boolean {
    if (task.status === 'done' || !task.dueDate) return false;
    return new Date(task.dueDate + 'T23:59:59') < new Date();
  }

  protected searchQuery = signal('');

  protected readonly filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.tasksSignal();
    return this.tasksSignal().filter((t: any) =>
      t.title.toLowerCase().includes(query) ||
      t.assignedTo.toLowerCase().includes(query)
    );
  });

  protected tasksByStatus = (status: string) => {
    return this.filteredTasks().filter((t: any) => t.status === status);
  };

  protected onDragStart(id: string, e: DragEvent): void {
    this.draggedTaskId.set(id);
    e.dataTransfer?.setData('text/plain', String(id));
    if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
  }

  protected onDragEnd(): void {
    this.draggedTaskId.set(null);
    this.dragOverStatus.set(null);
    this.dropIndex.set(null);
  }

  protected onDragOver(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    const status = (e.currentTarget as HTMLElement).getAttribute('data-status');
    if (status !== null) {
      this.dropIndex.set(this.computeDropIndex(e.clientY, status));
    }
  }

  protected onDragEnter(status: string): void {
    this.dragOverStatus.set(status);
  }

  protected onDragLeave(status: string, e: DragEvent): void {
    const container = e.currentTarget as HTMLElement | null;
    const related = e.relatedTarget as HTMLElement | null;
    if (container && related && container.contains(related)) return;
    if (this.dragOverStatus() === status) {
      this.dragOverStatus.set(null);
      this.dropIndex.set(null);
    }
  }

  protected onDrop(targetStatus: string): void {
    const id = this.draggedTaskId();
    const dropIdx = this.dropIndex();
    if (id === null) return;
    const task = this.tasksSignal().find((t: any) => t.id === id);
    if (!task) {
      this.draggedTaskId.set(null);
      this.dragOverStatus.set(null);
      this.dropIndex.set(null);
      return;
    }
    const taskName = task.title;

    if (task.status === targetStatus) {
      this.tasksSignal.update((list: any[]) => {
        const without = list.filter((t: any) => t.id !== id);
        const sameBefore = without.filter((t: any) => t.status === targetStatus);
        const posInStatus = list.filter((t: any) => t.status === targetStatus).findIndex((t: any) => t.id === id);
        const adjustedDropIdx = dropIdx !== null && dropIdx > posInStatus ? dropIdx - 1 : (dropIdx ?? sameBefore.length);
        const insertAt = Math.min(adjustedDropIdx, sameBefore.length);
        const result: any[] = [];
        let inserted = false;
        let count = 0;
        for (const t of without) {
          if (t.status === targetStatus && count === insertAt && !inserted) {
            result.push(task);
            inserted = true;
          }
          result.push(t);
          if (t.status === targetStatus) count++;
        }
        if (!inserted) result.push(task);
        return result;
      });
      this.dropAnnouncement.set(`Tarefa "${taskName}" reordenada`);
    } else {
      this.tasksSignal.update((list: any[]) => {
        const without = list.filter((t: any) => t.id !== id);
        const sameBefore = without.filter((t: any) => t.status === targetStatus);
        const insertAt = Math.min(dropIdx ?? sameBefore.length, sameBefore.length);
        const moved = { ...task, status: targetStatus };
        const result: any[] = [];
        let inserted = false;
        let count = 0;
        for (const t of without) {
          if (t.status === targetStatus && count === insertAt && !inserted) {
            result.push(moved);
            inserted = true;
          }
          result.push(t);
          if (t.status === targetStatus) count++;
        }
        if (!inserted) result.push(moved);
        return result;
      });
      this.tasksApi.update(id, { status: targetStatus }).subscribe();
      this.dropAnnouncement.set(`Tarefa "${taskName}" movida para ${STATUS_CONFIG[targetStatus as keyof typeof STATUS_CONFIG].label}`);
    }

    this.draggedTaskId.set(null);
    this.dragOverStatus.set(null);
    this.dropIndex.set(null);
  }

  private computeDropIndex(y: number, status: string): number {
    const colEl = document.querySelector(`[data-status="${status}"]`);
    if (!colEl) return 0;
    const cards = colEl.querySelectorAll(':scope > [role="listitem"]');
    if (cards.length === 0) return 0;
    const colRect = colEl.getBoundingClientRect();
    const relativeY = y - colRect.top;
    let idx = cards.length;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top - colRect.top;
      if (relativeY > cardTop + rect.height / 2) {
        idx = i + 1;
      }
    });
    return idx;
  }

  protected onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  private touchGhost: HTMLElement | null = null;
  private touchMoved = false;
  private suppressNextClick = false;

  protected onTouchStart(taskId: string, title: string, assignedTo: string, e: TouchEvent): void {
    this.touchMoved = false;
    this.draggedTaskId.set(taskId);
    const touch = e.touches[0];

    const ghost = document.createElement('div');
    ghost.innerHTML = `<div style="padding:12px 16px;background:rgba(255,255,255,0.10);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.15);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);transform:rotate(2deg) scale(1.03);">
      <p style="color:white;font-size:14px;font-weight:600;margin:0;">${title}</p>
      <p style="color:rgba(255,255,255,0.5);font-size:11px;margin:4px 0 0;">${assignedTo}</p>
    </div>`;
    ghost.style.position = 'fixed';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';
    ghost.style.left = touch.clientX - 100 + 'px';
    ghost.style.top = touch.clientY - 40 + 'px';
    ghost.style.width = '200px';
    document.body.appendChild(ghost);
    this.touchGhost = ghost;

    document.addEventListener('touchmove', this.onTouchMove, { passive: false });
    document.addEventListener('touchend', this.onTouchEnd);
  }

  protected onTouchMove = (e: TouchEvent): void => {
    this.touchMoved = true;
    const touch = e.touches[0];

    if (this.touchGhost) {
      this.touchGhost.style.left = touch.clientX - 100 + 'px';
      this.touchGhost.style.top = touch.clientY - 40 + 'px';
    }

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el) {
      const colBody = el.closest('[data-status]');
      if (colBody) {
        const status = colBody.getAttribute('data-status');
        if (status) {
          this.dragOverStatus.set(status);
          this.dropIndex.set(this.computeDropIndex(touch.clientY, status));
        }
      } else {
        this.dragOverStatus.set(null);
        this.dropIndex.set(null);
      }
    }
    e.preventDefault();
  };

  protected onTouchEnd = (): void => {
    if (this.touchGhost) {
      document.body.removeChild(this.touchGhost);
      this.touchGhost = null;
    }
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);

    if (this.touchMoved) {
      this.suppressNextClick = true;
      const id = this.draggedTaskId();
      const targetStatus = this.dragOverStatus();
      const dropIdx = this.dropIndex();
      if (id !== null && targetStatus !== null) {
        const task = this.tasksSignal().find((t: any) => t.id === id);
        if (task) {
          const taskName = task.title;
          if (task.status === targetStatus) {
            this.tasksSignal.update((list: any[]) => {
              const without = list.filter((t: any) => t.id !== id);
              const sameBefore = without.filter((t: any) => t.status === targetStatus);
              const posInStatus = list.filter((t: any) => t.status === targetStatus).findIndex((t: any) => t.id === id);
              const adjustedDropIdx = dropIdx !== null && dropIdx > posInStatus ? dropIdx - 1 : (dropIdx ?? sameBefore.length);
              const insertAt = Math.min(adjustedDropIdx, sameBefore.length);
              const result: any[] = [];
              let inserted = false;
              let count = 0;
              for (const t of without) {
                if (t.status === targetStatus && count === insertAt && !inserted) {
                  result.push(task);
                  inserted = true;
                }
                result.push(t);
                if (t.status === targetStatus) count++;
              }
              if (!inserted) result.push(task);
              return result;
            });
            this.dropAnnouncement.set(`Tarefa "${taskName}" reordenada`);
          } else {
            this.tasksSignal.update((list: any[]) => {
              const without = list.filter((t: any) => t.id !== id);
              const sameBefore = without.filter((t: any) => t.status === targetStatus);
              const insertAt = Math.min(dropIdx ?? sameBefore.length, sameBefore.length);
              const moved = { ...task, status: targetStatus };
              const result: any[] = [];
              let inserted = false;
              let count = 0;
              for (const t of without) {
                if (t.status === targetStatus && count === insertAt && !inserted) {
                  result.push(moved);
                  inserted = true;
                }
                result.push(t);
                if (t.status === targetStatus) count++;
              }
              if (!inserted) result.push(moved);
              return result;
            });
            this.tasksApi.update(id, { status: targetStatus }).subscribe();
            this.dropAnnouncement.set(`Tarefa "${taskName}" movida para ${STATUS_CONFIG[targetStatus as keyof typeof STATUS_CONFIG].label}`);
          }
        }
      }
      setTimeout(() => { this.suppressNextClick = false; }, 200);
    }

    if (!this.touchMoved) {
      this.suppressNextClick = false;
    }
    this.draggedTaskId.set(null);
    this.dragOverStatus.set(null);
    this.dropIndex.set(null);
  };

  openCreate(): void {
    this.showModal.set(true);
  }

  openDetail(task: any): void {
    if (this.suppressNextClick) return;
    this.selectedTask.set(task);
  }

  openEdit(task: any): void {
    this.editingTask.set({ ...task });
  }

  protected onKeyDown(taskId: string, currentStatus: string, e: KeyboardEvent): void {
    const order = ['todo', 'doing', 'done'];
    const idx = order.indexOf(currentStatus);
    if (e.ctrlKey && e.key === 'ArrowRight' && idx < order.length - 1) {
      e.preventDefault();
      this.updateTaskStatus(taskId, order[idx + 1]);
    } else if (e.ctrlKey && e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      this.updateTaskStatus(taskId, order[idx - 1]);
    }
  }

  private updateTaskStatus(taskId: string, status: string): void {
    this.tasksSignal.update((list: any[]) =>
      list.map((t: any) => t.id === taskId ? { ...t, status } : t)
    );
    this.tasksApi.update(taskId, { status }).subscribe();
  }

  confirmCreate(data: { title: string; description: string; assignedTo: string; dueDate: string }): void {
    if (!data.title.trim()) return;
    const member = this.store.members().find((m: any) => m.nome === data.assignedTo);
    this.tasksApi.create(this.store.groupId(), {
      title: data.title.trim(),
      description: data.description.trim(),
      assigned_to: member?.user_id ?? '',
      due_date: data.dueDate,
    }).subscribe({
      next: (task) => {
        const members = this.store.members();
        const normalized = {
          ...task,
          assignedTo: members.find((m: any) => m.user_id === task.assigned_to)?.nome ?? task.assigned_to,
          dueDate: task.due_date ?? task.dueDate,
        };
        this.tasksSignal.update((list: any[]) => [...list, normalized]);
        this.store.tasks.update((list: any[]) => [...list, normalized]);
        if (normalized.dueDate) {
          this.notif.add('task_reminder', 'Tarefa próxima do prazo',
            `${normalized.title} — vence em ${normalized.dueDate}`,
            normalized.assignedTo, normalized.id);
        }
        this.showModal.set(false);
      },
    });
  }

  canModify(task: any): boolean {
    return task.createdBy === this.CURRENT_USER || this.CURRENT_USER === this.ADMIN_USER;
  }

  confirmEdit(task: any, data: { title: string; description: string; assignedTo: string; dueDate: string }): void {
    if (!data.title.trim()) return;
    const member = this.store.members().find((m: any) => m.nome === data.assignedTo);
    this.tasksApi.update(task.id, {
      title: data.title.trim(),
      description: data.description.trim(),
      assigned_to: member?.user_id ?? '',
      due_date: data.dueDate,
    }).subscribe({
      next: () => {
        this.tasksSignal.update((list: any[]) =>
          list.map((t: any) =>
            t.id === task.id
              ? { ...t, title: data.title.trim(), description: data.description.trim(), assignedTo: data.assignedTo, dueDate: data.dueDate }
              : t
          )
        );
        this.editingTask.set(undefined);
      },
    });
  }

  deleteTask(id: string): void {
    this.taskToDelete.set(id);
  }

  confirmDelete(): void {
    const id = this.taskToDelete();
    if (id === undefined) return;
    this.tasksApi.delete(id).subscribe({
      next: () => {
        this.tasksSignal.update((list: any[]) => list.filter((t: any) => t.id !== id));
        this.store.tasks.update((list: any[]) => list.filter((t: any) => t.id !== id));
        this.taskToDelete.set(undefined);
      },
    });
  }

  cancelDelete(): void {
    this.taskToDelete.set(undefined);
  }
}

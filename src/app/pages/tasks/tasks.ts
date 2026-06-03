import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button';
import { BuscaComponent } from '../../components/busca/busca';
import { MockDataService, Task, TaskStatus } from '../../services/mock-data.service';
import { NotificationService } from '../../services/notification-service';
import { ThemeService } from '../../services/theme-service';
import {
  LucideClipboardList,
  LucideRefreshCw,
  LucideCircleCheck,
  LucideTrash2,
  LucidePen,
  LucideTriangleAlert,
  LucideX,
} from '@lucide/angular';

const STATUS_CONFIG = {
  todo: { label: 'A Fazer', color: 'from-blue-400 to-blue-600', border: 'border-blue-500/30', bg: 'bg-blue-500/10', badge: 'badge-blue' },
  doing: { label: 'Fazendo', color: 'from-amber-400 to-amber-600', border: 'border-amber-500/30', bg: 'bg-amber-500/10', badge: 'badge-amber' },
  done: { label: 'Concluído', color: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', badge: 'badge-emerald' },
};

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, DatePipe, ButtonComponent, BuscaComponent,
    LucideClipboardList, LucideRefreshCw, LucideCircleCheck,
    LucideTrash2, LucidePen,
    LucideTriangleAlert, LucideX,
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
                    <div draggable="true" (dragstart)="onDragStart(t.id, $event)" (dragend)="onDragEnd()"
                      (touchstart)="onTouchStart(t.id, t.title, t.assignedTo, $event)"
                      (click)="openDetail(t)" (keydown)="onKeyDown(t.id, t.status, $event)"
                      tabindex="0" role="listitem"
                      [attr.aria-grabbed]="draggedTaskId() === t.id"
                      class="rounded-xl bg-card-strong border border-theme p-4 hover:bg-card-hover transition shadow-md cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:outline-none"
                      [class.border-rose-500/40]="isOverdue(t)"
                      [class.opacity-40]="draggedTaskId() === t.id">
                     <div class="flex items-start justify-between gap-3">
                       <div class="min-w-0 flex-1">
                         <p class="text-primary font-medium text-sm leading-snug">{{ t.title }}</p>
                         <div class="flex items-center gap-2 mt-2 flex-wrap">
                            <span class="text-[11px] badge-purple px-2 py-0.5 rounded-full">{{ t.assignedTo }}</span>
                             @if (isOverdue(t)) {
                               <span class="text-[11px] badge-rose px-2 py-0.5 rounded-full flex items-center gap-1"><svg lucideTriangleAlert class="w-3 h-3"></svg> Atrasada</span>
                             }
                            @if (t.createdBy === ADMIN_USER) {
                              <span class="text-[11px] badge-amber px-2 py-0.5 rounded-full">Admin</span>
                            }
                           <span class="text-[11px] text-muted">{{ t.createdAt | date:'dd/MM' }}</span>
                           @if (t.dueDate) {
                             <span class="text-[11px] text-muted border border-theme rounded px-1.5 py-0.5">{{ t.dueDate | date:'dd/MM' }}</span>
                           }
                         </div>
                       </div>
                       <div class="flex items-center gap-1 shrink-0" (click)="$event.stopPropagation()">
                         @if (canModify(t)) {
                           <button (click)="openEdit(t)" class="w-7 h-7 flex items-center justify-center rounded-lg transition cursor-pointer"
                             [class.bg-white/10]="theme.theme() === 'dark'"
                             [class.hover:bg-white/20]="theme.theme() === 'dark'"
                             [class.text-white/60]="theme.theme() === 'dark'"
                             [class.hover:text-white]="theme.theme() === 'dark'"
                             [class.bg-gray-100]="theme.theme() === 'light'"
                             [class.hover:bg-gray-200]="theme.theme() === 'light'"
                             [class.text-gray-600]="theme.theme() === 'light'"
                             [class.hover:text-gray-900]="theme.theme() === 'light'"><svg lucidePen class="w-3.5 h-3.5"></svg></button>
                           <button (click)="deleteTask(t.id)" class="w-7 h-7 flex items-center justify-center rounded-lg transition cursor-pointer"
                             [class.bg-red-500/10]="theme.theme() === 'dark'"
                             [class.hover:bg-red-500/25]="theme.theme() === 'dark'"
                             [class.text-red-400]="theme.theme() === 'dark'"
                             [class.hover:text-red-300]="theme.theme() === 'dark'"
                             [class.bg-red-100]="theme.theme() === 'light'"
                             [class.hover:bg-red-200]="theme.theme() === 'light'"
                             [class.text-red-600]="theme.theme() === 'light'"
                             [class.hover:text-red-700]="theme.theme() === 'light'"><svg lucideTrash2 class="w-4 h-4"></svg></button>
                         }
                       </div>
                     </div>
                    </div>
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
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="showModal.set(false)">
        <div class="w-full max-w-md rounded-2xl bg-card border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-primary">Nova Tarefa</h2>
            <button (click)="showModal.set(false)" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Título</label>
              <input #titleInput type="text" placeholder="Ex: Limpar a cozinha"
                class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm">
            </div>
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Descrição <span class="text-muted">(opcional)</span></label>
              <textarea #descInput rows="3" placeholder="Descreva a tarefa..."
                class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm resize-none"></textarea>
            </div>
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Responsável</label>
                <select #memberSelect class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm appearance-none cursor-pointer">
                  @for (m of members; track m) {
                    <option class="bg-purple-dark text-white" [value]="m">{{ m }}</option>
                  }
                </select>
            </div>
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Data limite</label>
              <input #dueDateInput type="date" [min]="today"
                class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm" />
            </div>
            <div class="flex justify-end gap-3 mt-2">
              <button (click)="showModal.set(false)" class="px-4 py-2 rounded-xl border border-theme text-primary font-medium text-sm hover:text-secondary hover-bg transition cursor-pointer">Cancelar</button>
              <button (click)="confirmCreate(titleInput.value, descInput.value, memberSelect.value, dueDateInput.value)" class="px-6 py-2 rounded-xl bg-linear-to-r from-purple-500 to-purple-700 text-white font-medium text-sm hover:brightness-110 transition cursor-pointer">Criar</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Detail modal -->
    @if (selectedTask(); as t) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="selectedTask.set(undefined)">
        <div class="w-full max-w-lg rounded-2xl bg-card border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3 min-w-0">
              @switch (t.status) {
                @case ('todo') { <svg lucideClipboardList class="w-6 h-6 text-blue-400 shrink-0"></svg> }
                @case ('doing') { <svg lucideRefreshCw class="w-6 h-6 text-amber-400 shrink-0"></svg> }
                @case ('done') { <svg lucideCircleCheck class="w-6 h-6 text-emerald-400 shrink-0"></svg> }
              }
              <div class="min-w-0">
                <h2 class="text-lg font-bold text-primary truncate">{{ t.title }}</h2>
                <span class="text-xs font-medium {{ STATUS_CONFIG[t.status].badge }} px-2 py-0.5 rounded-full">{{ STATUS_CONFIG[t.status].label }}</span>
              </div>
            </div>
            <button (click)="selectedTask.set(undefined)" class="text-muted hover:text-primary transition cursor-pointer shrink-0"><svg lucideX class="w-5 h-5"></svg></button>
          </div>

          <div class="flex flex-col gap-4">
            @if (t.description) {
              <div>
                <label class="text-muted text-xs font-medium mb-1.5 block">Descrição</label>
                <p class="text-secondary text-sm leading-relaxed bg-card-strong rounded-xl px-4 py-3 border border-theme">{{ t.description }}</p>
              </div>
            }
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-muted text-xs font-medium mb-1 block">Responsável</label>
                <p class="text-primary text-sm">{{ t.assignedTo }}</p>
              </div>
              <div>
                <label class="text-muted text-xs font-medium mb-1 block">Criado por</label>
                <p class="text-primary text-sm">{{ t.createdBy }} @if (t.createdBy === ADMIN_USER) { <span class="text-[11px] badge-amber px-2 py-0.5 rounded-full">Admin</span> }</p>
              </div>
              <div>
                <label class="text-muted text-xs font-medium mb-1 block">Criada em</label>
                <p class="text-primary text-sm">{{ t.createdAt | date:'dd/MM/yyyy' }}</p>
              </div>
              @if (t.dueDate) {
                <div>
                  <label class="text-muted text-xs font-medium mb-1 block">Data limite</label>
                  <p class="text-primary text-sm" [class.text-rose-400]="isOverdue(t)">{{ t.dueDate | date:'dd/MM/yyyy' }} @if (isOverdue(t)) { <span class="text-[11px] badge-rose px-2 py-0.5 rounded-full inline-flex items-center gap-1"><svg lucideTriangleAlert class="w-3 h-3"></svg> Atrasada</span> }</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Edit modal -->
    @if (editingTask(); as t) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="editingTask.set(undefined)">
        <div class="w-full max-w-md rounded-2xl bg-card border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-primary">Editar Tarefa</h2>
            <button (click)="editingTask.set(undefined)" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Título</label>
              <input #editTitle type="text" [value]="t.title" placeholder="Ex: Limpar a cozinha"
                class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm">
            </div>
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Descrição <span class="text-muted">(opcional)</span></label>
              <textarea #editDesc rows="3" [value]="t.description" placeholder="Descreva a tarefa..."
                class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm resize-none"></textarea>
            </div>
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Responsável</label>
                <select #editMember class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm appearance-none cursor-pointer">
                  @for (m of members; track m) {
                    <option class="bg-card text-primary" [value]="m" [selected]="m === t.assignedTo">{{ m }}</option>
                  }
                </select>
            </div>
            <div>
              <label class="text-secondary text-xs font-medium mb-1.5 block">Data limite</label>
              <input #editDueDate type="date" [value]="t.dueDate" [min]="t.createdAt"
                class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm" />
            </div>
            <div class="flex justify-end gap-3 mt-2">
              <button (click)="editingTask.set(undefined)" class="px-4 py-2 rounded-xl border border-theme text-primary font-medium text-sm hover:text-secondary hover-bg transition cursor-pointer">Cancelar</button>
              <button (click)="confirmEdit(t, editTitle.value, editDesc.value, editMember.value, editDueDate.value)" class="px-6 py-2 rounded-xl bg-linear-to-r from-purple-500 to-purple-700 text-white font-medium text-sm hover:brightness-110 transition cursor-pointer">Salvar</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Delete confirmation -->
    @if (taskToDelete(); as id) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="cancelDelete()">
        <div class="w-full max-w-sm rounded-2xl bg-card border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <svg lucideTriangleAlert class="w-5 h-5 text-red-400"></svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-primary">Excluir tarefa</h2>
              <p class="text-secondary text-sm">Tem certeza? Esta ação não pode ser desfeita.</p>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button (click)="cancelDelete()" class="px-4 py-2 rounded-xl border border-theme text-primary font-medium text-sm hover:text-secondary hover-bg transition cursor-pointer">Cancelar</button>
            <button (click)="confirmDelete()" class="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition cursor-pointer">Excluir</button>
          </div>
        </div>
      </div>
    }

    <div aria-live="polite" aria-atomic="true" class="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none">{{ dropAnnouncement() }}</div>
  `,
})
export class TarefasPage {
  protected mockData = inject(MockDataService);
  protected theme = inject(ThemeService);
  protected readonly members = this.mockData.MEMBROS;
  protected readonly STATUS_CONFIG = STATUS_CONFIG;
  protected readonly statuses: TaskStatus[] = ['todo', 'doing', 'done'];
  protected readonly CURRENT_USER = this.mockData.CURRENT_USER;
  protected readonly ADMIN_USER = this.mockData.ADMIN_USER;
  protected readonly today = new Date().toISOString().slice(0, 10);

  private tasksSignal = signal<Task[]>([...this.mockData.tasks()]);
  private notif = inject(NotificationService);

  protected showModal = signal(false);
  protected selectedTask = signal<Task | undefined>(undefined);
  protected editingTask = signal<Task | undefined>(undefined);
  protected taskToDelete = signal<number | undefined>(undefined);
  protected draggedTaskId = signal<number | null>(null);
  protected dragOverStatus = signal<TaskStatus | null>(null);
  protected dropIndex = signal<number | null>(null);
  protected dropAnnouncement = signal('');

  constructor() {
    this.checkOverdueTasks();
  }

  private checkOverdueTasks(): void {
    const today = new Date();
    for (const task of this.tasksSignal()) {
      if (task.status === 'done' || !task.dueDate) continue;
      const due = new Date(task.dueDate + 'T23:59:59');
      if (due < today) {
        this.notif.add('task_overdue', 'Tarefa atrasada',
          `${task.title} — atribuída a ${task.assignedTo}`,
          this.ADMIN_USER, task.id);
      }
    }
  }

  protected isOverdue(task: Task): boolean {
    if (task.status === 'done' || !task.dueDate) return false;
    return new Date(task.dueDate + 'T23:59:59') < new Date();
  }

  protected searchQuery = signal('');

  protected readonly filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.tasksSignal();
    return this.tasksSignal().filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.assignedTo.toLowerCase().includes(query)
    );
  });

  protected tasksByStatus = (status: TaskStatus) => {
    return this.filteredTasks().filter(t => t.status === status);
  };

  private nextId = computed(() => Math.max(...this.tasksSignal().map(t => t.id), 0) + 1);

  protected onDragStart(id: number, e: DragEvent): void {
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
    const status = (e.currentTarget as HTMLElement).getAttribute('data-status') as TaskStatus | null;
    if (status !== null) {
      this.dropIndex.set(this.computeDropIndex(e.clientY, status));
    }
  }

  protected onDragEnter(status: TaskStatus): void {
    this.dragOverStatus.set(status);
  }

  protected onDragLeave(status: TaskStatus, e: DragEvent): void {
    const container = e.currentTarget as HTMLElement | null;
    const related = e.relatedTarget as HTMLElement | null;
    if (container && related && container.contains(related)) return;
    if (this.dragOverStatus() === status) {
      this.dragOverStatus.set(null);
      this.dropIndex.set(null);
    }
  }

  protected onDrop(targetStatus: TaskStatus): void {
    const id = this.draggedTaskId();
    if (id === null) return;
    const task = this.tasksSignal().find(t => t.id === id);
    if (!task || task.status === targetStatus) {
      this.draggedTaskId.set(null);
      this.dragOverStatus.set(null);
      return;
    }
    this.tasksSignal.update(list =>
      list.map(t => t.id === id ? { ...t, status: targetStatus } : t)
    );
    const taskName = this.tasksSignal().find(t => t.id === id)?.title ?? '';
    this.dropAnnouncement.set(`Tarefa "${taskName}" movida para ${STATUS_CONFIG[targetStatus].label}`);
    this.draggedTaskId.set(null);
    this.dragOverStatus.set(null);
    this.dropIndex.set(null);
  }

  private computeDropIndex(y: number, status: TaskStatus): number {
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

  protected onTouchStart(taskId: number, title: string, assignedTo: string, e: TouchEvent): void {
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
    e.preventDefault();
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
        const status = colBody.getAttribute('data-status') as TaskStatus | null;
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
      const status = this.dragOverStatus();
      if (id !== null && status !== null) {
        const task = this.tasksSignal().find(t => t.id === id);
        if (task && task.status !== status) {
          this.tasksSignal.update(list =>
            list.map(t => t.id === id ? { ...t, status } : t)
          );
          this.dropAnnouncement.set(`Tarefa "${task.title}" movida para ${STATUS_CONFIG[status].label}`);
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

  openDetail(task: Task): void {
    if (this.suppressNextClick) return;
    this.selectedTask.set(task);
  }

  protected onKeyDown(taskId: number, currentStatus: TaskStatus, e: KeyboardEvent): void {
    const order: TaskStatus[] = ['todo', 'doing', 'done'];
    const idx = order.indexOf(currentStatus);
    if (e.ctrlKey && e.key === 'ArrowRight' && idx < order.length - 1) {
      e.preventDefault();
      this.tasksSignal.update(list =>
        list.map(t => t.id === taskId ? { ...t, status: order[idx + 1] } : t)
      );
    } else if (e.ctrlKey && e.key === 'ArrowLeft' && idx > 0) {
      e.preventDefault();
      this.tasksSignal.update(list =>
        list.map(t => t.id === taskId ? { ...t, status: order[idx - 1] } : t)
      );
    }
  }

  confirmCreate(title: string, description: string, assignedTo: string, dueDate: string): void {
    if (!title.trim()) return;
    const task: Task = {
      id: this.nextId(),
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      createdBy: this.CURRENT_USER,
      status: 'todo',
      createdAt: new Date().toISOString().slice(0, 10),
      dueDate,
    };
    this.tasksSignal.update(list => [...list, task]);

    // RN-16: notificar responsável 24h antes
    if (task.dueDate) {
      this.notif.add('task_reminder', 'Tarefa próxima do prazo',
        `${task.title} — vence em ${task.dueDate}`,
        task.assignedTo, task.id);
    }

    this.showModal.set(false);
  }

  canModify(task: Task): boolean {
    return task.createdBy === this.CURRENT_USER || this.CURRENT_USER === this.ADMIN_USER;
  }

  openEdit(task: Task): void {
    this.editingTask.set({ ...task });
  }

  confirmEdit(task: Task, title: string, description: string, assignedTo: string, dueDate: string): void {
    if (!title.trim()) return;
    this.tasksSignal.update(list =>
      list.map(t =>
        t.id === task.id
          ? { ...t, title: title.trim(), description: description.trim(), assignedTo, dueDate }
          : t
      )
    );
    this.editingTask.set(undefined);
  }

  deleteTask(id: number): void {
    this.taskToDelete.set(id);
  }

  confirmDelete(): void {
    const id = this.taskToDelete();
    if (id === undefined) return;
    this.tasksSignal.update(list => list.filter(t => t.id !== id));
    this.taskToDelete.set(undefined);
  }

  cancelDelete(): void {
    this.taskToDelete.set(undefined);
  }
}

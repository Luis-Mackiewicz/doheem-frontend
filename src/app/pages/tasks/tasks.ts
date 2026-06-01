import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button';
import { NotificationService } from '../../services/notification-service';

type TaskStatus = 'todo' | 'doing' | 'done';

interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
}

const CURRENT_USER: string = 'Carlos';
const ADMIN_USER: string = 'Ana';

const MOCK_MEMBERS = ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'];

const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Consertar torneira da cozinha', description: 'A torneira da pia direita está vazando água sem parar. Precisa trocar o vedante.', assignedTo: 'Carlos', createdBy: 'Carlos', status: 'todo', createdAt: '2026-05-28', dueDate: '2026-06-05' },
  { id: 2, title: 'Comprar lâmpadas novas', description: 'Duas lâmpadas da sala queimaram. Comprar LED 9W bocal E27.', assignedTo: 'Ana', createdBy: 'Ana', status: 'todo', createdAt: '2026-05-29', dueDate: '2026-06-02' },
  { id: 3, title: 'Limpar caixa d\'água', description: 'A caixa d\'água precisa de limpeza urgente. Agendar para o sábado de manhã.', assignedTo: 'Pedro', createdBy: 'Pedro', status: 'todo', createdAt: '2026-05-30', dueDate: '2026-06-10' },
  { id: 4, title: 'Organizar despensa', description: 'Separar alimentos por validade e organizar as prateleiras.', assignedTo: 'Mariana', createdBy: 'Mariana', status: 'doing', createdAt: '2026-05-25', dueDate: '2026-06-01' },
  { id: 5, title: 'Lavar roupa de cama', description: 'Trocas os lençóis e fronhas de todos os quartos.', assignedTo: 'João', createdBy: 'João', status: 'doing', createdAt: '2026-05-26', dueDate: '2026-06-03' },
  { id: 6, title: 'Limpar área externa', description: 'Varrer o quintal, lavar o chão e regar as plantas.', assignedTo: 'Pedro', createdBy: 'Ana', status: 'done', createdAt: '2026-05-20', dueDate: '2026-05-25' },
  { id: 7, title: 'Passar pano na sala', description: 'Passar pano úmido em toda a sala e lustrar os móveis.', assignedTo: 'Ana', createdBy: 'Ana', status: 'done', createdAt: '2026-05-22', dueDate: '2026-05-28' },
  { id: 8, title: 'Trocar filtro da água', description: 'O filtro do bebedouro venceu. Comprar um novo e trocar.', assignedTo: 'Carlos', createdBy: 'Ana', status: 'done', createdAt: '2026-05-23', dueDate: '2026-05-30' },
];

const STATUS_CONFIG = {
  todo: { label: 'A Fazer', icon: '📋', color: 'from-blue-400 to-blue-600', border: 'border-blue-500/30', bg: 'bg-blue-500/10', badge: 'bg-blue-500/20 text-blue-300' },
  doing: { label: 'Fazendo', icon: '🔄', color: 'from-amber-400 to-amber-600', border: 'border-amber-500/30', bg: 'bg-amber-500/10', badge: 'bg-amber-500/20 text-amber-300' },
  done: { label: 'Concluído', icon: '✅', color: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', badge: 'bg-emerald-500/20 text-emerald-300' },
};

@Component({
  selector: 'app-tarefas',
  imports: [FormsModule, DatePipe, ButtonComponent],
  template: `
    <div class="flex flex-col gap-8 h-full">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Tarefas</h1>
          <p class="text-muted text-sm mt-1">Gerencie as tarefas da república</p>
          <div class="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mt-3"></div>
        </div>
        <app-button type="button" variant="solid" label="+ Nova Tarefa" (click)="openCreate()"></app-button>
      </div>

      <!-- Kanban columns -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        @for (s of statuses; track s) {
          <div class="flex flex-col rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10 min-h-0">
            <!-- Column header -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-theme">
              <div class="flex items-center gap-2">
                <span>{{ STATUS_CONFIG[s].icon }}</span>
                <span class="text-primary font-bold text-sm">{{ STATUS_CONFIG[s].label }}</span>
              </div>
              <span class="text-xs font-medium {{ STATUS_CONFIG[s].badge }} px-2 py-0.5 rounded-full">{{ tasksByStatus(s).length }}</span>
            </div>

            <!-- Column body -->
            <div class="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
              @if (tasksByStatus(s).length > 0) {
                @for (t of tasksByStatus(s); track t.id) {
                    <div (click)="openDetail(t)" class="rounded-xl bg-card-strong border border-theme p-4 hover:bg-card-hover transition shadow-md cursor-pointer"
                      [class.border-rose-500/40]="isOverdue(t)">
                     <div class="flex items-start justify-between gap-3">
                       <div class="min-w-0 flex-1">
                         <p class="text-primary font-medium text-sm leading-snug">{{ t.title }}</p>
                         <div class="flex items-center gap-2 mt-2 flex-wrap">
                           <span class="text-[11px] bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-full">{{ t.assignedTo }}</span>
                           @if (isOverdue(t)) {
                             <span class="text-[11px] bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded-full">⚠️ Atrasada</span>
                           }
                           @if (t.createdBy === ADMIN_USER) {
                             <span class="text-[11px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">Admin</span>
                           }
                           <span class="text-[11px] text-muted">{{ t.createdAt | date:'dd/MM' }}</span>
                         </div>
                       </div>
                      <div class="flex items-center gap-1 shrink-0" (click)="$event.stopPropagation()">
                        @if (s !== 'todo') {
                          <button (click)="moveTask(t.id, -1)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition cursor-pointer text-sm">◀</button>
                        }
                        @if (s !== 'done') {
                          <button (click)="moveTask(t.id, 1)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition cursor-pointer text-sm">▶</button>
                        }
                        @if (canDelete(t)) {
                          <button (click)="deleteTask(t.id)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition cursor-pointer text-sm">🗑️</button>
                        }
                      </div>
                    </div>
                  </div>
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
        <div class="w-full max-w-md rounded-2xl bg-purple-dark border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-primary">Nova Tarefa</h2>
            <button (click)="showModal.set(false)" class="text-muted hover:text-primary transition cursor-pointer text-xl">✕</button>
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
                @for (m of MOCK_MEMBERS; track m) {
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
              <button (click)="showModal.set(false)" class="px-4 py-2 rounded-xl text-secondary hover:text-primary transition text-sm cursor-pointer">Cancelar</button>
              <button (click)="confirmCreate(titleInput.value, descInput.value, memberSelect.value, dueDateInput.value)" class="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium text-sm hover:brightness-110 transition cursor-pointer">Criar</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Detail modal -->
    @if (selectedTask(); as t) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="selectedTask.set(undefined)">
        <div class="w-full max-w-lg rounded-2xl bg-purple-dark border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-3 min-w-0">
              <span class="text-2xl">{{ STATUS_CONFIG[t.status].icon }}</span>
              <div class="min-w-0">
                <h2 class="text-lg font-bold text-primary truncate">{{ t.title }}</h2>
                <span class="text-xs font-medium {{ STATUS_CONFIG[t.status].badge }} px-2 py-0.5 rounded-full">{{ STATUS_CONFIG[t.status].label }}</span>
              </div>
            </div>
            <button (click)="selectedTask.set(undefined)" class="text-muted hover:text-primary transition cursor-pointer text-xl shrink-0">✕</button>
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
                <p class="text-primary text-sm">{{ t.createdBy }} @if (t.createdBy === ADMIN_USER) { <span class="text-[11px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full">Admin</span> }</p>
              </div>
              <div>
                <label class="text-muted text-xs font-medium mb-1 block">Criada em</label>
                <p class="text-primary text-sm">{{ t.createdAt | date:'dd/MM/yyyy' }}</p>
              </div>
              @if (t.dueDate) {
                <div>
                  <label class="text-muted text-xs font-medium mb-1 block">Data limite</label>
                  <p class="text-primary text-sm" [class.text-rose-400]="isOverdue(t)">{{ t.dueDate | date:'dd/MM/yyyy' }} @if (isOverdue(t)) { <span class="text-[11px] bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded-full">Atrasada</span> }</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class TarefasPage {
  protected readonly MOCK_MEMBERS = MOCK_MEMBERS;
  protected readonly STATUS_CONFIG = STATUS_CONFIG;
  protected readonly statuses: TaskStatus[] = ['todo', 'doing', 'done'];
  protected readonly CURRENT_USER = CURRENT_USER;
  protected readonly ADMIN_USER = ADMIN_USER;
  protected readonly today = new Date().toISOString().slice(0, 10);

  private tasksSignal = signal<Task[]>([...MOCK_TASKS]);
  private notif = inject(NotificationService);

  protected showModal = signal(false);
  protected selectedTask = signal<Task | undefined>(undefined);

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
          ADMIN_USER, task.id);
      }
    }
  }

  protected isOverdue(task: Task): boolean {
    if (task.status === 'done' || !task.dueDate) return false;
    return new Date(task.dueDate + 'T23:59:59') < new Date();
  }

  protected tasksByStatus = (status: TaskStatus) => {
    return this.tasksSignal().filter(t => t.status === status);
  };

  private nextId = computed(() => Math.max(...this.tasksSignal().map(t => t.id), 0) + 1);

  moveTask(id: number, direction: -1 | 1): void {
    this.tasksSignal.update(list => {
      const order: TaskStatus[] = ['todo', 'doing', 'done'];
      return list.map(t => {
        if (t.id !== id) return t;
        const idx = order.indexOf(t.status);
        const newIdx = Math.max(0, Math.min(order.length - 1, idx + direction));
        return { ...t, status: order[newIdx] };
      });
    });
  }

  openCreate(): void {
    this.showModal.set(true);
  }

  openDetail(task: Task): void {
    this.selectedTask.set(task);
  }

  confirmCreate(title: string, description: string, assignedTo: string, dueDate: string): void {
    if (!title.trim()) return;
    const task: Task = {
      id: this.nextId(),
      title: title.trim(),
      description: description.trim(),
      assignedTo,
      createdBy: CURRENT_USER,
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

  canDelete(task: Task): boolean {
    return task.createdBy === CURRENT_USER || CURRENT_USER === ADMIN_USER;
  }

  deleteTask(id: number): void {
    this.tasksSignal.update(list => list.filter(t => t.id !== id));
  }
}

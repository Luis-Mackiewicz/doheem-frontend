import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button';

type TaskStatus = 'todo' | 'doing' | 'done';

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  status: TaskStatus;
  createdAt: string;
}

const MOCK_MEMBERS = ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'];

const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Consertar torneira da cozinha', assignedTo: 'Carlos', status: 'todo', createdAt: '2026-05-28' },
  { id: 2, title: 'Comprar lâmpadas novas', assignedTo: 'Ana', status: 'todo', createdAt: '2026-05-29' },
  { id: 3, title: 'Limpar caixa d\'água', assignedTo: 'Pedro', status: 'todo', createdAt: '2026-05-30' },
  { id: 4, title: 'Organizar despensa', assignedTo: 'Mariana', status: 'doing', createdAt: '2026-05-25' },
  { id: 5, title: 'Lavar roupa de cama', assignedTo: 'João', status: 'doing', createdAt: '2026-05-26' },
  { id: 6, title: 'Limpar área externa', assignedTo: 'Pedro', status: 'done', createdAt: '2026-05-20' },
  { id: 7, title: 'Passar pano na sala', assignedTo: 'Ana', status: 'done', createdAt: '2026-05-22' },
  { id: 8, title: 'Trocar filtro da água', assignedTo: 'Carlos', status: 'done', createdAt: '2026-05-23' },
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
          <h1 class="text-3xl font-bold text-white tracking-tight">Tarefas</h1>
          <p class="text-white/40 text-sm mt-1">Gerencie as tarefas da república</p>
          <div class="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mt-3"></div>
        </div>
        <app-button type="button" variant="solid" label="+ Nova Tarefa" (click)="openCreate()"></app-button>
      </div>

      <!-- Kanban columns -->
      <div class="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        @for (s of statuses; track s) {
          <div class="flex flex-col rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 p-4 shadow-lg shadow-black/10 min-h-0">
            <!-- Column header -->
            <div class="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div class="flex items-center gap-2">
                <span>{{ STATUS_CONFIG[s].icon }}</span>
                <span class="text-white font-bold text-sm">{{ STATUS_CONFIG[s].label }}</span>
              </div>
              <span class="text-xs font-medium {{ STATUS_CONFIG[s].badge }} px-2 py-0.5 rounded-full">{{ tasksByStatus(s).length }}</span>
            </div>

            <!-- Column body -->
            <div class="flex-1 flex flex-col gap-3 min-h-0 overflow-y-auto">
              @if (tasksByStatus(s).length > 0) {
                @for (t of tasksByStatus(s); track t.id) {
                  <div class="rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 p-4 hover:bg-white/[0.14] transition shadow-md">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0 flex-1">
                        <p class="text-white font-medium text-sm leading-snug">{{ t.title }}</p>
                        <div class="flex items-center gap-2 mt-2 flex-wrap">
                          <span class="text-[11px] bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-full">{{ t.assignedTo }}</span>
                          <span class="text-[11px] text-white/30">{{ t.createdAt | date:'dd/MM' }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1 shrink-0">
                        @if (s !== 'todo') {
                          <button (click)="moveTask(t.id, -1)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition cursor-pointer text-sm">◀</button>
                        }
                        @if (s !== 'done') {
                          <button (click)="moveTask(t.id, 1)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition cursor-pointer text-sm">▶</button>
                        }
                      </div>
                    </div>
                  </div>
                }
              } @else {
                <div class="flex-1 flex items-center justify-center">
                  <p class="text-white/25 text-sm text-center">Nenhuma tarefa</p>
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
        <div class="w-full max-w-md rounded-2xl bg-purple-dark border border-white/10 p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-white">Nova Tarefa</h2>
            <button (click)="showModal.set(false)" class="text-white/40 hover:text-white transition cursor-pointer text-xl">✕</button>
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <label class="text-white/60 text-xs font-medium mb-1.5 block">Título</label>
              <input #titleInput type="text" placeholder="Ex: Limpar a cozinha"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-white/50 transition text-sm">
            </div>
            <div>
              <label class="text-white/60 text-xs font-medium mb-1.5 block">Responsável</label>
              <select #memberSelect class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white outline-none focus:border-white/50 transition text-sm appearance-none cursor-pointer">
                @for (m of MOCK_MEMBERS; track m) {
                  <option class="bg-purple-dark text-white" [value]="m">{{ m }}</option>
                }
              </select>
            </div>
            <div class="flex justify-end gap-3 mt-2">
              <button (click)="showModal.set(false)" class="px-4 py-2 rounded-xl text-white/60 hover:text-white transition text-sm cursor-pointer">Cancelar</button>
              <button (click)="confirmCreate(titleInput.value, memberSelect.value)" class="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium text-sm hover:brightness-110 transition cursor-pointer">Criar</button>
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

  private tasksSignal = signal<Task[]>([...MOCK_TASKS]);

  protected showModal = signal(false);

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

  confirmCreate(title: string, assignedTo: string): void {
    if (!title.trim()) return;
    this.tasksSignal.update(list => [
      ...list,
      { id: this.nextId(), title: title.trim(), assignedTo, status: 'todo', createdAt: new Date().toISOString().slice(0, 10) },
    ]);
    this.showModal.set(false);
  }
}

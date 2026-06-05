import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../services/mock-data.service';
import {
  LucideClipboardList,
  LucideRefreshCw,
  LucideCircleCheck,
  LucideTriangleAlert,
  LucideX,
} from '@lucide/angular';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, LucideClipboardList, LucideRefreshCw, LucideCircleCheck, LucideTriangleAlert, LucideX],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="close.emit()">
      <div class="w-full max-w-lg rounded-2xl bg-card border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-3 min-w-0">
            @switch (task.status) {
              @case ('todo') { <svg lucideClipboardList class="w-6 h-6 text-blue-400 shrink-0"></svg> }
              @case ('doing') { <svg lucideRefreshCw class="w-6 h-6 text-amber-400 shrink-0"></svg> }
              @case ('done') { <svg lucideCircleCheck class="w-6 h-6 text-emerald-400 shrink-0"></svg> }
            }
            <div class="min-w-0">
              <h2 class="text-lg font-bold text-primary truncate">{{ task.title }}</h2>
              <span class="text-xs font-medium {{ STATUS_CONFIG[task.status].badge }} px-2 py-0.5 rounded-full">{{ STATUS_CONFIG[task.status].label }}</span>
            </div>
          </div>
          <button (click)="close.emit()" class="text-muted hover:text-primary transition cursor-pointer shrink-0"><svg lucideX class="w-5 h-5"></svg></button>
        </div>

        <div class="flex flex-col gap-4">
          @if (task.description) {
            <div>
              <label class="text-muted text-xs font-medium mb-1.5 block">Descrição</label>
              <p class="text-secondary text-sm leading-relaxed bg-card-strong rounded-xl px-4 py-3 border border-theme">{{ task.description }}</p>
            </div>
          }
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-muted text-xs font-medium mb-1 block">Responsável</label>
              <p class="text-primary text-sm">{{ task.assignedTo }}</p>
            </div>
            <div>
              <label class="text-muted text-xs font-medium mb-1 block">Criado por</label>
              <p class="text-primary text-sm">{{ task.createdBy }} @if (task.createdBy === ADMIN_USER) { <span class="text-[11px] badge-amber px-2 py-0.5 rounded-full">Admin</span> }</p>
            </div>
            <div>
              <label class="text-muted text-xs font-medium mb-1 block">Criada em</label>
              <p class="text-primary text-sm">{{ task.createdAt | date:'dd/MM/yyyy' }}</p>
            </div>
            @if (task.dueDate) {
              <div>
                <label class="text-muted text-xs font-medium mb-1 block">Data limite</label>
                <p class="text-primary text-sm" [class.text-rose-400]="isOverdue">{{ task.dueDate | date:'dd/MM/yyyy' }} @if (isOverdue) { <span class="text-[11px] badge-rose px-2 py-0.5 rounded-full inline-flex items-center gap-1"><svg lucideTriangleAlert class="w-3 h-3"></svg> Atrasada</span> }</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TaskDetailComponent {
  protected readonly STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
    todo: { label: 'A Fazer', badge: 'badge-blue' },
    doing: { label: 'Fazendo', badge: 'badge-amber' },
    done: { label: 'Concluído', badge: 'badge-emerald' },
  };

  @Input({ required: true }) task!: Task;
  @Input() isOverdue = false;
  @Input() ADMIN_USER = '';

  @Output() close = new EventEmitter<void>();
}

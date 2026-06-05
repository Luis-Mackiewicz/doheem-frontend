import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../services/mock-data.service';
import { ThemeService } from '../../services/theme-service';
import {
  LucideTrash2,
  LucidePen,
  LucideTriangleAlert,
} from '@lucide/angular';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, LucideTrash2, LucidePen, LucideTriangleAlert],
  template: `
    <div draggable="true"
      (dragstart)="onDragStart($event)" (dragend)="onDragEnd()"
      (touchstart)="onTouchStart($event)"
      (click)="onClick()" (keydown)="onKeyDown($event)"
      tabindex="0" role="listitem"
      [attr.aria-grabbed]="isDragging"
      class="rounded-xl bg-card-strong border border-theme p-4 hover:bg-card-hover transition shadow-md cursor-grab active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:outline-none"
      [class.border-rose-500/40]="isOverdue"
      [class.opacity-40]="isDragging">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="text-primary font-medium text-sm leading-snug">{{ task.title }}</p>
          <div class="flex items-center gap-2 mt-2 flex-wrap">
            <span class="text-[11px] badge-purple px-2 py-0.5 rounded-full">{{ task.assignedTo }}</span>
            @if (isOverdue) {
              <span class="text-[11px] badge-rose px-2 py-0.5 rounded-full flex items-center gap-1"><svg lucideTriangleAlert class="w-3 h-3"></svg> Atrasada</span>
            }
            @if (task.createdBy === ADMIN_USER) {
              <span class="text-[11px] badge-amber px-2 py-0.5 rounded-full">Admin</span>
            }
            <span class="text-[11px] text-muted">{{ task.createdAt | date:'dd/MM' }}</span>
            @if (task.dueDate) {
              <span class="text-[11px] text-muted border border-theme rounded px-1.5 py-0.5">{{ task.dueDate | date:'dd/MM' }}</span>
            }
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0" (click)="$event.stopPropagation()">
          @if (canModify) {
            <button (click)="onEdit()" class="w-7 h-7 flex items-center justify-center rounded-lg transition cursor-pointer"
              [class.bg-white/10]="themeService.theme() === 'dark'"
              [class.hover:bg-white/20]="themeService.theme() === 'dark'"
              [class.text-white/60]="themeService.theme() === 'dark'"
              [class.hover:text-white]="themeService.theme() === 'dark'"
              [class.bg-gray-100]="themeService.theme() === 'light'"
              [class.hover:bg-gray-200]="themeService.theme() === 'light'"
              [class.text-gray-600]="themeService.theme() === 'light'"
              [class.hover:text-gray-900]="themeService.theme() === 'light'"><svg lucidePen class="w-3.5 h-3.5"></svg></button>
            <button (click)="onDelete()" class="w-7 h-7 flex items-center justify-center rounded-lg transition cursor-pointer"
              [class.bg-red-500/10]="themeService.theme() === 'dark'"
              [class.hover:bg-red-500/25]="themeService.theme() === 'dark'"
              [class.text-red-400]="themeService.theme() === 'dark'"
              [class.hover:text-red-300]="themeService.theme() === 'dark'"
              [class.bg-red-100]="themeService.theme() === 'light'"
              [class.hover:bg-red-200]="themeService.theme() === 'light'"
              [class.text-red-600]="themeService.theme() === 'light'"
              [class.hover:text-red-700]="themeService.theme() === 'light'"><svg lucideTrash2 class="w-4 h-4"></svg></button>
          }
        </div>
      </div>
    </div>
  `,
})
export class TaskCardComponent {
  protected themeService = inject(ThemeService);

  @Input({ required: true }) task!: Task;
  @Input() isOverdue = false;
  @Input() isDragging = false;
  @Input() canModify = false;
  @Input() ADMIN_USER = '';

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() click = new EventEmitter<void>();
  @Output() dragstart = new EventEmitter<DragEvent>();
  @Output() dragend = new EventEmitter<void>();
  @Output() touchstart = new EventEmitter<TouchEvent>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();

  protected onDragStart(e: DragEvent): void {
    this.dragstart.emit(e);
  }

  protected onDragEnd(): void {
    this.dragend.emit();
  }

  protected onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    this.touchstart.emit(e);
  }

  protected onClick(): void {
    this.click.emit();
  }

  protected onKeyDown(e: KeyboardEvent): void {
    this.keydown.emit(e);
  }

  protected onEdit(): void {
    this.edit.emit();
  }

  protected onDelete(): void {
    this.delete.emit();
  }
}

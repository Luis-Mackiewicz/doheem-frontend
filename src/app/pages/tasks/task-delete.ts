import { Component, EventEmitter, Output } from '@angular/core';
import { LucideTriangleAlert } from '@lucide/angular';

@Component({
  selector: 'app-task-delete',
  imports: [LucideTriangleAlert],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="cancel.emit()">
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
          <button (click)="cancel.emit()" class="px-4 py-2 rounded-xl border border-theme text-primary font-medium text-sm hover:text-secondary hover-bg transition cursor-pointer">Cancelar</button>
          <button (click)="confirm.emit()" class="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition cursor-pointer">Excluir</button>
        </div>
      </div>
    </div>
  `,
})
export class TaskDeleteComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Task } from '../../services/mock-data.service';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-task-form',
  imports: [LucideX],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" (click)="cancel.emit()">
      <div class="w-full max-w-md rounded-2xl bg-card border border-theme p-6 shadow-2xl shadow-black/40" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-primary">{{ mode === 'create' ? 'Nova Tarefa' : 'Editar Tarefa' }}</h2>
          <button (click)="cancel.emit()" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label class="text-secondary text-xs font-medium mb-1.5 block">Título</label>
            <input #titleRef type="text" placeholder="Ex: Limpar a cozinha"
              [value]="mode === 'edit' ? task?.title : ''"
              class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm">
          </div>
          <div>
            <label class="text-secondary text-xs font-medium mb-1.5 block">Descrição <span class="text-muted">(opcional)</span></label>
            <textarea #descRef rows="3" placeholder="Descreva a tarefa..."
              [value]="mode === 'edit' ? task?.description : ''"
              class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm resize-none"></textarea>
          </div>
          <div>
            <label class="text-secondary text-xs font-medium mb-1.5 block">Responsável</label>
            <select #memberRef class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm appearance-none cursor-pointer">
              @for (m of members; track m) {
                <option [class.bg-purple-dark]="mode === 'create'" [class.bg-card]="mode === 'edit'" class="text-primary" [value]="m" [selected]="mode === 'edit' && task?.assignedTo === m">{{ m }}</option>
              }
            </select>
          </div>
          <div>
            <label class="text-secondary text-xs font-medium mb-1.5 block">Data limite</label>
            <input #dueDateRef type="date" [value]="mode === 'edit' ? task?.dueDate : ''" [min]="today"
              (input)="dueDateError.set(false)"
              class="w-full bg-input border border-theme rounded-xl px-4 py-2.5 text-primary outline-none focus:border-purple-400/60 transition text-sm"
              [class.border-rose-500/60]="dueDateError()" />
            @if (dueDateError()) {
              <p class="text-rose-400 text-xs mt-1">Selecione uma data limite</p>
            }
          </div>
          <div class="flex justify-end gap-3 mt-2">
            <button (click)="cancel.emit()" class="px-4 py-2 rounded-xl border border-theme text-primary font-medium text-sm hover:text-secondary hover-bg transition cursor-pointer">Cancelar</button>
            <button (click)="onSave(titleRef.value, descRef.value, memberRef.value, dueDateRef.value)" class="px-6 py-2 rounded-xl bg-linear-to-r from-purple-500 to-purple-700 text-white font-medium text-sm hover:brightness-110 transition cursor-pointer">{{ mode === 'create' ? 'Criar' : 'Salvar' }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TaskFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task: Task | null = null;
  @Input() members: string[] = [];
  @Input() today = '';

  @Output() save = new EventEmitter<{ title: string; description: string; assignedTo: string; dueDate: string }>();
  @Output() cancel = new EventEmitter<void>();

  protected readonly dueDateError = signal(false);

  protected onSave(title: string, description: string, assignedTo: string, dueDate: string): void {
    this.dueDateError.set(false);
    if (!dueDate) {
      this.dueDateError.set(true);
      return;
    }
    this.save.emit({ title, description, assignedTo, dueDate });
  }
}

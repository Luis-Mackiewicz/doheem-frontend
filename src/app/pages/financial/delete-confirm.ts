import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';
import { Expense } from '../../services/mock-data.service';

@Component({
  selector: 'app-delete-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  template: `
    @if (deleting) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancel.emit()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-2xl bg-card border border-theme p-4 sm:p-6 shadow-2xl">
            <h2 class="text-primary font-bold text-lg mb-2">Excluir despesa?</h2>
            <p class="text-secondary text-sm">Tem certeza que deseja excluir "{{ deleting.description }}"?</p>
            <p class="text-muted text-xs mt-1">Esta ação não pode ser desfeita.</p>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="cancel.emit()"></app-button>
              <button type="button" (click)="confirm.emit()" [disabled]="saving"
                class="flex-1 inline-flex items-center justify-center gap-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-500 transition shadow-lg cursor-pointer px-8 py-3 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60">
                @if (saving) {
                  <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                }
                Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DeleteConfirmComponent {
  @Input() deleting: Expense | null = null;
  @Input() saving = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    if (this.deleting) this.cancel.emit();
  }
}

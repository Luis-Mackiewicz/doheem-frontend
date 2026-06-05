import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';
import { Expense } from '../../services/mock-data.service';

@Component({
  selector: 'app-delete-confirm',
  imports: [ButtonComponent],
  template: `
    @if (deleting) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancel.emit()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-2xl bg-card border border-theme p-6 shadow-2xl">
            <h2 class="text-primary font-bold text-lg mb-2">Excluir despesa?</h2>
            <p class="text-secondary text-sm">Tem certeza que deseja excluir "{{ deleting.description }}"?</p>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="cancel.emit()"></app-button>
              <app-button type="button" variant="solid" label="Excluir" (click)="confirm.emit()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class DeleteConfirmComponent {
  @Input() deleting: Expense | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

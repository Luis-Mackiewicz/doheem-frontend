import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';
import { LucideX } from '@lucide/angular';
import { Expense } from '../../services/mock-data.service';

@Component({
  selector: 'app-pay-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, LucideX],
  template: `
    @if (expense) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancel.emit()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-2xl bg-card border border-theme p-4 sm:p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-primary font-bold text-lg">Pagar despesa</h2>
              <button (click)="cancel.emit()" aria-label="Fechar" class="w-10 h-10 flex items-center justify-center rounded-lg text-muted hover:text-primary hover-bg transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60"><svg lucideX class="w-5 h-5"></svg></button>
            </div>
            <p class="text-secondary text-sm mb-1">{{ expense.description }}</p>
            @if (payingSplit; as sv) {
              <p class="text-primary font-semibold text-lg">{{ sv.name === currentUser ? 'Sua cota' : 'Cota de ' + sv.name }}: R$ {{ fmt(sv.value) }}</p>
            } @else {
              @for (sv of expense.splitValues; track sv.name) {
                @if (sv.name === currentUser) {
                  <p class="text-primary font-semibold text-lg">Sua cota: R$ {{ fmt(sv.value) }}</p>
                }
              }
            }
            <div class="mt-4 flex flex-col gap-2">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Comprovante (opcional)
                <input type="file" accept="image/*,application/pdf" (change)="receiptSelected.emit($event)"
                  class="text-secondary text-sm file:bg-white/10 file:border file:border-theme file:rounded-lg file:px-3 file:py-2 file:text-primary file:cursor-pointer file:mr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60" />
              </label>
              @if (payReceiptBase64) {
                <img [src]="payReceiptBase64" class="w-full h-32 object-cover rounded-xl border border-theme" />
              }
            </div>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="cancel.emit()"></app-button>
              <app-button type="button" variant="solid" [loading]="saving" label="Confirmar" (click)="confirm.emit()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class PayModalComponent {
  @Input() expense: Expense | null = null;
  @Input() currentUser = '';
  @Input() payingSplit: any = null;
  @Input() payReceiptBase64 = '';
  @Input() saving = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() receiptSelected = new EventEmitter<Event>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.expense) this.cancel.emit();
  }

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }
}

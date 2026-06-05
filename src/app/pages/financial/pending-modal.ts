import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';
import { LucideCheck, LucideX } from '@lucide/angular';
import { Expense, Payment } from '../../services/mock-data.service';

@Component({
  selector: 'app-pending-modal',
  imports: [ButtonComponent, LucideCheck, LucideX],
  template: `
    @if (showPending) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="close.emit()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-lg">
          <div class="rounded-2xl bg-card border border-theme p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-primary font-bold text-lg">Pagamentos pendentes</h2>
              <button (click)="close.emit()" aria-label="Fechar" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
            </div>
            @if (hasPending()) {
              @for (e of expenses; track e.id) {
                @if (pendingForCreator(e).length > 0) {
                  <div class="mb-4 last:mb-0">
                    <p class="text-secondary text-sm font-medium mb-2">{{ e.description }}</p>
                    @for (p of pendingForCreator(e); track p.memberName) {
                      <div class="rounded-xl bg-card-strong p-4 mb-2 last:mb-0">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-primary font-semibold">{{ p.memberName }}</span>
                          <span class="text-secondary text-xs">Pago em {{ p.paidAt }}</span>
                        </div>
                        @for (sv of e.splitValues; track sv.name) {
                          @if (sv.name === p.memberName) {
                            <p class="text-secondary text-sm">Valor: R$ {{ fmt(sv.value) }}</p>
                          }
                        }
                        @if (p.receiptBase64) {
                          <img [src]="p.receiptBase64" class="w-full h-40 object-cover rounded-xl border border-theme mt-2 cursor-pointer" (click)="expandReceipt.emit(p.receiptBase64)" />
                        }
                        <div class="flex gap-2 mt-3">
                          <button (click)="approve.emit(p)" class="flex-1 text-xs font-medium badge-emerald px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition cursor-pointer flex items-center justify-center gap-1"><svg lucideCheck class="w-3 h-3"></svg> Aprovar</button>
                          <button (click)="reject.emit(p)" class="flex-1 text-xs font-medium badge-rose px-3 py-1.5 rounded-lg hover:bg-rose-500/30 transition cursor-pointer flex items-center justify-center gap-1"><svg lucideX class="w-3 h-3"></svg> Rejeitar</button>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
            } @else {
              <p class="text-muted text-center py-6">Nenhum pagamento pendente</p>
            }
            <div class="mt-4">
              <app-button type="button" variant="outline" label="Fechar" (click)="close.emit()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class PendingModalComponent {
  @Input() expenses: Expense[] = [];
  @Input() payments: Payment[] = [];
  @Input() currentUser = '';
  @Input() isAdmin = false;
  @Input() showPending = false;
  @Output() approve = new EventEmitter<Payment>();
  @Output() reject = new EventEmitter<Payment>();
  @Output() close = new EventEmitter<void>();
  @Output() expandReceipt = new EventEmitter<string>();

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected hasPending(): boolean {
    return this.expenses.some(e => this.pendingForCreator(e).length > 0);
  }

  protected pendingForCreator(expense: Expense): Payment[] {
    if (!this.isAdmin && expense.paidBy !== this.currentUser) return [];
    return this.payments.filter(p => p.expenseId === expense.id && p.status === 'awaiting');
  }
}

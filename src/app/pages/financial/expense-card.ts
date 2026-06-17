import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideHouse,
  LucideZap,
  LucideWifi,
  LucideDroplets,
  LucideShoppingCart,
  LucideSparkles,
  LucidePackage,
  LucideCircleCheck,
  LucidePen,
  LucideTrash2,
  LucidePin,
} from '@lucide/angular';

@Component({
  selector: 'app-expense-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe,
    LucideHouse, LucideZap, LucideWifi, LucideDroplets, LucideShoppingCart,
    LucideSparkles, LucidePackage, LucideCircleCheck,
    LucidePen, LucideTrash2, LucidePin,
  ],
  template: `
    <div class="rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10 hover:bg-card-hover transition">
      <!-- Top row: icon + description + amount -->
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
          @switch (expense.category) {
            @case ('aluguel') { <svg lucideHouse class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
            @case ('energia') { <svg lucideZap class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
            @case ('internet') { <svg lucideWifi class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
            @case ('agua') { <svg lucideDroplets class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
            @case ('compras') { <svg lucideShoppingCart class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
            @case ('limpeza') { <svg lucideSparkles class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
            @default { <svg lucidePackage class="w-4.5 h-4.5 text-(--badge-purple)"></svg> }
          }
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="text-primary font-semibold truncate text-sm">{{ expense.description }}</p>
              <div class="flex items-center gap-1.5 mt-0.5 flex-wrap">
                @if (expense.installmentGroup; as ig) {
                  <span class="text-[10px] font-medium badge-purple px-2 py-0.5 rounded-full">Parcela {{ ig.index }}/{{ ig.total }}</span>
                }
                @if (expense.fixed) {
                  <span class="text-[10px] font-medium badge-amber px-2 py-0.5 rounded-full flex items-center gap-0.5"><svg lucidePin class="w-3 h-3"></svg> Fixa</span>
                }
              </div>
            </div>
            <span class="text-primary font-bold text-base shrink-0">R$ {{ fmt(expense.amount) }}</span>
          </div>
        </div>
      </div>

      <!-- Meta line -->
      <p class="text-muted text-xs mt-1.5">{{ categoryLabel(expense.category) }} · {{ expense.competenceDate | date:'dd/MM/yyyy' }} · {{ expense.paidBy }} @if (expense.dueDate) { · Vence {{ expense.dueDate | date:'dd/MM/yyyy' }} }</p>

      <!-- Split chips -->
      <div class="flex items-center gap-1.5 mt-2 flex-wrap">
        <span class="text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">{{ splitModeLabel(expense.splitMode) }}</span>
        @for (sv of expense.splitValues; track sv.name) {
          @if (sv.is_paid) {
            <span class="flex items-center gap-1 text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              {{ sv.name }} R$ {{ fmt(sv.value) }}
            </span>
          } @else if (isAdmin || sv.name === currentUser) {
            <span class="flex items-center gap-1 text-[11px] bg-card-strong text-secondary rounded-full overflow-hidden">
              <span class="flex items-center gap-1 pl-2 py-0.5">
                <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                {{ sv.name }} R$ {{ fmt(sv.value) }}
              </span>
              <button (click)="pay.emit({ expense, split: sv })"
                class="px-2 py-1 font-semibold bg-purple-500/15 text-(--badge-purple) hover:bg-purple-500/25 hover:text-purple-200 transition-all cursor-pointer whitespace-nowrap">
                Pagar
              </button>
            </span>
          } @else {
            <span class="flex items-center gap-1 text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">
              <span class="w-2 h-2 rounded-full bg-gray-400"></span>
              {{ sv.name }} R$ {{ fmt(sv.value) }}
            </span>
          }
        }
      </div>

      <!-- Footer: status + actions -->
      @if (totalPaid > 0 || currentUserSplit || !expense.splitValues?.length || ((expense.paidBy === currentUser || expense.createdBy === currentUser || isAdmin) && !hasPaidSplits)) {
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-theme/50 gap-2">
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            @if (totalPaid > 0) {
              <span class="text-secondary">Pago: R$ {{ fmt(totalPaid) }}</span>
              <span class="text-secondary">Restante: R$ {{ fmt(remaining) }}</span>
            }
            @if (currentUserSplit; as sv) {
              <span class="text-secondary">Sua parte: R$ {{ fmt(sv.value) }}</span>
              @if (sv.is_paid) {
                <span class="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg"><svg lucideCircleCheck class="w-3 h-3"></svg> Pago</span>
              } @else {
                <button (click)="pay.emit({ expense, split: sv })"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-500/15 text-(--badge-purple) hover:bg-purple-500/25 hover:text-purple-200 transition-all cursor-pointer whitespace-nowrap">
                  Pagar
                </button>
              }
            } @else if (!expense.splitValues?.length) {
              <button (click)="pay.emit({ expense, split: null })"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-500/15 text-(--badge-purple) hover:bg-purple-500/25 hover:text-purple-200 transition-all cursor-pointer whitespace-nowrap">
                Pagar
              </button>
            }
          </div>
          @if ((expense.paidBy === currentUser || expense.createdBy === currentUser || isAdmin) && !hasPaidSplits) {
            <div class="flex items-center gap-1 shrink-0">
              <button (click)="edit.emit(expense)" aria-label="Editar despesa" class="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-primary hover-bg transition cursor-pointer"><svg lucidePen class="w-3.5 h-3.5"></svg></button>
              <button (click)="delete.emit(expense)" aria-label="Excluir despesa" class="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/15 transition cursor-pointer"><svg lucideTrash2 class="w-3.5 h-3.5"></svg></button>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ExpenseCardComponent {
  @Input({ required: true }) expense!: any;
  @Input({ required: true }) currentUser!: string;
  @Input() isAdmin: boolean = false;
  @Input() categories: { value: string; label: string }[] = [];

  @Output() pay = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() expandReceipt = new EventEmitter<string>();

  protected get currentUserSplit(): any {
    return this.expense.splitValues?.find((sv: any) => sv.name === this.currentUser) ?? null;
  }

  protected get totalPaid(): number {
    return this.expense.splitValues?.reduce((sum: number, sv: any) => sv.is_paid ? sum + sv.value : sum, 0) ?? 0;
  }

  protected get remaining(): number {
    return this.expense.amount - this.totalPaid;
  }

  protected get hasPaidSplits(): boolean {
    return this.expense.splitValues?.some((sv: any) => sv.is_paid) ?? false;
  }

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected categoryLabel(value: string): string {
    return this.categories.find(c => c.value === value)?.label ?? value;
  }

  protected splitModeLabel(mode: string): string {
    const options = [
      { value: 'equal', label: 'Todos' },
      { value: 'some', label: 'Alguns' },
      { value: 'custom', label: 'Personalizado' },
    ] as const;
    return options.find(o => o.value === mode)?.label ?? '';
  }
}

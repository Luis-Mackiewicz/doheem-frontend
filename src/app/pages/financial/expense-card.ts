import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  LucideHouse,
  LucideZap,
  LucideWifi,
  LucideDroplets,
  LucideShoppingCart,
  LucideSparkles,
  LucidePackage,
  LucideClock,
  LucideCircleCheck,
  LucidePen,
  LucideTrash2,
  LucidePin,
} from '@lucide/angular';

@Component({
  selector: 'app-expense-card',
  imports: [DatePipe,
    LucideHouse, LucideZap, LucideWifi, LucideDroplets, LucideShoppingCart,
    LucideSparkles, LucidePackage, LucideClock, LucideCircleCheck,
    LucidePen, LucideTrash2, LucidePin,
  ],
  template: `
    <div class="rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10 hover:bg-card-hover transition">
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 min-w-0 flex-1">
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
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-primary font-semibold truncate text-sm">{{ expense.description }}</p>
                <div class="flex items-center gap-1.5">
                  @if (expense.installmentGroup; as ig) {
                    <span class="text-[10px] font-medium badge-purple px-2 py-0.5 rounded-full">Parcela {{ ig.index }}/{{ ig.total }}</span>
                  }
                  @if (expense.fixed) {
                    <span class="text-[10px] font-medium badge-amber px-2 py-0.5 rounded-full flex items-center gap-0.5"><svg lucidePin class="w-3 h-3"></svg> Fixa</span>
                  }
                </div>
              </div>
              <p class="text-muted text-xs mt-0.5">{{ categoryLabel(expense.category) }} · {{ expense.competenceDate | date:'dd/MM/yyyy' }} · {{ expense.paidBy }} @if (expense.dueDate) { · Vence {{ expense.dueDate | date:'dd/MM/yyyy' }} }</p>
            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">{{ splitModeLabel(expense.splitMode) }}</span>
              @for (sv of expense.splitValues; track sv.name) {
                <span class="flex items-center gap-1 text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">
                  @if (sv.is_paid) {
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  } @else {
                    <span class="w-2 h-2 rounded-full bg-gray-400"></span>
                  }
                  {{ sv.name }} R$ {{ fmt(sv.value) }}
                </span>
              }
            </div>
          </div>
        </div>
        <div class="flex items-start gap-2 shrink-0">
          <div class="flex flex-col items-end gap-2">
            <span class="text-primary font-bold text-base">R$ {{ fmt(expense.amount) }}</span>
            @if (currentUserSplit(); as sv) {
              @if (sv.is_paid) {
                <span class="text-[11px] text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg"><svg lucideCircleCheck class="w-3 h-3"></svg> Pago</span>
              }
            } @else {
              <button (click)="pay.emit(expense)"
                class="px-3 py-1 text-[11px] font-semibold rounded-lg bg-purple-500/15 text-(--badge-purple) hover:bg-purple-500/25 hover:text-purple-200 transition-all cursor-pointer whitespace-nowrap">
                Pagar
              </button>
            }
          </div>
          @if (expense.paidBy === currentUser || isAdmin) {
            <div class="flex flex-col gap-1 pt-0.5">
              <button (click)="edit.emit(expense)" aria-label="Editar despesa" class="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-primary hover-bg transition cursor-pointer"><svg lucidePen class="w-3.5 h-3.5"></svg></button>
              <button (click)="delete.emit(expense)" aria-label="Excluir despesa" class="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/15 transition cursor-pointer"><svg lucideTrash2 class="w-3.5 h-3.5"></svg></button>
            </div>
          }
        </div>
      </div>
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

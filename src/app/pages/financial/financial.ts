import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../components/button/button';
import { PaginatorComponent } from '../../components/paginator/paginator';
import { SearchComponent } from '../../components/search/search';
import { GroupStoreService } from '../../services/group-store.service';
import { ExpensesApiService } from '../../services/expenses-api.service';
import { NotificationService, NOTIFICATION_CONFIG } from '../../services/notification-service';
import { ExpenseCardComponent } from './expense-card';
import { ExpenseFormComponent } from './expense-form';
import { PayModalComponent } from './pay-modal';
import { PendingModalComponent } from './pending-modal';
import { DeleteConfirmComponent } from './delete-confirm';
import {
  LucideDollarSign,
  LucideBell,
  LucideCheck,
  LucideHouse,
  LucideZap,
  LucideWifi,
  LucideDroplets,
  LucideShoppingCart,
  LucideSparkles,
  LucidePackage,
} from '@lucide/angular';

@Component({
  selector: 'app-financial',
  imports: [FormsModule, ButtonComponent, PaginatorComponent, SearchComponent,
    ExpenseCardComponent, ExpenseFormComponent, PayModalComponent, PendingModalComponent, DeleteConfirmComponent,
    LucideDollarSign, LucideBell, LucideCheck,
    LucideHouse, LucideZap, LucideWifi, LucideDroplets, LucideShoppingCart,
    LucideSparkles, LucidePackage,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Financeiro</h1>
          <p class="text-muted text-sm mt-0.5">{{ monthLabel() }}</p>
        </div>
        <div class="flex items-center gap-2">
          @if (totalPendingCount() > 0) {
              <button (click)="showPendingModal.set(true)" aria-label="Pagamentos pendentes ({{ totalPendingCount() }})" class="relative w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center hover:bg-amber-500/25 transition cursor-pointer">
              <svg lucideBell class="w-5 h-5 text-amber-400"></svg>
              <span class="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{{ totalPendingCount() }}</span>
            </button>
          }
          <app-button type="button" variant="solid" label="+ Nova Despesa" (click)="openCreate()"></app-button>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex bg-card-strong rounded-xl p-0.5 gap-0.5 border border-soft">
          <button type="button" (click)="filterPeriod.set('month')"
            class="text-xs px-3.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
            [class.bg-page]="filterPeriod() === 'month'"
            [class.text-accent]="filterPeriod() === 'month'"
            [class.text-secondary]="filterPeriod() !== 'month'"
            [class.shadow-sm]="filterPeriod() === 'month'"
            aria-label="Filtrar por este mês">Este mês</button>
          <button type="button" (click)="filterPeriod.set('all')"
            class="text-xs px-3.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer"
            [class.bg-page]="filterPeriod() === 'all'"
            [class.text-accent]="filterPeriod() === 'all'"
            [class.text-secondary]="filterPeriod() !== 'all'"
            [class.shadow-sm]="filterPeriod() === 'all'"
            aria-label="Mostrar todos os meses">Todas</button>
        </div>
        <button (click)="filterMyExpenses.set(!filterMyExpenses())"
          class="text-xs px-3.5 py-1.5 rounded-lg transition-all font-medium cursor-pointer border"
          [class.badge-purple]="filterMyExpenses()"
          [class.border-soft]="!filterMyExpenses()"
          [class.text-secondary]="!filterMyExpenses()"
          [class.hover-bg]="!filterMyExpenses()">
          @if (filterMyExpenses()) { <svg lucideCheck class="w-3 h-3 inline -ml-0.5 mr-1"></svg> }
          Minhas
        </button>
      </div>

      <!-- Total + Category summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-2 rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
                <svg lucideDollarSign class="w-5 h-5 text-(--badge-purple)"></svg>
              </div>
              <div>
                <p class="text-muted text-xs font-medium">Total {{ filterPeriod() === 'month' ? 'do mês' : 'geral' }}</p>
                <p class="text-2xl font-bold text-primary tracking-tight">R$ {{ fmt(totalAmount()) }}</p>
              </div>
            </div>
            <span class="text-muted text-xs bg-card-strong rounded-lg px-2.5 py-1">{{ expenses().length }} despesa{{ expenses().length !== 1 ? 's' : '' }}</span>
          </div>
        </div>

        <div class="rounded-2xl bg-card border border-theme p-4 shadow-lg shadow-black/10">
          <p class="text-xs text-secondary font-medium mb-3 flex items-center gap-1.5">
            <svg lucidePackage class="w-3.5 h-3.5"></svg>
            Por categoria
          </p>
          <div class="flex flex-col gap-2">
            @for (cat of categoryTotals(); track cat.value) {
              <div class="flex items-center justify-between">
                <span class="text-xs text-secondary flex items-center gap-1.5">
                  @switch (cat.value) {
                    @case ('aluguel') { <svg lucideHouse class="w-3.5 h-3.5"></svg> }
                    @case ('energia') { <svg lucideZap class="w-3.5 h-3.5"></svg> }
                    @case ('internet') { <svg lucideWifi class="w-3.5 h-3.5"></svg> }
                    @case ('agua') { <svg lucideDroplets class="w-3.5 h-3.5"></svg> }
                    @case ('compras') { <svg lucideShoppingCart class="w-3.5 h-3.5"></svg> }
                    @case ('limpeza') { <svg lucideSparkles class="w-3.5 h-3.5"></svg> }
                    @default { <svg lucidePackage class="w-3.5 h-3.5"></svg> }
                  }
                  {{ cat.label }}
                </span>
                <span class="text-xs text-primary font-semibold">R$ {{ fmt(cat.amount) }}</span>
              </div>
            }
          </div>
        </div>
      </div>

      <app-search placeholder="Pesquisar por descrição, categoria ou responsável..." (searchChange)="onSearch($event)" />

      <!-- List -->
      <div class="flex-1 flex flex-col gap-3 min-h-0">
        @for (e of paginatedExpenses(); track e.id) {
          <app-expense-card
            [expense]="e"
            [payments]="payments()"
            [currentUser]="CURRENT_USER()"
            [categories]="categories"
            (pay)="openPayModal($event)"
            (edit)="openEdit($event)"
            (delete)="confirmDelete($event)"
            (expandReceipt)="expandReceipt.set($event)">
          </app-expense-card>
        } @empty {
          <div class="rounded-2xl bg-card border border-theme p-10 text-center">
            <svg lucidePackage class="w-8 h-8 text-card-strong mx-auto mb-3"></svg>
            <p class="text-muted text-sm">Nenhuma despesa encontrada</p>
          </div>
        }
      </div>

      <app-paginator [currentPage]="currentPage()" [totalPages]="totalFilteredPages()" (pageChange)="goToPage($event)" />
    </div>

    <!-- Create / Edit modal -->
    @if (showModal()) {
      <app-expense-form
        [editingExpense]="editingExpense()"
        [categories]="categories"
        [members]="members()"
        [splitOptions]="splitOptions"
        [today]="today"
        (save)="onSaveExpense($event)"
        (cancel)="closeModal()">
      </app-expense-form>
    }

    <!-- Delete confirmation -->
    <app-delete-confirm [deleting]="deleting()" (confirm)="deleteExpense()" (cancel)="cancelDelete()" />

    <!-- Payment modal -->
    @if (payingExpense(); as exp) {
      <app-pay-modal
        [expense]="exp"
        [currentUser]="CURRENT_USER()"
        [payReceiptBase64]="payReceiptBase64()"
        (confirm)="confirmPay()"
        (cancel)="closePayModal()"
        (receiptSelected)="onReceiptSelected($event)">
      </app-pay-modal>
    }

    <!-- Pending approvals modal -->
    <app-pending-modal
      [expenses]="expenses()"
      [payments]="payments()"
      [currentUser]="CURRENT_USER()"
      [isAdmin]="isAdmin()"
      [showPending]="showPendingModal()"
      (approve)="approvePayment($event)"
      (reject)="rejectPayment($event)"
      (close)="showPendingModal.set(false)"
      (expandReceipt)="expandReceipt.set($event)">
    </app-pending-modal>

    <!-- Receipt expand -->
    @if (expandReceipt(); as url) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4" (click)="expandReceipt.set('')">
        <img [src]="url" class="max-w-full max-h-full object-contain rounded-2xl" (click)="$event.stopPropagation()" />
      </div>
    }

    <!-- Toast -->
    @if (toastMessage(); as msg) {
      <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-in-up pointer-events-none">
        {{ msg }}
      </div>
    }
  `,
})
export class FinancialPage {
  private route = inject(ActivatedRoute);
  protected store = inject(GroupStoreService);
  private expensesApi = inject(ExpensesApiService);
  private notif = inject(NotificationService);

  protected readonly members = computed(() => this.store.memberNames());
  protected readonly categories = this.store.categories;
  protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly splitOptions = [
    { value: 'equal', label: 'Todos' },
    { value: 'some', label: 'Alguns' },
    { value: 'custom', label: 'Personalizado' },
  ] as const;

  protected readonly CURRENT_USER = computed(() => this.store.currentUser());
  protected readonly isAdmin = computed(() => {
    const members = this.store.members();
    return members.some((m: any) => (m.nome ?? m.name) === this.CURRENT_USER() && m.admin);
  });

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected monthLabel(): string {
    if (this.filterPeriod() === 'month') {
      return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date());
    }
    return 'Todas as despesas';
  }

  protected expenses = signal<any[]>([]);
  protected payments = signal<any[]>([]);
  protected showModal = signal(false);
  protected editingExpense = signal<any | null>(null);
  protected deleting = signal<any | null>(null);
  protected payingExpense = signal<any | null>(null);
  protected showPendingModal = signal(false);
  protected payReceiptBase64 = signal('');
  protected expandReceipt = signal('');
  protected searchQuery = signal('');
  protected filterPeriod = signal<'all' | 'month'>('month');
  protected filterMyExpenses = signal(false);
  protected toastMessage = signal('');
  readonly pageSize = 3;
  readonly currentPage = signal(1);

  constructor() {
    const groupId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
    this.store.setGroupId(Number(groupId));
  }

  protected totalPendingCount = computed(() => {
    return this.expenses()
      .filter((e: any) => this.isAdmin() || e.paidBy === this.CURRENT_USER())
      .reduce((sum: number, e: any) => sum + this.payments().filter((p: any) => p.expenseId === e.id && p.status === 'awaiting').length, 0);
  });

  protected readonly filteredExpenses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let list = this.expenses();
    if (query) {
      list = list.filter((e: any) =>
        (e.description ?? '').toLowerCase().includes(query) ||
        this.categoryLabel(e.category).toLowerCase().includes(query) ||
        (e.paidBy ?? '').toLowerCase().includes(query)
      );
    }
    if (this.filterPeriod() === 'month') {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      list = list.filter((e: any) => (e.competenceDate ?? '').startsWith(`${year}-${month}`));
    }
    if (this.filterMyExpenses()) {
      list = list.filter((e: any) =>
        (e.splitValues ?? []).some((sv: any) => sv.name === this.CURRENT_USER()) ||
        e.paidBy === this.CURRENT_USER()
      );
    }
    return list;
  });

  protected readonly totalFilteredPages = computed(() =>
    Math.ceil(this.filteredExpenses().length / this.pageSize)
  );

  protected readonly paginatedExpenses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredExpenses().slice(start, start + this.pageSize);
  });

  protected readonly totalAmount = computed(() =>
    this.expenses().reduce((sum: number, e: any) => sum + (e.amount ?? 0), 0)
  );

  protected readonly categoryTotals = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.expenses()) {
      map.set(e.category, (map.get(e.category) ?? 0) + (e.amount ?? 0));
    }
    return this.categories
      .filter(c => (map.get(c.value) ?? 0) > 0)
      .map(c => ({ label: c.label, value: c.value, amount: map.get(c.value) ?? 0 }))
      .sort((a, b) => b.amount - a.amount);
  });

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }

  private addMonths(dateStr: string, months: number): string {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    d.setMonth(d.getMonth() + months);
    return d.toISOString().slice(0, 10);
  }

  private expandInstallments(expense: any, startId: number): any[] {
    const n = expense.installments;
    if (n <= 1) return [expense];

    const perPerson = expense.splitValues.map((sv: any) => {
      const raw = sv.value / n;
      const base = Math.floor(raw * 100) / 100;
      const remainder = Math.round((raw - base) * n * 100) / 100;
      return { name: sv.name, base, remainder };
    });

    const result: any[] = [];
    for (let i = 0; i < n; i++) {
      const splitValues = perPerson.map((p: any) => ({
        name: p.name,
        value: i === 0 ? +(p.base + p.remainder).toFixed(2) : p.base,
      }));
      const total = splitValues.reduce((s: number, v: any) => s + v.value, 0);
      const diff = Math.round((expense.amount / n - total) * 100) / 100;
      if (Math.abs(diff) > 0.001) {
        splitValues[splitValues.length - 1] = {
          ...splitValues[splitValues.length - 1],
          value: +(splitValues[splitValues.length - 1].value + diff).toFixed(2),
        };
      }

      result.push({
        ...expense,
        id: startId + i,
        amount: Math.round(expense.amount / n * 100) / 100,
        dueDate: this.addMonths(expense.firstDueDate || expense.dueDate, i),
        competenceDate: this.addMonths(expense.competenceDate, i),
        installments: 1,
        firstDueDate: '',
        installmentGroup: { id: expense.id, index: i + 1, total: n },
      });
    }
    const sum = result.reduce((s: number, e: any) => s + e.amount, 0);
    const diffTotal = Math.round((expense.amount - sum) * 100) / 100;
    if (Math.abs(diffTotal) > 0.001) {
      result[result.length - 1] = {
        ...result[result.length - 1],
        amount: +(result[result.length - 1].amount + diffTotal).toFixed(2),
      };
    }
    return result;
  }

  categoryLabel(value: string): string {
    return this.store.categories.find(c => c.value === value)?.label ?? value;
  }

  /* Payments */
  openPayModal(e: any): void {
    this.payingExpense.set(e);
    this.payReceiptBase64.set('');
  }

  closePayModal(): void {
    this.payingExpense.set(null);
    this.payReceiptBase64.set('');
  }

  onReceiptSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.payReceiptBase64.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  confirmPay(): void {
    const expense = this.payingExpense();
    if (!expense) return;
    this.payments.update((list: any[]) => {
      const idx = list.findIndex((p: any) => p.expenseId === expense.id && p.memberName === this.CURRENT_USER());
      const payment: any = {
        expenseId: expense.id,
        memberName: this.CURRENT_USER(),
        status: 'awaiting',
        paidAt: new Date().toISOString().slice(0, 10),
        receiptBase64: this.payReceiptBase64() || undefined,
      };
      if (idx >= 0) {
        const updated = [...list];
        updated[idx] = payment;
        return updated;
      }
      return [...list, payment];
    });
    this.showToast('Pagamento registrado. Aguardando aprovação.');
    this.closePayModal();
  }

  approvePayment(p: any): void {
    this.payments.update((list: any[]) =>
      list.map((p2: any) => p2.expenseId === p.expenseId && p2.memberName === p.memberName
        ? { ...p2, status: 'approved', approvedBy: this.CURRENT_USER() } : p2)
    );
  }

  rejectPayment(p: any): void {
    this.payments.update((list: any[]) =>
      list.filter((p2: any) => !(p2.expenseId === p.expenseId && p2.memberName === p.memberName))
    );
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalFilteredPages()) {
      this.currentPage.set(page);
    }
  }

  openCreate(): void {
    this.editingExpense.set(null);
    this.showModal.set(true);
  }

  openEdit(e: any): void {
    this.editingExpense.set(e);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingExpense.set(null);
  }

  onSaveExpense(event: { expense: any; isNew: boolean }): void {
    const { expense, isNew } = event;

    if (!isNew) {
      this.expenses.update((list: any[]) => list.map((e: any) => e.id === expense.id ? expense : e));
      this.showToast('Despesa atualizada com sucesso');
      this.showModal.set(false);
      return;
    }

    const toAdd: any[] = expense.installments > 1
      ? this.expandInstallments(expense, Date.now())
      : [expense];

    this.expenses.update((list: any[]) => [...list, ...toAdd]);

    if (expense.installments > 1) {
      for (const sv of expense.splitValues) {
        if (sv.name === expense.paidBy) continue;
        this.notif.add('expense', 'Nova despesa parcelada',
          `${expense.description} (${expense.installments}x) — sua parte total: R$ ${sv.value.toFixed(2).replace('.', ',')}`,
          sv.name, toAdd[0].id);
      }
    } else {
      for (const sv of expense.splitValues) {
        if (sv.name === expense.paidBy) continue;
        this.notif.add('expense', 'Nova despesa',
          `${expense.description} — sua parte: R$ ${sv.value.toFixed(2).replace('.', ',')}`,
          sv.name, toAdd[0].id);
      }
    }

    this.showToast('Despesa criada com sucesso');
    this.showModal.set(false);
  }

  confirmDelete(e: any): void {
    this.deleting.set(e);
  }

  cancelDelete(): void {
    this.deleting.set(null);
  }

  deleteExpense(): void {
    const target = this.deleting();
    if (!target) return;
    this.expenses.update((list: any[]) => list.filter((e: any) => e.id !== target.id));
    this.showToast('Despesa excluída com sucesso');
    this.deleting.set(null);
  }
}

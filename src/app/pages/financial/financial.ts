import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { BuscaComponent } from '../../components/busca/busca';
import { MockDataService, PaymentStatus, Payment, Expense } from '../../services/mock-data.service';
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
  selector: 'app-financeiro',
  imports: [FormsModule, ButtonComponent, PaginacaoComponent, BuscaComponent,
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
            [currentUser]="CURRENT_USER"
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
        [members]="members"
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
        [currentUser]="CURRENT_USER"
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
      [currentUser]="CURRENT_USER"
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
export class FinanceiroPage {
  protected mockData = inject(MockDataService);
  protected readonly members = this.mockData.MEMBROS;
  protected readonly categories = this.mockData.CATEGORIES;
  protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly splitOptions = [
    { value: 'equal', label: 'Todos' },
    { value: 'some', label: 'Alguns' },
    { value: 'custom', label: 'Personalizado' },
  ] as const;

  protected readonly CURRENT_USER = this.mockData.CURRENT_USER;
  protected readonly isAdmin = computed(() =>
    this.mockData.membros().find(m => m.nome === this.CURRENT_USER)?.admin ?? false
  );

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected monthLabel(): string {
    if (this.filterPeriod() === 'month') {
      return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date());
    }
    return 'Todas as despesas';
  }

  protected expenses = signal<Expense[]>([]);
  protected payments = signal<Payment[]>([]);
  protected showModal = signal(false);
  protected editingExpense = signal<Expense | null>(null);
  protected deleting = signal<Expense | null>(null);
  protected payingExpense = signal<Expense | null>(null);
  protected showPendingModal = signal(false);
  protected payReceiptBase64 = signal('');
  protected expandReceipt = signal('');
  protected searchQuery = signal('');
  protected filterPeriod = signal<'all' | 'month'>('month');
  protected filterMyExpenses = signal(false);
  protected toastMessage = signal('');
  readonly pageSize = 3;
  readonly currentPage = signal(1);

  protected totalPendingCount = computed(() => {
    return this.expenses()
      .filter(e => this.isAdmin || e.paidBy === this.CURRENT_USER)
      .reduce((sum, e) => sum + this.payments().filter(p => p.expenseId === e.id && p.status === 'awaiting').length, 0);
  });

  protected readonly filteredExpenses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let list = this.expenses();
    if (query) {
      list = list.filter(e =>
        e.description.toLowerCase().includes(query) ||
        this.categoryLabel(e.category).toLowerCase().includes(query) ||
        e.paidBy.toLowerCase().includes(query)
      );
    }
    if (this.filterPeriod() === 'month') {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      list = list.filter(e => e.competenceDate.startsWith(`${year}-${month}`));
    }
    if (this.filterMyExpenses()) {
      list = list.filter(e => e.splitValues.some(sv => sv.name === this.CURRENT_USER) || e.paidBy === this.CURRENT_USER);
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

  protected readonly totalAmount = computed(() => this.expenses().reduce((sum, e) => sum + e.amount, 0));

  protected readonly categoryTotals = computed(() => {
    const map = new Map<string, number>();
    for (const e of this.expenses()) {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
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

  constructor() {
    const current = this.mockData.expenses();
    const historical = this.mockData.historicalExpenses;
    const usedIds = new Set(current.map(e => e.id));
    let nextId = Math.max(...usedIds, 0) + 1;
    const idMap = new Map<number, number>();

    const merged: Expense[] = [...current];
    for (const h of historical) {
      if (usedIds.has(h.id)) {
        const newId = nextId++;
        idMap.set(h.id, newId);
        merged.push({ ...h, id: newId });
      } else {
        merged.push({ ...h });
      }
    }
    this.expenses.set(merged);

    this.payments.set(
      this.mockData.payments().map(p => ({
        ...p,
        expenseId: idMap.get(p.expenseId) ?? p.expenseId,
      }))
    );

    this.checkDebts();
  }

  private notif = inject(NotificationService);

  private checkDebts(): void {
    const today = new Date();
    for (const expense of this.expenses()) {
      if (!expense.dueDate) continue;
      const dueDate = new Date(expense.dueDate + 'T23:59:59');
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysOverdue < NOTIFICATION_CONFIG.debtReminderDays) continue;
      for (const sv of expense.splitValues) {
        if (sv.name === expense.paidBy) continue;
        const payment = this.payments().find(p => p.expenseId === expense.id && p.memberName === sv.name);
        if (payment && payment.status !== 'pending') continue;
        if (!this.notif.canSendReminder(expense.id, sv.name)) continue;
        this.notif.add('debt_reminder', 'Lembrete de dívida',
          `${expense.description} — venceu há ${daysOverdue} dia(s). Sua parte: R$ ${sv.value.toFixed(2).replace('.', ',')}`,
          sv.name, expense.id);
        this.notif.registerReminder(expense.id, sv.name);
      }
    }
  }

  categoryLabel(value: string): string {
    return this.mockData.CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  /* Payments */
  openPayModal(e: Expense): void {
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
    this.payments.update(list => {
      const idx = list.findIndex(p => p.expenseId === expense.id && p.memberName === this.CURRENT_USER);
      const payment: Payment = {
        expenseId: expense.id,
        memberName: this.CURRENT_USER,
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

  approvePayment(p: Payment): void {
    this.payments.update(list =>
      list.map(p2 => p2.expenseId === p.expenseId && p2.memberName === p.memberName
        ? { ...p2, status: 'approved' as PaymentStatus, approvedBy: this.CURRENT_USER } : p2)
    );
  }

  rejectPayment(p: Payment): void {
    this.payments.update(list =>
      list.filter(p2 => !(p2.expenseId === p.expenseId && p2.memberName === p.memberName))
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

  openEdit(e: Expense): void {
    this.editingExpense.set(e);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingExpense.set(null);
  }

  onSaveExpense(event: { expense: Expense; isNew: boolean }): void {
    const { expense, isNew } = event;
    this.expenses.update(list => {
      if (!isNew) {
        return list.map(e => e.id === expense.id ? expense : e);
      }
      return [...list, expense];
    });

    if (isNew) {
      for (const sv of expense.splitValues) {
        if (sv.name === expense.paidBy) continue;
        this.notif.add('expense', 'Nova despesa',
          `${expense.description} — sua parte: R$ ${sv.value.toFixed(2).replace('.', ',')}`,
          sv.name, expense.id);
      }
    }

    this.showToast(isNew ? 'Despesa criada com sucesso' : 'Despesa atualizada com sucesso');
    this.showModal.set(false);
  }

  confirmDelete(e: Expense): void {
    this.deleting.set(e);
  }

  cancelDelete(): void {
    this.deleting.set(null);
  }

  deleteExpense(): void {
    const target = this.deleting();
    if (!target) return;
    this.expenses.update(list => list.filter(e => e.id !== target.id));
    this.showToast('Despesa excluída com sucesso');
    this.deleting.set(null);
  }
}

import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button';

interface SplitValue {
  name: string;
  value: number;
}

type SplitMode = 'equal' | 'some' | 'custom';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  competenceDate: string;
  dueDate: string;
  paidBy: string;
  splitMode: SplitMode;
  splitValues: SplitValue[];
  fixed: boolean;
}

const MOCK_MEMBERS = ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'];

const CATEGORIES = [
  { value: 'aluguel', label: 'Aluguel', icon: '🔑' },
  { value: 'energia', label: 'Energia', icon: '⚡' },
  { value: 'internet', label: 'Internet', icon: '🌐' },
  { value: 'agua', label: 'Água', icon: '💧' },
  { value: 'compras', label: 'Compras', icon: '🛒' },
  { value: 'limpeza', label: 'Limpeza', icon: '🧹' },
  { value: 'outros', label: 'Outros', icon: '📦' },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 1, description: 'Conta de luz', amount: 320, category: 'energia', competenceDate: '2026-05-01', dueDate: '2026-06-10', paidBy: 'Ana', splitMode: 'equal', splitValues: ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'].map(n => ({ name: n, value: 64 })), fixed: false },
  { id: 2, description: 'Água', amount: 150, category: 'agua', competenceDate: '2026-05-01', dueDate: '2026-06-15', paidBy: 'Carlos', splitMode: 'some', splitValues: ['Ana', 'Carlos', 'Pedro'].map(n => ({ name: n, value: 50 })), fixed: false },
  { id: 3, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2026-05-01', dueDate: '2026-06-05', paidBy: 'Mariana', splitMode: 'some', splitValues: ['Mariana', 'João'].map(n => ({ name: n, value: 100 })), fixed: true },
  { id: 4, description: 'Mercado do mês', amount: 580, category: 'compras', competenceDate: '2026-05-20', dueDate: '2026-06-01', paidBy: 'Pedro', splitMode: 'equal', splitValues: ['Ana', 'Carlos', 'Pedro', 'Mariana', 'João'].map(n => ({ name: n, value: 116 })), fixed: false },
  { id: 5, description: 'Material de limpeza', amount: 95, category: 'limpeza', competenceDate: '2026-05-18', dueDate: '2026-06-20', paidBy: 'Ana', splitMode: 'some', splitValues: ['Ana', 'Pedro'].map(n => ({ name: n, value: 47.5 })), fixed: false },
];

@Component({
  selector: 'app-financeiro',
  imports: [FormsModule, ButtonComponent, DatePipe],
  template: `
    <div class="flex flex-col gap-8">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Financeiro</h1>
          <p class="text-white/40 text-sm mt-1">Gerencie as despesas do grupo</p>
          <div class="h-1 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mt-3"></div>
        </div>
        <app-button type="button" variant="solid" label="+ Nova Despesa" (click)="openCreate()"></app-button>
      </div>

      <!-- Total -->
      <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-lg shadow-black/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-lg">💰</div>
            <div>
              <p class="text-white/50 text-sm font-medium">Total do mês</p>
              <p class="text-2xl font-bold text-white tracking-tight">R$ {{ totalAmount().toFixed(2) }}</p>
            </div>
          </div>
          <span class="text-white/30 text-xs border border-white/10 rounded-lg px-2.5 py-1">{{ expenses().length }} despesas</span>
        </div>
      </div>

      <!-- List -->
      <div class="flex flex-col gap-4">
        @for (e of expenses(); track e.id) {
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-5 shadow-lg shadow-black/10 hover:bg-white/[0.12] transition">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-lg shrink-0">{{ categoryIcon(e.category) }}</div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-white font-semibold truncate">{{ e.description }}</p>
                    @if (e.fixed) {
                      <span class="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">📌 Fixa</span>
                    }
                  </div>
                  <p class="text-white/40 text-xs mt-0.5">{{ categoryLabel(e.category) }} · {{ e.competenceDate | date:'MMM/yyyy' }} · Pago por {{ e.paidBy }}</p>
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span class="text-[11px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{{ splitModeLabel(e.splitMode) }}</span>
                    @for (sv of e.splitValues; track sv.name) {
                      <span class="text-[11px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{{ sv.name }} R$ {{ sv.value.toFixed(2) }}</span>
                    }
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="text-white font-bold text-lg">R$ {{ e.amount.toFixed(2) }}</span>
                <div class="flex flex-col gap-1">
                  <button (click)="openEdit(e)" class="text-white/40 hover:text-white transition cursor-pointer text-sm">✏️</button>
                  <button (click)="confirmDelete(e)" class="text-white/40 hover:text-rose-400 transition cursor-pointer text-sm">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-10 text-center">
            <p class="text-white/40">Nenhuma despesa cadastrada</p>
          </div>
        }
      </div>
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeModal()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-lg">
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-white font-bold text-lg">{{ editingId() ? 'Editar despesa' : 'Nova despesa' }}</h2>
              <button (click)="closeModal()" class="text-white/40 hover:text-white transition cursor-pointer text-xl leading-none">&times;</button>
            </div>

            <div class="flex flex-col gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                Descrição
                <input type="text" placeholder="Ex: Conta de luz" [(ngModel)]="form.description"
                  class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full" />
              </label>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Valor total
                  <input type="number" step="0.01" min="0" placeholder="0,00" [(ngModel)]="form.amount" (keydown)="preventNegative($event)"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                  @if (submitted() && form.amount <= 0) {
                    <span class="text-rose-400 text-xs mt-1">O valor deve ser maior que 0</span>
                  }
                </label>
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Categoria
                  <select [(ngModel)]="form.category"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full appearance-none cursor-pointer">
                    @for (c of categories; track c.value) {
                      <option [value]="c.value" class="bg-purple-dark text-white">{{ c.icon }} {{ c.label }}</option>
                    }
                  </select>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Data de competência
                  <input type="date" [(ngModel)]="form.competenceDate"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full [color-scheme:dark]" />
                  @if (submitted() && !form.competenceDate) {
                    <span class="text-rose-400 text-xs mt-1">A data de competência é obrigatória</span>
                  }
                </label>
                <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  Data de vencimento
                  <input type="date" [min]="today" [(ngModel)]="form.dueDate"
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full [color-scheme:dark]" />
                  @if (submitted() && form.dueDate && form.dueDate < today) {
                    <span class="text-rose-400 text-xs mt-1">A data de vencimento deve ser a partir de hoje</span>
                  }
                </label>
              </div>

              <label class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                Pago por
                <select [(ngModel)]="form.paidBy"
                  class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white outline-none focus:border-white/50 transition w-full appearance-none cursor-pointer">
                  <option value="" disabled class="bg-purple-dark text-white/40">Selecione...</option>
                  @for (m of members; track m) {
                    <option [value]="m" class="bg-purple-dark text-white">{{ m }}</option>
                  }
                </select>
                @if (submitted() && !form.paidBy) {
                  <span class="text-rose-400 text-xs mt-1">Selecione quem pagou</span>
                }
              </label>

              <label class="flex items-center justify-between text-sm font-medium text-white/70 py-2">
                <span>Despesa fixa</span>
                <button type="button" (click)="form.fixed = !form.fixed"
                  class="relative w-11 h-6 rounded-full transition cursor-pointer"
                  [class.bg-purple-500]="form.fixed"
                  [class.bg-white/20]="!form.fixed">
                  <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition shadow"
                    [class.translate-x-5]="form.fixed"></span>
                </button>
              </label>

              <!-- Split mode -->
              <div class="flex flex-col gap-2.5 text-sm font-medium text-white/70">
                <span>Modo de rateio</span>
                <div class="flex bg-white/10 rounded-xl p-1 gap-1">
                  @for (opt of splitOptions; track opt.value) {
                    <button type="button" (click)="setSplitMode(opt.value)"
                      class="flex-1 text-xs py-2 rounded-lg transition font-medium cursor-pointer"
                      [class.bg-white/65]="form.splitMode === opt.value"
                      [class.text-purple-dark]="form.splitMode === opt.value"
                      [class.text-white/60]="form.splitMode !== opt.value">
                      {{ opt.label }}
                    </button>
                  }
                </div>
              </div>

              @if (form.splitMode === 'equal') {
                <div class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  <span>Todos os membros dividem igualmente</span>
                  <div class="grid grid-cols-2 gap-2 mt-1">
                    @for (sv of computedSplitValues(); track sv.name) {
                      <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
                        <span class="text-white text-sm">{{ sv.name }}</span>
                        <span class="text-white/80 text-sm font-medium">R$ {{ sv.value.toFixed(2) }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              @if (form.splitMode === 'some') {
                <div class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  <span>Selecione os participantes (mínimo 2)</span>
                  @if (submitted() && selectedSomeCount() < 2) {
                    <span class="text-rose-400 text-xs">Selecione ao menos 2 moradores</span>
                  }
                  <div class="grid grid-cols-2 gap-2 mt-1">
                    @for (m of members; track m) {
                      <label class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition cursor-pointer text-sm">
                        <div class="w-4 h-4 rounded border-2 flex items-center justify-center transition shrink-0"
                          [class.border-purple-400]="isSomeSelected(m)"
                          [class.border-white/30]="!isSomeSelected(m)">
                          @if (isSomeSelected(m)) {
                            <span class="text-purple-400 text-[10px]">✓</span>
                          }
                        </div>
                        <input type="checkbox" [checked]="isSomeSelected(m)" (change)="toggleSome(m)" class="hidden" />
                        <span class="text-white flex-1">{{ m }}</span>
                        <span class="text-white/50 text-xs">R$ {{ someValue(m).toFixed(2) }}</span>
                      </label>
                    }
                  </div>
                </div>
              }

              @if (form.splitMode === 'custom') {
                <div class="flex flex-col gap-1.5 text-sm font-medium text-white/70">
                  <span>Valores por morador</span>
                  @if (submitted() && customTotal() !== form.amount) {
                    <span class="text-rose-400 text-xs">
                      A soma (R$ {{ customTotal().toFixed(2) }}) deve ser igual ao valor total (R$ {{ form.amount.toFixed(2) }})
                    </span>
                  }
                  <div class="grid grid-cols-2 gap-2 mt-1">
                    @for (m of members; track m) {
                      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                        <span class="text-white text-sm w-16 shrink-0">{{ m }}</span>
                        <input type="number" step="0.01" min="0" placeholder="0,00" [(ngModel)]="form.splitCustom[m]"
                          (input)="recalcCustom()"
                          class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1.5 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="closeModal()"></app-button>
              <app-button type="button" variant="solid" label="{{ editingId() ? 'Salvar' : 'Criar' }}" (click)="save()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Delete confirmation -->
    @if (deleting()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancelDelete()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
            <h2 class="text-white font-bold text-lg mb-2">Excluir despesa?</h2>
            <p class="text-white/60 text-sm">Tem certeza que deseja excluir "{{ deleting()?.description }}"?</p>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="cancelDelete()"></app-button>
              <app-button type="button" variant="solid" label="Excluir" (click)="deleteExpense()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class FinanceiroPage {
  protected readonly members = MOCK_MEMBERS;
  protected readonly categories = CATEGORIES;
  protected readonly today = new Date().toISOString().slice(0, 10);
  protected readonly splitOptions = [
    { value: 'equal', label: 'Todos' },
    { value: 'some', label: 'Alguns' },
    { value: 'custom', label: 'Personalizado' },
  ] as const;

  protected expenses = signal<Expense[]>([...MOCK_EXPENSES]);
  protected showModal = signal(false);
  protected editingId = signal<number | null>(null);
  protected deleting = signal<Expense | null>(null);
  protected submitted = signal(false);

  protected form!: ReturnType<typeof this.emptyForm>;

  protected totalAmount = () => this.expenses().reduce((sum, e) => sum + e.amount, 0);

  private emptyForm() {
    return {
      description: '',
      amount: 0,
      category: 'outros',
      competenceDate: '',
      dueDate: '',
      paidBy: '',
      splitMode: 'equal' as SplitMode,
      fixed: false,
      splitCustom: Object.fromEntries(MOCK_MEMBERS.map(m => [m, 0])) as Record<string, number>,
    };
  }

  constructor() {
    this.form = this.emptyForm();
  }

  splitModeLabel(mode: SplitMode): string {
    return this.splitOptions.find(o => o.value === mode)?.label ?? '';
  }

  categoryLabel(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.label ?? value;
  }

  categoryIcon(value: string): string {
    return CATEGORIES.find(c => c.value === value)?.icon ?? '📦';
  }

  /* Mode A: equal split computed */
  protected computedSplitValues = () => {
    const total = this.form.amount;
    const count = this.members.length;
    if (total <= 0 || count === 0) return [];
    const base = Math.floor((total * 100) / count) / 100;
    const remainder = Math.round((total - base * count) * 100) / 100;
    return this.members.map((name, i) => ({
      name,
      value: i === 0 ? +(base + remainder).toFixed(2) : base,
    }));
  };

  /* Mode B: some members */
  protected selectedSome = signal<string[]>([]);

  isSomeSelected(name: string): boolean {
    return this.selectedSome().includes(name);
  }

  toggleSome(name: string): void {
    this.selectedSome.update(list => {
      if (list.includes(name) && list.length <= 2) return list;
      if (list.includes(name)) return list.filter(n => n !== name);
      return [...list, name];
    });
  }

  get selectedSomeCount() {
    return () => this.selectedSome().length;
  }

  someValue(name: string): number {
    const selected = this.selectedSome();
    if (!selected.includes(name)) return 0;
    const count = selected.length;
    if (count === 0) return 0;
    const base = Math.floor((this.form.amount * 100) / count) / 100;
    const remainder = Math.round((this.form.amount - base * count) * 100) / 100;
    return name === selected[0] ? +(base + remainder).toFixed(2) : base;
  }

  /* Mode C: custom values */
  protected customTotal = () => {
    const vals = Object.values(this.form.splitCustom);
    return vals.reduce((sum, v) => sum + (Number(v) || 0), 0);
  };

  recalcCustom(): void {
    // force change detection — ngModel handles the binding
  }

  setSplitMode(mode: SplitMode): void {
    this.form.splitMode = mode;
    if (mode === 'some' && this.selectedSome().length === 0) {
      this.selectedSome.set([...this.members]);
    }
  }

  openCreate(): void {
    this.editingId.set(null);
    this.submitted.set(false);
    this.selectedSome.set([...this.members]);
    this.form = { ...this.emptyForm() };
    this.showModal.set(true);
  }

  openEdit(e: Expense): void {
    this.editingId.set(e.id);
    this.submitted.set(false);
    this.selectedSome.set(e.splitValues.map(sv => sv.name));
    this.form = {
      description: e.description,
      amount: e.amount,
      category: e.category,
      competenceDate: e.competenceDate,
      dueDate: e.dueDate,
      paidBy: e.paidBy,
      splitMode: e.splitMode,
      fixed: e.fixed,
      splitCustom: Object.fromEntries(this.members.map(m => {
        const sv = e.splitValues.find(v => v.name === m);
        return [m, sv ? sv.value : 0];
      })) as Record<string, number>,
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingId.set(null);
    this.submitted.set(false);
  }

  preventNegative(e: KeyboardEvent): void {
    if (e.key === '-' || e.key === 'e') e.preventDefault();
  }

  save(): void {
    this.submitted.set(true);

    if (!this.form.description.trim() || this.form.amount <= 0 || !this.form.competenceDate || !this.form.paidBy || (this.form.dueDate && this.form.dueDate < this.today)) return;

    let splitValues: SplitValue[] = [];

    if (this.form.splitMode === 'equal') {
      splitValues = this.computedSplitValues();
    } else if (this.form.splitMode === 'some') {
      const selected = this.selectedSome();
      if (selected.length < 2) return;
      const count = selected.length;
      const base = Math.floor((this.form.amount * 100) / count) / 100;
      const remainder = Math.round((this.form.amount - base * count) * 100) / 100;
      splitValues = selected.map((name, i) => ({
        name,
        value: i === 0 ? +(base + remainder).toFixed(2) : base,
      }));
    } else if (this.form.splitMode === 'custom') {
      splitValues = this.members
        .filter(m => (Number(this.form.splitCustom[m]) || 0) > 0)
        .map(m => ({ name: m, value: Number(this.form.splitCustom[m]) || 0 }));
      const totalCustom = splitValues.reduce((s, v) => s + v.value, 0);
      if (Math.abs(totalCustom - this.form.amount) > 0.01) return;
    }

    if (splitValues.length < 2) return;

    // RN-06.D: auto-fix rounding diffs, atribuir ao responsável
    const sumSplit = splitValues.reduce((s, v) => s + v.value, 0);
    const diff = Math.round((this.form.amount - sumSplit) * 100) / 100;
    if (Math.abs(diff) > 0.001) {
      const payerIdx = splitValues.findIndex(v => v.name === this.form.paidBy);
      if (payerIdx >= 0) {
        splitValues[payerIdx] = {
          ...splitValues[payerIdx],
          value: +(splitValues[payerIdx].value + diff).toFixed(2),
        };
      }
    }

    const expense: Expense = {
      id: this.editingId() ?? Date.now(),
      description: this.form.description.trim(),
      amount: this.form.amount,
      category: this.form.category,
      competenceDate: this.form.competenceDate,
      dueDate: this.form.dueDate,
      paidBy: this.form.paidBy,
      splitMode: this.form.splitMode,
      splitValues,
      fixed: false,
    };
    this.expenses.update(list => {
      if (this.editingId()) {
        return list.map(e => e.id === expense.id ? expense : e);
      }
      return [...list, expense];
    });
    this.closeModal();
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
    this.deleting.set(null);
  }
}

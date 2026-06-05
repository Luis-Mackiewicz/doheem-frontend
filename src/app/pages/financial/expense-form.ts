import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button';
import {
  LucideX,
  LucideCheck,
} from '@lucide/angular';
import { Expense, SplitValue, SplitMode } from '../../services/mock-data.service';

@Component({
  selector: 'app-expense-form',
  imports: [FormsModule, ButtonComponent, LucideX, LucideCheck],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="cancel.emit()">
      <div (click)="$event.stopPropagation()" class="w-full max-w-lg max-h-[90vh] flex flex-col">
        <div class="rounded-2xl bg-card border border-theme shadow-2xl flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 pt-6 pb-0 shrink-0">
            <h2 class="text-primary font-bold text-lg">{{ editingExpense ? 'Editar despesa' : 'Nova despesa' }}</h2>
            <button (click)="cancel.emit()" aria-label="Fechar" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
          </div>

          <div class="flex flex-col gap-4 overflow-y-auto p-6">
            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Descrição
              <input type="text" placeholder="Ex: Conta de luz" [(ngModel)]="form.description"
                class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full" />
              @if (submitted() && !form.description.trim()) {
                <span class="text-rose-400 text-xs mt-1">A descrição é obrigatória</span>
              }
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Valor total
                <input type="number" step="0.01" min="0" placeholder="0,00" [(ngModel)]="form.amount" (keydown)="preventNegative($event)"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                @if (submitted() && form.amount <= 0) {
                  <span class="text-rose-400 text-xs mt-1">O valor deve ser maior que 0</span>
                }
              </label>
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Categoria
                <select [(ngModel)]="form.category"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full appearance-none cursor-pointer">
                  @for (c of categories; track c.value) {
                    <option [value]="c.value" class="bg-page text-primary">{{ c.label }}</option>
                  }
                </select>
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Data de competência
                <input type="date" [(ngModel)]="form.competenceDate"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full scheme-dark" />
                @if (submitted() && !form.competenceDate) {
                  <span class="text-rose-400 text-xs mt-1">A data de competência é obrigatória</span>
                }
              </label>
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Data de vencimento
                <input type="date" [min]="today" [(ngModel)]="form.dueDate"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full scheme-dark" />
                @if (submitted() && form.dueDate && form.dueDate < today) {
                  <span class="text-rose-400 text-xs mt-1">A data de vencimento deve ser a partir de hoje</span>
                }
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Parcelas
                <input type="number" min="1" step="1" [(ngModel)]="form.installments" (input)="onInstallmentsChange()"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                @if (form.installments < 1) {
                  <span class="text-rose-400 text-xs mt-1">O número de parcelas deve ser no mínimo 1</span>
                }
              </label>
              @if (form.installments > 1) {
                <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                  1ª data de vencimento
                  <input type="date" [min]="today" [(ngModel)]="form.firstDueDate"
                    class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full scheme-dark" />
                </label>
              }
            </div>
            @if (form.installments > 1 && form.amount > 0) {
              <p class="text-secondary text-xs">Serão geradas {{ form.installments }} parcelas de R$ {{ fmt(form.amount / form.installments) }}</p>
            }

            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Pago por
              <select [(ngModel)]="form.paidBy"
                class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full appearance-none cursor-pointer">
                 <option value="" disabled class="bg-page text-muted">Selecione...</option>
                 @for (m of members; track m) {
                   <option [value]="m" class="bg-page text-primary">{{ m }}</option>
                }
              </select>
              @if (submitted() && !form.paidBy) {
                <span class="text-rose-400 text-xs mt-1">Selecione quem pagou</span>
              }
            </label>

            <label class="flex items-center justify-between text-sm font-medium text-secondary py-2">
              <span id="fixed-label">Despesa fixa</span>
              <button type="button" role="switch" [attr.aria-checked]="form.fixed" [attr.aria-labelledby]="'fixed-label'"
                (click)="form.fixed = !form.fixed"
                class="relative w-11 h-6 rounded-full transition cursor-pointer"
                [class.bg-purple-500]="form.fixed"
                [class.bg-white/20]="!form.fixed">
                <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition shadow"
                  [class.translate-x-5]="form.fixed"></span>
              </button>
            </label>

            <div class="flex flex-col gap-2.5 text-sm font-medium text-secondary">
              <span>Modo de rateio</span>
              <div class="flex bg-card-strong rounded-xl p-1 gap-1">
                @for (opt of splitOptions; track opt.value) {
                  <button type="button" (click)="setSplitMode(opt.value)"
                    class="flex-1 text-xs py-2 rounded-lg transition font-medium cursor-pointer"
                    [class.bg-white/65]="form.splitMode === opt.value"
                    [class.text-purple-dark]="form.splitMode === opt.value"
                    [class.text-secondary]="form.splitMode !== opt.value">
                    {{ opt.label }}
                  </button>
                }
              </div>
            </div>

            @if (form.splitMode === 'equal') {
              <div class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                <span>Todos os membros dividem igualmente</span>
                <div class="grid grid-cols-2 gap-2 mt-1">
                  @for (sv of computedSplitValues(); track sv.name) {
                    <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-card-strong">
                      <span class="text-primary text-sm">{{ sv.name }}</span>
                      <span class="text-secondary text-sm font-medium">@if (form.installments > 1) { {{ form.installments }}x } R$ {{ fmt(sv.value / (form.installments || 1)) }}</span>
                    </div>
                  }
                </div>
              </div>
            }

            @if (form.splitMode === 'some') {
              <div class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                <span>Selecione os participantes (mínimo 2)  — {{ selectedSome().length }} selecionados</span>
                @if (submitted() && selectedSomeCount() < 2) {
                  <span class="text-rose-400 text-xs">Selecione ao menos 2 moradores</span>
                }
                <div class="grid grid-cols-2 gap-2 mt-1">
                  @for (m of members; track m) {
                    <label class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-card-strong hover-bg transition cursor-pointer text-sm">
                      <div class="w-4 h-4 rounded border-2 flex items-center justify-center transition shrink-0"
                        [class.border-purple-400]="isSomeSelected(m)"
                        [class.border-soft]="!isSomeSelected(m)">
                        @if (isSomeSelected(m)) {
                          <svg lucideCheck class="w-3 h-3 text-purple-400"></svg>
                        }
                      </div>
                      <input type="checkbox" [checked]="isSomeSelected(m)" (change)="toggleSome(m)" class="hidden" />
                      <span class="text-primary flex-1">{{ m }}</span>
                      <span class="text-secondary text-xs">@if (form.installments > 1) { {{ form.installments }}x } R$ {{ fmt(someValue(m) / (form.installments || 1)) }}</span>
                    </label>
                  }
                </div>
              </div>
            }

            @if (form.splitMode === 'custom') {
              <div class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                <span>Valores por morador  — {{ members.length }} participantes</span>

                <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-card-strong text-sm mt-1">
                  <span class="text-secondary">Total distribuído</span>
                  <span class="text-primary font-semibold">R$ {{ fmt(customTotal()) }}</span>
                </div>
                <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-card-strong text-sm"
                  [class.text-emerald-400]="customTotal() === form.amount"
                  [class.text-rose-400]="customTotal() !== form.amount">
                  <span>Faltam</span>
                  <span class="font-semibold">R$ {{ fmt(form.amount > customTotal() ? form.amount - customTotal() : 0) }}</span>
                </div>

                @if (submitted() && customTotal() !== form.amount) {
                  <span class="text-rose-400 text-xs">
                    A soma (R$ {{ fmt(customTotal()) }}) deve ser igual ao valor total (R$ {{ fmt(form.amount) }})
                  </span>
                }
                <div class="grid grid-cols-2 gap-2 mt-1">
                  @for (m of members; track m) {
                    <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-card-strong">
                      <span class="text-primary text-sm w-16 shrink-0">{{ m }}</span>
                      <input type="number" step="0.01" min="0" placeholder="0,00" [(ngModel)]="form.splitCustom[m]"
                        (input)="recalcCustom()"
                        class="bg-input border border-theme rounded-lg px-2 py-1.5 text-primary outline-none focus:border-purple-400/60 transition w-full text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="flex gap-3 px-6 pb-6 pt-4 shrink-0 border-t border-theme justify-end">
            <app-button type="button" variant="outline" label="Cancelar" (click)="cancel.emit()"></app-button>
            <app-button type="button" variant="solid" label="{{ editingExpense ? 'Salvar' : 'Criar' }}" (click)="handleSave()"></app-button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ExpenseFormComponent implements OnInit {
  @Input() editingExpense: Expense | null = null;
  @Input() categories: { value: string; label: string }[] = [];
  @Input() members: string[] = [];
  @Input() splitOptions: readonly { value: string; label: string }[] = [];
  @Input() today = '';

  @Output() save = new EventEmitter<{ expense: Expense; isNew: boolean }>();
  @Output() cancel = new EventEmitter<void>();

  protected submitted = signal(false);
  protected selectedSome = signal<string[]>([]);
  protected form!: ReturnType<typeof this.emptyForm>;

  ngOnInit(): void {
    if (this.editingExpense) {
      this.selectedSome.set(this.editingExpense.splitValues.map(sv => sv.name));
      this.form = {
        description: this.editingExpense.description,
        amount: this.editingExpense.amount,
        category: this.editingExpense.category,
        competenceDate: this.editingExpense.competenceDate,
        dueDate: this.editingExpense.dueDate,
        paidBy: this.editingExpense.paidBy,
        splitMode: this.editingExpense.splitMode,
        fixed: this.editingExpense.fixed,
        installments: this.editingExpense.installments,
        firstDueDate: this.editingExpense.firstDueDate,
        splitCustom: Object.fromEntries(this.members.map(m => {
          const sv = this.editingExpense!.splitValues.find(v => v.name === m);
          return [m, sv ? sv.value : 0];
        })) as Record<string, number>,
      };
    } else {
      this.selectedSome.set([...this.members]);
      this.form = {
        ...this.emptyForm(),
        competenceDate: this.today,
        paidBy: this.members[0] ?? '',
      };
    }
  }

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

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
      installments: 1,
      firstDueDate: '',
      splitCustom: Object.fromEntries(this.members.map(m => [m, 0])) as Record<string, number>,
    };
  }

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

  protected customTotal = () => {
    const vals = Object.values(this.form.splitCustom);
    return vals.reduce((sum, v) => sum + (Number(v) || 0), 0);
  };

  recalcCustom(): void {
    // force change detection
  }

  onInstallmentsChange(): void {
    if (this.form.installments < 1) this.form.installments = 1;
    this.form.installments = Math.round(this.form.installments);
    if (this.form.installments <= 1) this.form.firstDueDate = '';
  }

  setSplitMode(mode: string): void {
    this.form.splitMode = mode as SplitMode;
    if (mode === 'some' && this.selectedSome().length === 0) {
      this.selectedSome.set([...this.members]);
    }
  }

  preventNegative(e: KeyboardEvent): void {
    if (e.key === '-' || e.key === 'e') e.preventDefault();
  }

  handleSave(): void {
    this.submitted.set(true);

    if (!this.form.description.trim() || this.form.amount <= 0 || !this.form.competenceDate || !this.form.paidBy || this.form.installments < 1 || (this.form.dueDate && this.form.dueDate < this.today)) return;

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

    const isNew = !this.editingExpense;
    const expense: Expense = {
      id: this.editingExpense?.id ?? Date.now(),
      description: this.form.description.trim(),
      amount: this.form.amount,
      category: this.form.category,
      competenceDate: this.form.competenceDate,
      dueDate: this.form.dueDate,
      paidBy: this.form.paidBy,
      splitMode: this.form.splitMode,
      splitValues,
      installments: this.form.installments,
      firstDueDate: this.form.installments > 1 ? this.form.firstDueDate : '',
      fixed: this.form.fixed,
    };

    this.save.emit({ expense, isNew });
  }
}

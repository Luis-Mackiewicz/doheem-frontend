import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/button/button';
import { PaginacaoComponent } from '../../components/paginator/paginator';
import { BuscaComponent } from '../../components/busca/busca';
import { MockDataService, SplitValue, SplitMode, PaymentStatus, Payment, Expense } from '../../services/mock-data.service';
import { NotificationService, NOTIFICATION_CONFIG } from '../../services/notification-service';
import {
  LucideDollarSign,
  LucidePin,
  LucideBell,
  LucideCheck,
  LucideX,
  LucidePen,
  LucideTrash2,
  LucideHouse,
  LucideZap,
  LucideWifi,
  LucideDroplets,
  LucideShoppingCart,
  LucideSparkles,
  LucidePackage,
  LucideClock,
  LucideCircleCheck,
} from '@lucide/angular';

@Component({
  selector: 'app-financeiro',
  imports: [FormsModule, ButtonComponent, DatePipe, PaginacaoComponent, BuscaComponent,
    LucideDollarSign, LucidePin, LucideBell, LucideCheck,
    LucideX, LucidePen, LucideTrash2, LucideHouse, LucideZap, LucideWifi, LucideDroplets, LucideShoppingCart,
    LucideSparkles, LucidePackage, LucideClock, LucideCircleCheck,
  ],
  template: `
    <div class="flex flex-col gap-8 h-full transition-colors duration-150">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold text-primary tracking-tight">Financeiro</h1>
        </div>
        <app-button type="button" variant="solid" label="+ Nova Despesa" (click)="openCreate()"></app-button>
      </div>

      <!-- Total -->
      <div class="rounded-2xl bg-card border border-theme p-6 shadow-lg shadow-black/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center"><svg lucideDollarSign class="w-5 h-5 text-purple-300"></svg></div>
            <div>
              <p class="text-secondary text-sm font-medium">Total do mês</p>
              <p class="text-2xl font-bold text-primary tracking-tight">R$ {{ totalAmount().toFixed(2) }}</p>
            </div>
          </div>
          <span class="text-muted text-xs border border-theme rounded-lg px-2.5 py-1">{{ expenses().length }} despesas</span>
        </div>
      </div>

      <app-search placeholder="Pesquisar por descrição, categoria ou responsável..." (searchChange)="onSearch($event)" />

      <!-- List -->
      <div class="flex-1 flex flex-col gap-4 min-h-0">
        @for (e of paginatedExpenses(); track e.id) {
          <div class="rounded-2xl bg-card border border-theme p-5 shadow-lg shadow-black/10 hover:bg-card-hover transition">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-start gap-4 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  @switch (e.category) {
                    @case ('aluguel') { <svg lucideHouse class="w-5 h-5 text-purple-300"></svg> }
                    @case ('energia') { <svg lucideZap class="w-5 h-5 text-purple-300"></svg> }
                    @case ('internet') { <svg lucideWifi class="w-5 h-5 text-purple-300"></svg> }
                    @case ('agua') { <svg lucideDroplets class="w-5 h-5 text-purple-300"></svg> }
                    @case ('compras') { <svg lucideShoppingCart class="w-5 h-5 text-purple-300"></svg> }
                    @case ('limpeza') { <svg lucideSparkles class="w-5 h-5 text-purple-300"></svg> }
                    @default { <svg lucidePackage class="w-5 h-5 text-purple-300"></svg> }
                  }
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="text-primary font-semibold truncate">{{ e.description }}</p>
                    <div class="flex items-center gap-1.5">
                      @if (e.installments > 1) {
                        <span class="text-[10px] font-medium bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{{ e.installments }}x R$ {{ (e.amount / e.installments).toFixed(2) }}</span>
                      }
                      @if (e.fixed) {
                        <span class="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-0.5"><svg lucidePin class="w-3 h-3"></svg> Fixa</span>
                      }
                    </div>
                  </div>
                  <p class="text-muted text-xs mt-0.5">{{ categoryLabel(e.category) }} · {{ e.competenceDate | date:'MMM/yyyy' }} · Pago por {{ e.paidBy }}</p>
                  <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span class="text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">{{ splitModeLabel(e.splitMode) }}</span>
                    @for (sv of e.splitValues; track sv.name) {
                      <span class="flex items-center gap-1 text-[11px] bg-card-strong text-secondary px-2 py-0.5 rounded-full">
                        @switch (paymentStatus(e.id, sv.name)) {
                          @case ('pending') { <span class="w-2 h-2 rounded-full bg-gray-400"></span> }
                          @case ('awaiting') { <span class="w-2 h-2 rounded-full bg-amber-400"></span> }
                          @case ('approved') { <span class="w-2 h-2 rounded-full bg-emerald-400"></span> }
                        }
                        {{ sv.name }} R$ {{ sv.value.toFixed(2) }}
                      </span>
                    }
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <div class="flex flex-col items-end gap-1">
                  <span class="text-primary font-bold text-lg">R$ {{ e.amount.toFixed(2) }}</span>
                  @if (myPaymentStatus(e.id); as p) {
                    @if (p.status === 'pending') {
                      <button (click)="openPayModal(e)" class="text-[10px] font-medium bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full hover:bg-emerald-500/30 transition cursor-pointer">Pagar</button>
                    } @else if (p.status === 'awaiting') {
                      <span class="text-[10px] text-amber-400 flex items-center gap-1"><svg lucideClock class="w-3 h-3"></svg> Aguardando</span>
                    } @else if (p.status === 'approved') {
                      <span class="text-[10px] text-emerald-400 flex items-center gap-1"><svg lucideCircleCheck class="w-3 h-3"></svg> Pago</span>
                    }
                  }
                </div>
                @if (e.paidBy === CURRENT_USER) {
                  <div class="flex flex-col gap-1">
                    @if (pendingPaymentsForCreator(e).length; as count) {
                      <button (click)="openApproveModal(e)" class="text-[10px] font-medium bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full hover:bg-amber-500/30 transition cursor-pointer whitespace-nowrap flex items-center gap-1">
                        <svg lucideBell class="w-3 h-3"></svg> {{ count }} pendente{{ count > 1 ? 's' : '' }}
                      </button>
                    }
                    <div class="flex gap-1">
                      <button (click)="openEdit(e)" class="text-muted hover:text-primary transition cursor-pointer"><svg lucidePen class="w-4 h-4"></svg></button>
                      <button (click)="confirmDelete(e)" class="text-muted hover:text-rose-400 transition cursor-pointer"><svg lucideTrash2 class="w-4 h-4"></svg></button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @empty {
          <div class="rounded-2xl bg-card border border-theme p-10 text-center">
            <p class="text-muted">Nenhuma despesa cadastrada</p>
          </div>
        }
      </div>

      <app-paginator [currentPage]="currentPage()" [totalPages]="totalFilteredPages()" (pageChange)="goToPage($event)" />
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeModal()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-lg">
          <div class="rounded-2xl bg-card border border-theme p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-primary font-bold text-lg">{{ editingId() ? 'Editar despesa' : 'Nova despesa' }}</h2>
              <button (click)="closeModal()" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
            </div>

            <div class="flex flex-col gap-4">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Descrição
                <input type="text" placeholder="Ex: Conta de luz" [(ngModel)]="form.description"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full" />
              </label>

              <div class="grid grid-cols-2 gap-4">
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
                      <option [value]="c.value" class="bg-purple-dark text-white">{{ c.label }}</option>
                    }
                  </select>
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
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

              <div class="grid grid-cols-2 gap-4">
                <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                  Parcelas
                  <input type="number" min="1" step="1" [(ngModel)]="form.installments" (input)="onInstallmentsChange()"
                    class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
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
                <p class="text-secondary text-xs">Serão geradas {{ form.installments }} parcelas de R$ {{ (form.amount / form.installments).toFixed(2) }}</p>
              }

              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Pago por
                <select [(ngModel)]="form.paidBy"
                  class="bg-input border border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full appearance-none cursor-pointer">
                  <option value="" disabled class="bg-purple-dark text-white/40">Selecione...</option>
                  @for (m of members; track m) {
                    <option [value]="m" class="bg-purple-dark text-white">{{ m }}</option>
                  }
                </select>
                @if (submitted() && !form.paidBy) {
                  <span class="text-rose-400 text-xs mt-1">Selecione quem pagou</span>
                }
              </label>

              <label class="flex items-center justify-between text-sm font-medium text-secondary py-2">
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
                        <span class="text-secondary text-sm font-medium">R$ {{ sv.value.toFixed(2) }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              @if (form.splitMode === 'some') {
                <div class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                  <span>Selecione os participantes (mínimo 2)</span>
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
                        <span class="text-secondary text-xs">R$ {{ someValue(m).toFixed(2) }}</span>
                      </label>
                    }
                  </div>
                </div>
              }

              @if (form.splitMode === 'custom') {
                <div class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                  <span>Valores por morador</span>
                  @if (submitted() && customTotal() !== form.amount) {
                    <span class="text-rose-400 text-xs">
                      A soma (R$ {{ customTotal().toFixed(2) }}) deve ser igual ao valor total (R$ {{ form.amount.toFixed(2) }})
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
          <div class="rounded-2xl bg-card border border-theme p-6 shadow-2xl">
            <h2 class="text-primary font-bold text-lg mb-2">Excluir despesa?</h2>
            <p class="text-secondary text-sm">Tem certeza que deseja excluir "{{ deleting()?.description }}"?</p>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="cancelDelete()"></app-button>
              <app-button type="button" variant="solid" label="Excluir" (click)="deleteExpense()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Payment modal -->
    @if (payingExpense(); as e) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closePayModal()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-sm">
          <div class="rounded-2xl bg-card border border-theme p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-primary font-bold text-lg">Pagar despesa</h2>
              <button (click)="closePayModal()" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
            </div>
            <p class="text-secondary text-sm mb-1">{{ e.description }}</p>
            @for (sv of e.splitValues; track sv.name) {
              @if (sv.name === CURRENT_USER) {
                <p class="text-primary font-semibold text-lg">Sua cota: R$ {{ sv.value.toFixed(2) }}</p>
              }
            }
            <div class="mt-4 flex flex-col gap-2">
              <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
                Comprovante (opcional)
                <input type="file" accept="image/*" (change)="onReceiptSelected($event)"
                  class="text-secondary text-sm file:bg-white/10 file:border file:border-theme file:rounded-lg file:px-3 file:py-1.5 file:text-primary file:cursor-pointer file:mr-3" />
              </label>
              @if (payReceiptBase64()) {
                <img [src]="payReceiptBase64()" class="w-full h-32 object-cover rounded-xl border border-theme" />
              }
            </div>
            <div class="flex gap-3 mt-6">
              <app-button type="button" variant="outline" label="Cancelar" (click)="closePayModal()"></app-button>
              <app-button type="button" variant="solid" label="Confirmar pagamento" (click)="confirmPay()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Approval modal -->
    @if (approveExpense(); as e) {
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="closeApproveModal()">
        <div (click)="$event.stopPropagation()" class="w-full max-w-md">
          <div class="rounded-2xl bg-card border border-theme p-6 shadow-2xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-primary font-bold text-lg">Pagamentos pendentes</h2>
              <button (click)="closeApproveModal()" class="text-muted hover:text-primary transition cursor-pointer"><svg lucideX class="w-5 h-5"></svg></button>
            </div>
            <p class="text-secondary text-sm mb-4">{{ e.description }}</p>
            @for (p of pendingPaymentsForCreator(e); track p.memberName) {
              <div class="rounded-xl bg-card-strong p-4 mb-3 last:mb-0">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-primary font-semibold">{{ p.memberName }}</span>
                  <span class="text-secondary text-xs">Pago em {{ p.paidAt }}</span>
                </div>
                @for (sv of e.splitValues; track sv.name) {
                  @if (sv.name === p.memberName) {
                    <p class="text-secondary text-sm">Valor: R$ {{ sv.value.toFixed(2) }}</p>
                  }
                }
                @if (p.receiptBase64) {
                  <img [src]="p.receiptBase64" class="w-full h-40 object-cover rounded-xl border border-theme mt-2 cursor-pointer" (click)="expandReceipt.set(p.receiptBase64)" />
                }
                <div class="flex gap-2 mt-3">
                  <button (click)="approvePayment(p)" class="flex-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition cursor-pointer flex items-center justify-center gap-1"><svg lucideCheck class="w-3 h-3"></svg> Aprovar</button>
                  <button (click)="rejectPayment(p)" class="flex-1 text-xs font-medium bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/30 transition cursor-pointer flex items-center justify-center gap-1"><svg lucideX class="w-3 h-3"></svg> Rejeitar</button>
                </div>
              </div>
            } @empty {
              <p class="text-muted text-center py-6">Nenhum pagamento pendente</p>
            }
            <div class="mt-4">
              <app-button type="button" variant="outline" label="Fechar" (click)="closeApproveModal()"></app-button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Receipt expand -->
    @if (expandReceipt(); as url) {
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4" (click)="expandReceipt.set('')">
        <img [src]="url" class="max-w-full max-h-full object-contain rounded-2xl" (click)="$event.stopPropagation()" />
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

  protected expenses = signal<Expense[]>([...this.mockData.expenses()]);
  protected payments = signal<Payment[]>([...this.mockData.payments()]);
  protected showModal = signal(false);
  protected editingId = signal<number | null>(null);
  protected deleting = signal<Expense | null>(null);
  protected payingExpense = signal<Expense | null>(null);
  protected approveExpense = signal<Expense | null>(null);
  protected payReceiptBase64 = signal('');
  protected expandReceipt = signal('');
  protected submitted = signal(false);
  protected searchQuery = signal('');
  readonly pageSize = 3;
  readonly currentPage = signal(1);

  readonly filteredExpenses = () => {
    const query = this.searchQuery().toLowerCase();
    let list = this.expenses();
    if (query) {
      list = list.filter(e =>
        e.description.toLowerCase().includes(query) ||
        this.categoryLabel(e.category).toLowerCase().includes(query) ||
        e.paidBy.toLowerCase().includes(query)
      );
    }
    return list;
  };

  readonly totalFilteredPages = () =>
    Math.ceil(this.filteredExpenses().length / this.pageSize);

  readonly paginatedExpenses = () => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredExpenses().slice(start, start + this.pageSize);
  };


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
      installments: 1,
      firstDueDate: '',
      splitCustom: Object.fromEntries(this.members.map(m => [m, 0])) as Record<string, number>,
    };
  }

  constructor() {
    this.form = this.emptyForm();
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
          `${expense.description} — venceu há ${daysOverdue} dia(s). Sua parte: R$ ${sv.value.toFixed(2)}`,
          sv.name, expense.id);
        this.notif.registerReminder(expense.id, sv.name);
      }
    }
  }

  splitModeLabel(mode: SplitMode): string {
    return this.splitOptions.find(o => o.value === mode)?.label ?? '';
  }

  categoryLabel(value: string): string {
    return this.mockData.CATEGORIES.find(c => c.value === value)?.label ?? value;
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

  onInstallmentsChange(): void {
    if (this.form.installments < 1) this.form.installments = 1;
    if (this.form.installments <= 1) this.form.firstDueDate = '';
  }

  setSplitMode(mode: SplitMode): void {
    this.form.splitMode = mode;
    if (mode === 'some' && this.selectedSome().length === 0) {
      this.selectedSome.set([...this.members]);
    }
  }

  /* Payments */
  protected paymentsForExpense = (expenseId: number): Payment[] => {
    return this.payments().filter(p => p.expenseId === expenseId);
  };

  myPaymentStatus(expenseId: number): Payment | undefined {
    return this.payments().find(p => p.expenseId === expenseId && p.memberName === this.CURRENT_USER);
  }

  paymentStatus(expenseId: number, memberName: string): 'pending' | 'awaiting' | 'approved' {
    const p = this.payments().find(p => p.expenseId === expenseId && p.memberName === memberName);
    if (!p) return 'pending';
    return p.status;
  }

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
    this.closePayModal();
  }

  pendingPaymentsForCreator(expense: Expense): Payment[] {
    if (expense.paidBy !== this.CURRENT_USER) return [];
    return this.payments().filter(p => p.expenseId === expense.id && p.status === 'awaiting');
  }

  approvePayment(p: Payment): void {
    this.payments.update(list =>
      list.map(p2 => p2.expenseId === p.expenseId && p2.memberName === p.memberName
        ? { ...p2, status: 'approved' as PaymentStatus } : p2)
    );
  }

  rejectPayment(p: Payment): void {
    this.payments.update(list =>
      list.filter(p2 => !(p2.expenseId === p.expenseId && p2.memberName === p.memberName))
    );
  }

  receiptUrl(p: Payment): string {
    return p.receiptBase64 || '';
  }

  openApproveModal(e: Expense): void {
    this.approveExpense.set(e);
  }

  closeApproveModal(): void {
    this.approveExpense.set(null);
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
    this.editingId.set(null);
    this.submitted.set(false);
    this.selectedSome.set([...this.members]);
    this.form = {
      ...this.emptyForm(),
      competenceDate: this.today,
      paidBy: this.members[0],
    };
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
      installments: e.installments,
      firstDueDate: e.firstDueDate,
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
      installments: this.form.installments,
      firstDueDate: this.form.installments > 1 ? this.form.firstDueDate : '',
      fixed: this.form.fixed,
    };
    this.expenses.update(list => {
      if (this.editingId()) {
        return list.map(e => e.id === expense.id ? expense : e);
      }
      return [...list, expense];
    });

    // RN-14: notificar moradores envolvidos no rateio
    if (!this.editingId()) {
      for (const sv of splitValues) {
        if (sv.name === expense.paidBy) continue;
        this.notif.add('expense', 'Nova despesa',
          `${expense.description} — sua parte: R$ ${sv.value.toFixed(2)}`,
          sv.name, expense.id);
      }
    }

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

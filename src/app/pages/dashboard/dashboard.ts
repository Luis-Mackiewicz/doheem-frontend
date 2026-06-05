import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockDataService, ResidentBalance } from '../../services/mock-data.service';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideWallet,
  LucideUsers,
  LucideClipboardList,
  LucideReceipt,
} from '@lucide/angular';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    LucideArrowDown,
    LucideArrowUp,
    LucideWallet,
    LucideUsers,
    LucideClipboardList,
    LucideReceipt,
  ],
  template: `
    <div class="flex flex-col gap-6 transition-colors duration-150">
      <h1 class="text-2xl font-bold text-primary">{{ groupName() }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideArrowDown class="w-4 h-4 text-rose-400"></svg>
            <p class="text-secondary text-sm font-medium">Você deve</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ {{ fmt(youOwe()) }}</p>
        </div>
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideArrowUp class="w-4 h-4 text-emerald-400"></svg>
            <p class="text-secondary text-sm font-medium">Você tem a receber</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ {{ fmt(youReceive()) }}</p>
        </div>
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideWallet class="w-4 h-4 text-(--badge-purple)"></svg>
            <p class="text-secondary text-sm font-medium">Dívida total do grupo</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ {{ fmt(totalDebt()) }}</p>
          <p class="text-muted text-xs mt-1">Em aberto</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <a [routerLink]="['/groups', groupId, 'saldos']"
           aria-label="Ver saldo dos moradores"
           class="block rounded-2xl bg-card border-theme p-5 cursor-pointer hover:scale-105 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-400/60 outline-none">
          <div class="flex items-center gap-2 mb-4">
            <svg lucideUsers class="w-5 h-5 text-(--badge-purple)"></svg>
            <h2 class="text-primary font-semibold">Saldo dos Moradores</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-muted border-b border-theme">
                  <th class="text-left pb-2 font-medium">Morador</th>
                  <th class="text-right pb-2 font-medium">Deve</th>
                  <th class="text-right pb-2 font-medium">A receber</th>
                </tr>
              </thead>
              <tbody>
                @for (r of residents(); track r.name) {
                  <tr class="border-b border-soft last:border-b-0">
                    <td class="py-3 text-primary font-medium">{{ r.name }}</td>
                    <td class="py-3 text-right">
                      @if (r.owes > 0) {
                        <span class="text-primary">R$ {{ fmt(r.owes) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                    <td class="py-3 text-right">
                      @if (r.toReceive > 0) {
                        <span class="text-primary">R$ {{ fmt(r.toReceive) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="py-6 text-center text-muted text-sm">Nenhum morador</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </a>

        <div class="flex flex-col gap-4">
          <a [routerLink]="['/groups', groupId, 'tarefas']"
             aria-label="Ver tarefas pendentes"
             class="block rounded-2xl bg-card border-theme p-5 cursor-pointer hover:scale-105 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-400/60 outline-none">
            <div class="flex items-center gap-2 mb-4">
              <svg lucideClipboardList class="w-5 h-5 text-(--badge-purple)"></svg>
              <h2 class="text-primary font-semibold">Tarefas a Fazer</h2>
            </div>
            <div class="flex flex-col gap-2">
              @for (t of pendingTasks(); track t.id) {
                <div class="flex items-center justify-between py-2 border-b border-soft last:border-b-0">
                  <div>
                    <p class="text-primary text-sm">{{ t.title }}</p>
                    <p class="text-muted text-xs">{{ t.assignedTo }} · {{ dueDateLabel(t.dueDate) }}</p>
                  </div>
                </div>
              } @empty {
                <p class="text-muted text-sm text-center py-6">Nenhuma tarefa pendente</p>
              }
            </div>
          </a>

          <a [routerLink]="['/groups', groupId, 'financeiro']"
             aria-label="Ver despesas recentes"
             class="block rounded-2xl bg-card border-theme p-5 cursor-pointer hover:scale-105 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-400/60 outline-none">
            <div class="flex items-center gap-2 mb-4">
              <svg lucideReceipt class="w-5 h-5 text-(--badge-purple)"></svg>
              <h2 class="text-primary font-semibold">Despesas Recentes</h2>
            </div>
            <div class="flex flex-col gap-2">
              @for (e of recentExpenses(); track e.id) {
                <div class="flex items-center justify-between py-2 border-b border-soft last:border-b-0">
                  <div>
                    <p class="text-primary text-sm">{{ e.description }}</p>
                    <p class="text-muted text-xs">{{ e.paidBy }} · {{ dueDateLabel(e.dueDate) }}</p>
                  </div>
                  <span class="text-primary font-medium text-sm">R$ {{ fmt(e.amount) }}</span>
                </div>
              } @empty {
                <p class="text-muted text-sm text-center py-6">Nenhuma despesa recente</p>
              }
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  protected groupId: string;

  private route = inject(ActivatedRoute);
  private mockData = inject(MockDataService);

  constructor() {
    this.groupId = this.route.parent?.snapshot.paramMap.get('id') ?? '';
  }

  private currentUser = this.mockData.CURRENT_USER;
  private expenses = this.mockData.expenses;
  private payments = this.mockData.payments;

  protected readonly groupName = computed(() => {
    const id = Number(this.groupId);
    return this.mockData.groups().find(g => g.id === id)?.name ?? 'Dashboard';
  });

  protected readonly residents = computed(() => {
    const map = new Map<string, ResidentBalance>();
    for (const m of this.mockData.membros()) {
      map.set(m.nome, { name: m.nome, owes: 0, toReceive: 0 });
    }
    for (const exp of this.expenses()) {
      const payer = exp.paidBy;
      for (const sv of exp.splitValues) {
        if (sv.name === payer) continue;
        const payment = this.payments().find(p => p.expenseId === exp.id && p.memberName === sv.name);
        if (!payment || payment.status !== 'approved') {
          map.get(sv.name)!.owes += sv.value;
          map.get(payer)!.toReceive += sv.value;
        }
      }
    }
    return [...map.values()];
  });

  protected readonly youOwe = computed(() => {
    let total = 0;
    for (const exp of this.expenses()) {
      if (exp.paidBy === this.currentUser) continue;
      const sv = exp.splitValues.find(s => s.name === this.currentUser);
      if (!sv) continue;
      const payment = this.payments().find(p => p.expenseId === exp.id && p.memberName === this.currentUser);
      if (!payment || payment.status !== 'approved') {
        total += sv.value;
      }
    }
    return total;
  });

  protected readonly youReceive = computed(() => {
    let total = 0;
    for (const exp of this.expenses()) {
      if (exp.paidBy !== this.currentUser) continue;
      for (const sv of exp.splitValues) {
        if (sv.name === this.currentUser) continue;
        const payment = this.payments().find(p => p.expenseId === exp.id && p.memberName === sv.name);
        if (!payment || payment.status !== 'approved') {
          total += sv.value;
        }
      }
    }
    return total;
  });

  protected readonly totalDebt = computed(() => {
    let total = 0;
    for (const exp of this.expenses()) {
      for (const sv of exp.splitValues) {
        if (sv.name === exp.paidBy) continue;
        const payment = this.payments().find(p => p.expenseId === exp.id && p.memberName === sv.name);
        if (!payment || payment.status !== 'approved') {
          total += sv.value;
        }
      }
    }
    return total;
  });

  protected readonly recentExpenses = computed(() =>
    [...this.expenses()]
      .sort((a, b) => b.competenceDate.localeCompare(a.competenceDate))
      .slice(0, 5)
  );

  protected readonly pendingTasks = computed(() =>
    this.mockData.tasks().filter(t => t.status !== 'done').slice(0, 4)
  );

  protected fmt(val: number): string {
    return val.toFixed(2).replace('.', ',');
  }

  protected dueDateLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
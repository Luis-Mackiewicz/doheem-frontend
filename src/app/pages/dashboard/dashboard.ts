import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  LucideArrowDown,
  LucideArrowUp,
  LucideWallet,
  LucideUsers,
  LucideClipboardList,
  LucideReceipt,
} from '@lucide/angular';

interface ResidentBalance {
  name: string;
  owes: number;
  toReceive: number;
}

interface RecentExpense {
  description: string;
  amount: number;
  paidBy: string;
  date: string;
}

interface TaskItem {
  title: string;
  assignedTo: string;
  dueDate: string;
}

const MOCK_GROUPS: { id: number; name: string }[] = [
  { id: 1, name: 'República Solaris' },
  { id: 2, name: 'Casa do Estudante' },
  { id: 3, name: 'Alojamento Universitário' },
  { id: 4, name: 'República Bela Vista' },
  { id: 5, name: 'Pensionato Central' },
  { id: 6, name: 'Kitnet Compartilhada' },
  { id: 7, name: 'Casa da Praia' },
  { id: 8, name: 'Republica 8' },
  { id: 9, name: 'Republica 9' },
  { id: 10, name: 'Republica 10' },
];

const MOCK_RESIDENTS: ResidentBalance[] = [
  { name: 'Carlos', owes: 150, toReceive: 0 },
  { name: 'Ana', owes: 0, toReceive: 200 },
  { name: 'Pedro', owes: 80, toReceive: 50 },
  { name: 'Mariana', owes: 0, toReceive: 120 },
  { name: 'João', owes: 300, toReceive: 0 },
];

const MOCK_EXPENSES: RecentExpense[] = [
  { description: 'Conta de luz', amount: 320, paidBy: 'Ana', date: '28/05' },
  { description: 'Água', amount: 150, paidBy: 'Carlos', date: '25/05' },
  { description: 'Internet', amount: 200, paidBy: 'Mariana', date: '22/05' },
  { description: 'Mercado', amount: 580, paidBy: 'Pedro', date: '20/05' },
  { description: 'Gás', amount: 95, paidBy: 'Ana', date: '18/05' },
];

const MOCK_TASKS: TaskItem[] = [
  { title: 'Limpar a cozinha', assignedTo: 'Carlos', dueDate: '02/06' },
  { title: 'Tirar o lixo', assignedTo: 'Ana', dueDate: '01/06' },
  { title: 'Limpar o banheiro', assignedTo: 'Pedro', dueDate: '03/06' },
  { title: 'Varrer a sala', assignedTo: 'Mariana', dueDate: '01/06' },
];

@Component({
  selector: 'app-dashboard',
  imports: [
    LucideArrowDown,
    LucideArrowUp,
    LucideWallet,
    LucideUsers,
    LucideClipboardList,
    LucideReceipt,
  ],
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-primary">{{ groupName }}</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideArrowDown class="w-4 h-4 text-orange-400"></svg>
            <p class="text-secondary text-sm font-medium">Você deve</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ 150,00</p>
        </div>
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideArrowUp class="w-4 h-4 text-green-400"></svg>
            <p class="text-secondary text-sm font-medium">Você tem a receber</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ 120,00</p>
        </div>
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-2">
            <svg lucideWallet class="w-4 h-4 text-primary"></svg>
            <p class="text-secondary text-sm font-medium">Dívida total do grupo</p>
          </div>
          <p class="text-2xl font-bold text-primary">R$ 1.345,00</p>
          <p class="text-muted text-xs mt-1">Mês de Maio</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="rounded-2xl bg-card border-theme p-5">
          <div class="flex items-center gap-2 mb-4">
            <svg lucideUsers class="w-5 h-5 text-violet-400"></svg>
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
                @for (r of residents; track r.name) {
                  <tr class="border-b border-soft last:border-b-0">
                    <td class="py-3 text-primary font-medium">{{ r.name }}</td>
                    <td class="py-3 text-right">
                      @if (r.owes > 0) {
                        <span class="text-orange-400">R$ {{ r.owes.toFixed(2) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                    <td class="py-3 text-right">
                      @if (r.toReceive > 0) {
                        <span class="text-green-400">R$ {{ r.toReceive.toFixed(2) }}</span>
                      } @else {
                        <span class="text-muted">—</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="rounded-2xl bg-card border-theme p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg lucideClipboardList class="w-5 h-5 text-violet-400"></svg>
              <h2 class="text-primary font-semibold">Tarefas a Fazer</h2>
            </div>
            <div class="flex flex-col gap-2">
              @for (t of tasks; track t.title) {
                <div class="flex items-center justify-between py-2 border-b border-soft last:border-b-0">
                  <div>
                    <p class="text-primary text-sm">{{ t.title }}</p>
                    <p class="text-muted text-xs">{{ t.assignedTo }} · {{ t.dueDate }}</p>
                  </div>
                  <span class="text-muted text-xs border border-theme rounded-lg px-2 py-0.5">{{ t.dueDate }}</span>
                </div>
              }
            </div>
          </div>

          <div class="rounded-2xl bg-card border-theme p-5">
            <div class="flex items-center gap-2 mb-4">
              <svg lucideReceipt class="w-5 h-5 text-violet-400"></svg>
              <h2 class="text-primary font-semibold">Despesas Recentes</h2>
            </div>
            <div class="flex flex-col gap-2">
              @for (e of expenses; track e.description) {
                <div class="flex items-center justify-between py-2 border-b border-soft last:border-b-0">
                  <div>
                    <p class="text-primary text-sm">{{ e.description }}</p>
                    <p class="text-muted text-xs">{{ e.paidBy }} · {{ e.date }}</p>
                  </div>
                  <span class="text-primary font-medium text-sm">R$ {{ e.amount.toFixed(2) }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardPage {
  protected groupName: string;

  constructor(route: ActivatedRoute) {
    const id = Number(route.parent?.snapshot.paramMap.get('id'));
    this.groupName = MOCK_GROUPS.find(g => g.id === id)?.name ?? 'Dashboard';
  }

  protected residents = MOCK_RESIDENTS;
  protected expenses = MOCK_EXPENSES;
  protected tasks = MOCK_TASKS;
}

import { Component } from '@angular/core';

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
  template: `
    <div class="flex flex-col gap-6">
      <h1 class="text-2xl font-bold text-white">Dashboard</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5">
          <p class="text-white/50 text-sm font-medium">Dívida total do grupo</p>
          <p class="text-2xl font-bold text-white mt-1">R$ 1.345,00</p>
          <p class="text-white/40 text-xs mt-1">Mês de Maio</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5">
          <p class="text-white/50 text-sm font-medium">Você tem a receber</p>
          <p class="text-2xl font-bold text-green-400 mt-1">R$ 120,00</p>
        </div>
        <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5">
          <p class="text-white/50 text-sm font-medium">Você deve</p>
          <p class="text-2xl font-bold text-orange-400 mt-1">R$ 150,00</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5">
          <h2 class="text-white font-semibold mb-4">Saldo dos Moradores</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-white/40 border-b border-white/10">
                  <th class="text-left pb-2 font-medium">Morador</th>
                  <th class="text-right pb-2 font-medium">Deve</th>
                  <th class="text-right pb-2 font-medium">A receber</th>
                </tr>
              </thead>
              <tbody>
                @for (r of residents; track r.name) {
                  <tr class="border-b border-white/5 last:border-b-0">
                    <td class="py-3 text-white font-medium">{{ r.name }}</td>
                    <td class="py-3 text-right">
                      @if (r.owes > 0) {
                        <span class="text-orange-400">R$ {{ r.owes.toFixed(2) }}</span>
                      } @else {
                        <span class="text-white/30">—</span>
                      }
                    </td>
                    <td class="py-3 text-right">
                      @if (r.toReceive > 0) {
                        <span class="text-green-400">R$ {{ r.toReceive.toFixed(2) }}</span>
                      } @else {
                        <span class="text-white/30">—</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5">
            <h2 class="text-white font-semibold mb-4">Tarefas a Fazer</h2>
            <div class="flex flex-col gap-2">
              @for (t of tasks; track t.title) {
                <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <div>
                    <p class="text-white text-sm">{{ t.title }}</p>
                    <p class="text-white/40 text-xs">{{ t.assignedTo }} · {{ t.dueDate }}</p>
                  </div>
                  <span class="text-white/20 text-xs border border-white/10 rounded-lg px-2 py-0.5">{{ t.dueDate }}</span>
                </div>
              }
            </div>
          </div>

          <div class="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5">
            <h2 class="text-white font-semibold mb-4">Despesas Recentes</h2>
            <div class="flex flex-col gap-2">
              @for (e of expenses; track e.description) {
                <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                  <div>
                    <p class="text-white text-sm">{{ e.description }}</p>
                    <p class="text-white/40 text-xs">{{ e.paidBy }} · {{ e.date }}</p>
                  </div>
                  <span class="text-white font-medium text-sm">R$ {{ e.amount.toFixed(2) }}</span>
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
  protected residents = MOCK_RESIDENTS;
  protected expenses = MOCK_EXPENSES;
  protected tasks = MOCK_TASKS;
}

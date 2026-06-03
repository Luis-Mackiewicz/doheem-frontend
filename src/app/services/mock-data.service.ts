import { Injectable, signal } from '@angular/core';

export interface Membro {
  nome: string;
  telefone: string;
  admin: boolean;
}

export interface SplitValue {
  name: string;
  value: number;
}

export type SplitMode = 'equal' | 'some' | 'custom';

export type PaymentStatus = 'pending' | 'awaiting' | 'approved';

export interface Payment {
  expenseId: number;
  memberName: string;
  status: PaymentStatus;
  paidAt?: string;
  receiptBase64?: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  competenceDate: string;
  dueDate: string;
  paidBy: string;
  splitMode: SplitMode;
  splitValues: SplitValue[];
  installments: number;
  firstDueDate: string;
  fixed: boolean;
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: TaskStatus;
  createdAt: string;
  dueDate: string;
}

export interface ResidentBalance {
  name: string;
  owes: number;
  toReceive: number;
}

const MEMBROS_INICIAIS: Membro[] = [
  { nome: 'Carlos Silva', telefone: '(11) 99999-0001', admin: false },
  { nome: 'Ana Oliveira', telefone: '(11) 99999-0002', admin: true },
  { nome: 'Pedro Santos', telefone: '(11) 99999-0003', admin: false },
  { nome: 'Mariana Costa', telefone: '(11) 99999-0004', admin: false },
  { nome: 'João Pereira', telefone: '(11) 99999-0005', admin: false },
  { nome: 'Fernanda Lima', telefone: '(11) 99999-0006', admin: false },
  { nome: 'Rafael Souza', telefone: '(11) 99999-0007', admin: false },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 1, description: 'Conta de luz', amount: 320, category: 'energia', competenceDate: '2026-05-01', dueDate: '2026-06-10', paidBy: 'Ana Oliveira', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 64 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 2, description: 'Água', amount: 150, category: 'agua', competenceDate: '2026-05-01', dueDate: '2026-06-15', paidBy: 'Carlos Silva', splitMode: 'some', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos'].map(n => ({ name: n, value: 50 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 3, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2026-05-01', dueDate: '2026-06-05', paidBy: 'Mariana Costa', splitMode: 'some', splitValues: ['Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 100 })), installments: 3, firstDueDate: '2026-06-05', fixed: true },
  { id: 4, description: 'Mercado do mês', amount: 580, category: 'compras', competenceDate: '2026-05-20', dueDate: '2026-06-01', paidBy: 'Pedro Santos', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 116 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 5, description: 'Material de limpeza', amount: 95, category: 'limpeza', competenceDate: '2026-05-18', dueDate: '2026-06-20', paidBy: 'Ana Oliveira', splitMode: 'some', splitValues: ['Ana Oliveira', 'Pedro Santos'].map(n => ({ name: n, value: 47.5 })), installments: 2, firstDueDate: '2026-06-20', fixed: false },
];

const MOCK_PAYMENTS: Payment[] = [
  { expenseId: 1, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-28' },
  { expenseId: 1, memberName: 'Mariana Costa', status: 'awaiting', paidAt: '2026-05-30', receiptBase64: '' },
  { expenseId: 3, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-25' },
  { expenseId: 4, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-25' },
  { expenseId: 2, memberName: 'Ana Oliveira', status: 'awaiting', paidAt: '2026-06-01', receiptBase64: '' },
];

const MOCK_HISTORICAL_EXPENSES: Expense[] = [
  { id: 1, description: 'Conta de luz', amount: 320, category: 'energia', competenceDate: '2025-03-10', dueDate: '2025-04-10', paidBy: 'Ana Oliveira', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 64 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 2, description: 'Água', amount: 150, category: 'agua', competenceDate: '2025-04-01', dueDate: '2025-05-01', paidBy: 'Carlos Silva', splitMode: 'some', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos'].map(n => ({ name: n, value: 50 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 3, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2025-04-05', dueDate: '2025-05-05', paidBy: 'Mariana Costa', splitMode: 'some', splitValues: ['Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 100 })), installments: 3, firstDueDate: '2025-04-05', fixed: true },
  { id: 4, description: 'Aluguel', amount: 1800, category: 'aluguel', competenceDate: '2025-05-01', dueDate: '2026-06-05', paidBy: 'Pedro Santos', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 360 })), installments: 1, firstDueDate: '', fixed: true },
  { id: 5, description: 'Compras mercado', amount: 580, category: 'compras', competenceDate: '2025-05-20', dueDate: '2025-06-01', paidBy: 'Pedro Santos', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 116 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 6, description: 'Material de limpeza', amount: 95, category: 'limpeza', competenceDate: '2025-05-22', dueDate: '2025-06-20', paidBy: 'Ana Oliveira', splitMode: 'some', splitValues: ['Ana Oliveira', 'Pedro Santos'].map(n => ({ name: n, value: 47.5 })), installments: 2, firstDueDate: '2025-05-22', fixed: false },
  { id: 7, description: 'Conta de luz', amount: 340, category: 'energia', competenceDate: '2026-05-01', dueDate: '2026-06-10', paidBy: 'Ana Oliveira', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 68 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 8, description: 'Água', amount: 155, category: 'agua', competenceDate: '2026-05-05', dueDate: '2026-06-15', paidBy: 'Carlos Silva', splitMode: 'some', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos'].map(n => ({ name: n, value: 51.67 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 9, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2026-05-10', dueDate: '2026-06-05', paidBy: 'Mariana Costa', splitMode: 'some', splitValues: ['Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 100 })), installments: 3, firstDueDate: '2026-05-10', fixed: true },
  { id: 10, description: 'Mercado do mês', amount: 620, category: 'compras', competenceDate: '2026-06-01', dueDate: '2026-06-25', paidBy: 'Pedro Santos', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 124 })), installments: 1, firstDueDate: '', fixed: false },
];

const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Consertar torneira da cozinha', description: 'A torneira da pia direita está vazando água sem parar. Precisa trocar o vedante.', assignedTo: 'Carlos Silva', createdBy: 'Carlos Silva', status: 'todo', createdAt: '2026-05-28', dueDate: '2026-06-05' },
  { id: 2, title: 'Comprar lâmpadas novas', description: 'Duas lâmpadas da sala queimaram. Comprar LED 9W bocal E27.', assignedTo: 'Ana Oliveira', createdBy: 'Ana Oliveira', status: 'todo', createdAt: '2026-05-29', dueDate: '2026-06-02' },
  { id: 3, title: 'Limpar caixa d\'água', description: 'A caixa d\'água precisa de limpeza urgente. Agendar para o sábado de manhã.', assignedTo: 'Pedro Santos', createdBy: 'Pedro Santos', status: 'todo', createdAt: '2026-05-30', dueDate: '2026-06-10' },
  { id: 4, title: 'Organizar despensa', description: 'Separar alimentos por validade e organizar as prateleiras.', assignedTo: 'Mariana Costa', createdBy: 'Mariana Costa', status: 'doing', createdAt: '2026-05-25', dueDate: '2026-06-01' },
  { id: 5, title: 'Lavar roupa de cama', description: 'Trocas os lençóis e fronhas de todos os quartos.', assignedTo: 'João Pereira', createdBy: 'João Pereira', status: 'doing', createdAt: '2026-05-26', dueDate: '2026-06-03' },
  { id: 6, title: 'Limpar área externa', description: 'Varrer o quintal, lavar o chão e regar as plantas.', assignedTo: 'Pedro Santos', createdBy: 'Ana Oliveira', status: 'done', createdAt: '2026-05-20', dueDate: '2026-05-25' },
  { id: 7, title: 'Passar pano na sala', description: 'Passar pano úmido em toda a sala e lustrar os móveis.', assignedTo: 'Ana Oliveira', createdBy: 'Ana Oliveira', status: 'done', createdAt: '2026-05-22', dueDate: '2026-05-28' },
  { id: 8, title: 'Trocar filtro da água', description: 'O filtro do bebedouro venceu. Comprar um novo e trocar.', assignedTo: 'Carlos Silva', createdBy: 'Ana Oliveira', status: 'done', createdAt: '2026-05-23', dueDate: '2026-05-30' },
];

@Injectable({ providedIn: 'root' })
export class MockDataService {
  readonly CURRENT_USER: string = 'Carlos Silva';
  readonly ADMIN_USER: string = 'Ana Oliveira';
  readonly MEMBROS = ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira', 'Fernanda Lima', 'Rafael Souza'];
  readonly CATEGORIES = [
    { value: 'aluguel', label: 'Aluguel' },
    { value: 'energia', label: 'Energia' },
    { value: 'internet', label: 'Internet' },
    { value: 'agua', label: 'Água' },
    { value: 'compras', label: 'Compras' },
    { value: 'limpeza', label: 'Limpeza' },
    { value: 'outros', label: 'Outros' },
  ];

  private readonly membrosSignal = signal<Membro[]>([...MEMBROS_INICIAIS]);
  readonly membros = this.membrosSignal.asReadonly();

  private readonly expensesSignal = signal<Expense[]>([...MOCK_EXPENSES]);
  readonly expenses = this.expensesSignal.asReadonly();

  private readonly paymentsSignal = signal<Payment[]>([...MOCK_PAYMENTS]);
  readonly payments = this.paymentsSignal.asReadonly();

  private readonly tasksSignal = signal<Task[]>([...MOCK_TASKS]);
  readonly tasks = this.tasksSignal.asReadonly();

  readonly historicalExpenses = [...MOCK_HISTORICAL_EXPENSES];

  readonly residents = [
    { name: 'Carlos Silva', owes: 150, toReceive: 0 },
    { name: 'Ana Oliveira', owes: 0, toReceive: 200 },
    { name: 'Pedro Santos', owes: 80, toReceive: 50 },
    { name: 'Mariana Costa', owes: 0, toReceive: 120 },
    { name: 'João Pereira', owes: 300, toReceive: 0 },
  ];

  temDividasPendentes(nome: string): boolean {
    for (const expense of this.expensesSignal()) {
      if (expense.paidBy === nome) continue;
      const isInSplit = expense.splitValues.some(sv => sv.name === nome);
      if (!isInSplit) continue;
      const payment = this.paymentsSignal().find(p => p.expenseId === expense.id && p.memberName === nome);
      if (!payment || payment.status !== 'approved') return true;
    }
    return false;
  }

  temTarefasPendentes(nome: string): boolean {
    return this.tasksSignal().some(t => t.assignedTo === nome && t.status !== 'done');
  }

  getMembroMaisAntigo(excluirNome?: string): Membro | undefined {
    const list = excluirNome
      ? this.membrosSignal().filter(m => m.nome !== excluirNome)
      : this.membrosSignal();
    return list[0];
  }

  removerMembro(nome: string): void {
    this.membrosSignal.update(list => list.filter(m => m.nome !== nome));
  }

  promoverParaAdmin(nome: string): void {
    this.membrosSignal.update(list =>
      list.map(m => m.nome === nome ? { ...m, admin: true } : m)
    );
  }
}

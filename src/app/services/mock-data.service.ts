import { Injectable, signal } from '@angular/core';

export interface Membro {
  nome: string;
  telefone: string;
  email: string;
  documento: string;
  dataNascimento: string;
  cep: string;
  admin: boolean;
  fotoBase64?: string;
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
  approvedBy?: string;
}

export interface InstallmentGroup {
  id: number;
  index: number;
  total: number;
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
  installmentGroup?: InstallmentGroup;
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

export interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  monthlyFee: number;
  cnpj: string;
  cep: string;
  imagemBase64?: string;
  inviteLink?: string;
}

const MEMBROS_INICIAIS: Membro[] = [
  { nome: 'Carlos Silva', telefone: '(11) 99999-0001', email: 'carlos.silva@email.com', documento: '529.982.247-25', dataNascimento: '15/03/1998', cep: '01310-100', admin: false },
  { nome: 'Ana Oliveira', telefone: '(11) 99999-0002', email: 'ana.oliveira@email.com', documento: '123.456.789-09', dataNascimento: '22/07/1997', cep: '04567-110', admin: true },
  { nome: 'Pedro Santos', telefone: '(11) 99999-0003', email: 'pedro.santos@email.com', documento: '987.654.321-00', dataNascimento: '10/11/1999', cep: '05428-010', admin: false },
  { nome: 'Mariana Costa', telefone: '(11) 99999-0004', email: 'mariana.costa@email.com', documento: '111.222.333-44', dataNascimento: '05/02/2000', cep: '02045-001', admin: false },
  { nome: 'João Pereira', telefone: '(11) 99999-0005', email: 'joao.pereira@email.com', documento: '555.666.777-88', dataNascimento: '18/09/1996', cep: '01234-567', admin: false },
  { nome: 'Fernanda Lima', telefone: '(11) 99999-0006', email: 'fernanda.lima@email.com', documento: '999.888.777-66', dataNascimento: '30/06/2001', cep: '01532-080', admin: false },
  { nome: 'Rafael Souza', telefone: '(11) 99999-0007', email: 'rafael.souza@email.com', documento: '444.333.222-11', dataNascimento: '12/12/1995', cep: '04789-220', admin: false },
];

const MOCK_EXPENSES: Expense[] = [
  { id: 1, description: 'Conta de luz', amount: 320, category: 'energia', competenceDate: '2026-05-01', dueDate: '2026-06-10', paidBy: 'Ana Oliveira', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 64 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 2, description: 'Água', amount: 150, category: 'agua', competenceDate: '2026-05-01', dueDate: '2026-06-15', paidBy: 'Carlos Silva', splitMode: 'some', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos'].map(n => ({ name: n, value: 50 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 3, description: 'Internet', amount: 200, category: 'internet', competenceDate: '2026-05-01', dueDate: '2026-06-05', paidBy: 'Mariana Costa', splitMode: 'some', splitValues: ['Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 100 })), installments: 3, firstDueDate: '2026-06-05', fixed: true },
  { id: 4, description: 'Mercado do mês', amount: 580, category: 'compras', competenceDate: '2026-05-20', dueDate: '2026-06-01', paidBy: 'Pedro Santos', splitMode: 'equal', splitValues: ['Ana Oliveira', 'Carlos Silva', 'Pedro Santos', 'Mariana Costa', 'João Pereira'].map(n => ({ name: n, value: 116 })), installments: 1, firstDueDate: '', fixed: false },
  { id: 5, description: 'Material de limpeza', amount: 95, category: 'limpeza', competenceDate: '2026-05-18', dueDate: '2026-06-20', paidBy: 'Ana Oliveira', splitMode: 'some', splitValues: ['Ana Oliveira', 'Pedro Santos'].map(n => ({ name: n, value: 47.5 })), installments: 2, firstDueDate: '2026-06-20', fixed: false },
];

const MOCK_PAYMENTS: Payment[] = [
  { expenseId: 1, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-28', approvedBy: 'Ana Oliveira' },
  { expenseId: 1, memberName: 'Mariana Costa', status: 'awaiting', paidAt: '2026-05-30', receiptBase64: '' },
  { expenseId: 3, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-25', approvedBy: 'Mariana Costa' },
  { expenseId: 4, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-25', approvedBy: 'Pedro Santos' },
  { expenseId: 2, memberName: 'Ana Oliveira', status: 'awaiting', paidAt: '2026-06-01', receiptBase64: '' },
  { expenseId: 7, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-05-28', approvedBy: 'Ana Oliveira', receiptBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjgwIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgcng9IjgiIGZpbGw9IiMxZTFiNGIiLz4KICA8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxODAiIGhlaWdodD0iMjYwIiByeD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTc4YmZhIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjNGMxZDk1Ii8+CiAgPHRleHQgeD0iMTAwIiB5PSI0NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2U5ZDVmZiIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+Q09NUFJPVkFOVEU8L3RleHQ+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzUiIHgyPSIxODAiIHkyPSI3NSIgc3Ryb2tlPSIjNmIyMWE4IiBzdHJva2Utd2lkdGg9IjEiLz4KICA8dGV4dCB4PSIzMCIgeT0iOTYiIGZpbGw9IiNjNGI1ZmQiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOSI+UGFnYW1lbnRvIGNvbmZpcm1hZG88L3RleHQ+CiAgPHRleHQgeD0iMzAiIHk9IjExNiIgZmlsbD0iI2E3OGJmYSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSI4Ij5WYWxvcjogUiQgKioqLCoqPC90ZXh0PgogIDx0ZXh0IHg9IjMwIiB5PSIxMzYiIGZpbGw9IiNhNzhiZmEiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOCI+RGF0YTogKiovKiovKioqKjwvdGV4dD4KICA8dGV4dCB4PSIzMCIgeT0iMTU2IiBmaWxsPSIjYTc4YmZhIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjgiPlN0YXR1czogQXByb3ZhZG88L3RleHQ+CiAgPGxpbmUgeDE9IjIwIiB5MT0iMTcwIiB4Mj0iMTgwIiB5Mj0iMTcwIiBzdHJva2U9IiM2YjIxYTgiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCAyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjIxYTgiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOCI+LS0tIHJlY2libyBkaWdpdGFsIC0tLTwvdGV4dD4KPC9zdmc+' },
  { expenseId: 7, memberName: 'Ana Oliveira', status: 'approved', paidAt: '2026-05-30', approvedBy: 'Ana Oliveira', receiptBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjgwIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgcng9IjgiIGZpbGw9IiMxZTFiNGIiLz4KICA8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxODAiIGhlaWdodD0iMjYwIiByeD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTc4YmZhIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjNGMxZDk1Ii8+CiAgPHRleHQgeD0iMTAwIiB5PSI0NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2U5ZDVmZiIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+Q09NUFJPVkFOVEU8L3RleHQ+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzUiIHgyPSIxODAiIHkyPSI3NSIgc3Ryb2tlPSIjNmIyMWE4IiBzdHJva2Utd2lkdGg9IjEiLz4KICA8dGV4dCB4PSIzMCIgeT0iOTYiIGZpbGw9IiNjNGI1ZmQiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOSI+UGFnYW1lbnRvIGNvbmZpcm1hZG88L3RleHQ+CiAgPHRleHQgeD0iMzAiIHk9IjExNiIgZmlsbD0iI2E3OGJmYSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSI4Ij5WYWxvcjogUiQgKioqLCoqPC90ZXh0PgogIDx0ZXh0IHg9IjMwIiB5PSIxMzYiIGZpbGw9IiNhNzhiZmEiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOCI+RGF0YTogKiovKiovKioqKjwvdGV4dD4KICA8dGV4dCB4PSIzMCIgeT0iMTU2IiBmaWxsPSIjYTc4YmZhIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjgiPlN0YXR1czogQXByb3ZhZG88L3RleHQ+CiAgPGxpbmUgeDE9IjIwIiB5MT0iMTcwIiB4Mj0iMTgwIiB5Mj0iMTcwIiBzdHJva2U9IiM2YjIxYTgiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCAyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjIxYTgiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOCI+LS0tIHJlY2libyBkaWdpdGFsIC0tLTwvdGV4dD4KPC9zdmc+' },
  { expenseId: 10, memberName: 'Carlos Silva', status: 'approved', paidAt: '2026-06-02', approvedBy: 'Pedro Santos', receiptBase64: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjgwIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI4MCIgcng9IjgiIGZpbGw9IiMxZTFiNGIiLz4KICA8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxODAiIGhlaWdodD0iMjYwIiByeD0iNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYTc4YmZhIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8cmVjdCB4PSIyMCIgeT0iMjAiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjNGMxZDk1Ii8+CiAgPHRleHQgeD0iMTAwIiB5PSI0NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2U5ZDVmZiIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+Q09NUFJPVkFOVEU8L3RleHQ+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzUiIHgyPSIxODAiIHkyPSI3NSIgc3Ryb2tlPSIjNmIyMWE4IiBzdHJva2Utd2lkdGg9IjEiLz4KICA8dGV4dCB4PSIzMCIgeT0iOTYiIGZpbGw9IiNjNGI1ZmQiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOSI+UGFnYW1lbnRvIGNvbmZpcm1hZG88L3RleHQ+CiAgPHRleHQgeD0iMzAiIHk9IjExNiIgZmlsbD0iI2E3OGJmYSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSI4Ij5WYWxvcjogUiQgKioqLCoqPC90ZXh0PgogIDx0ZXh0IHg9IjMwIiB5PSIxMzYiIGZpbGw9IiNhNzhiZmEiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOCI+RGF0YTogKiovKiovKioqKjwvdGV4dD4KICA8dGV4dCB4PSIzMCIgeT0iMTU2IiBmaWxsPSIjYTc4YmZhIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjgiPlN0YXR1czogQXByb3ZhZG88L3RleHQ+CiAgPGxpbmUgeDE9IjIwIiB5MT0iMTcwIiB4Mj0iMTgwIiB5Mj0iMTcwIiBzdHJva2U9IiM2YjIxYTgiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCAyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjIxYTgiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iOCI+LS0tIHJlY2libyBkaWdpdGFsIC0tLTwvdGV4dD4KPC9zdmc+' },
  { expenseId: 10, memberName: 'Pedro Santos', status: 'approved', paidAt: '2026-06-01', approvedBy: 'Pedro Santos' },
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

const MOCK_GROUPS: Group[] = [
  { id: 1, name: 'República Solaris', description: 'Republica estudantil focada em sustentabilidade e organização coletiva.', members: 12, monthlyFee: 450, cnpj: '11.222.333/0001-81', cep: '01310-100' },
  { id: 2, name: 'Casa do Estudante', description: 'Moradia estudantil próxima à universidade com 8 moradores.', members: 8, monthlyFee: 320, cnpj: '', cep: '' },
  { id: 3, name: 'Alojamento Universitário', description: '', members: 5, monthlyFee: 280, cnpj: '', cep: '' },
  { id: 4, name: 'República Bela Vista', description: 'Casa ampla com vista para o campus, 10 moradores.', members: 10, monthlyFee: 520, cnpj: '', cep: '' },
  { id: 5, name: 'Pensionato Central', description: '', members: 6, monthlyFee: 390, cnpj: '', cep: '' },
  { id: 6, name: 'Kitnet Compartilhada', description: '', members: 4, monthlyFee: 250, cnpj: '', cep: '' },
  { id: 7, name: 'Casa da Praia', description: '', members: 7, monthlyFee: 600, cnpj: '', cep: '' },
  { id: 8, name: 'República Aurora', description: '', members: 9, monthlyFee: 410, cnpj: '', cep: '' },
  { id: 9, name: 'Alojamento Rural', description: '', members: 3, monthlyFee: 200, cnpj: '', cep: '' },
  { id: 10, name: 'Vila Estudantil', description: '', members: 15, monthlyFee: 350, cnpj: '', cep: '' },
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

  private readonly membersSignal = signal<Membro[]>([...MEMBROS_INICIAIS]);
  readonly members = this.membersSignal.asReadonly();

  private readonly expensesSignal = signal<Expense[]>([...MOCK_EXPENSES]);
  readonly expenses = this.expensesSignal.asReadonly();

  private readonly paymentsSignal = signal<Payment[]>([...MOCK_PAYMENTS]);
  readonly payments = this.paymentsSignal.asReadonly();

  readonly tasks = signal<Task[]>([...MOCK_TASKS]);

  readonly historicalExpenses = [...MOCK_HISTORICAL_EXPENSES];

  readonly residents = [
    { name: 'Carlos Silva', owes: 150, toReceive: 0 },
    { name: 'Ana Oliveira', owes: 0, toReceive: 200 },
    { name: 'Pedro Santos', owes: 80, toReceive: 50 },
    { name: 'Mariana Costa', owes: 0, toReceive: 120 },
    { name: 'João Pereira', owes: 300, toReceive: 0 },
  ];

  readonly groupsSignal = signal<Group[]>([...MOCK_GROUPS]);
  readonly groups = this.groupsSignal.asReadonly();

  createGroup(data: { name: string; description: string; currency: string; imagemBase64: string; cnpj: string; cep: string }): number {
    const newId = Math.max(...this.groupsSignal().map(g => g.id), 0) + 1;
    this.groupsSignal.update(list => [...list, {
      id: newId,
      name: data.name,
      description: data.description,
      members: 1,
      monthlyFee: 0,
      cnpj: data.cnpj || '',
      cep: data.cep || '',
      imagemBase64: data.imagemBase64 || undefined,
    }]);
    return newId;
  }

  getGroupById(id: number): Group | undefined {
    return this.groupsSignal().find(g => g.id === id);
  }

  joinGroup(groupId: number): boolean {
    const group = this.groupsSignal().find(g => g.id === groupId);
    if (!group) return false;
    const alreadyMember = this.membersSignal().some(m => m.nome === this.CURRENT_USER);
    if (!alreadyMember) {
      this.membersSignal.update(list => [...list, {
        nome: this.CURRENT_USER,
        telefone: '(11) 99999-0001',
        email: 'carlos.silva@email.com',
        documento: '',
        dataNascimento: '',
        cep: '',
        admin: false,
      }]);
    }
    this.groupsSignal.update(list =>
      list.map(g => g.id === groupId ? { ...g, members: g.members + 1 } : g)
    );
    return true;
  }

  isMember(groupId: number, name: string): boolean {
    return this.membersSignal().some(m => m.nome === name);
  }

  updateGroup(id: number, data: { name: string; description: string; imagemBase64?: string }): void {
    this.groupsSignal.update(list =>
      list.map(g => g.id === id ? { ...g, name: data.name, description: data.description, imagemBase64: data.imagemBase64 ?? g.imagemBase64 } : g)
    );
  }

  hasPendingDebts(name: string): boolean {
    for (const expense of this.expensesSignal()) {
      if (expense.paidBy === name) continue;
      const isInSplit = expense.splitValues.some(sv => sv.name === name);
      if (!isInSplit) continue;
      const payment = this.paymentsSignal().find(p => p.expenseId === expense.id && p.memberName === name);
      if (!payment || payment.status !== 'approved') return true;
    }
    return false;
  }

  hasPendingTasks(name: string): boolean {
    return this.tasks().some(t => t.assignedTo === name && t.status !== 'done');
  }

  getOldestMember(excludeName?: string): Membro | undefined {
    const list = excludeName
      ? this.membersSignal().filter(m => m.nome !== excludeName)
      : this.membersSignal();
    return list[0];
  }

  removeMember(name: string): void {
    this.membersSignal.update(list => list.filter(m => m.nome !== name));
  }

  promoteToAdmin(name: string): void {
    this.membersSignal.update(list =>
      list.map(m => m.nome === name ? { ...m, admin: true } : m)
    );
  }

  updatePhone(name: string, phone: string): void {
    this.membersSignal.update(list =>
      list.map(m => m.nome === name ? { ...m, telefone: phone } : m)
    );
  }

  updateEmail(name: string, email: string): void {
    this.membersSignal.update(list =>
      list.map(m => m.nome === name ? { ...m, email } : m)
    );
  }

  updatePhoto(name: string, photoBase64: string): void {
    this.membersSignal.update(list =>
      list.map(m => m.nome === name ? { ...m, fotoBase64: photoBase64 } : m)
    );
  }
}

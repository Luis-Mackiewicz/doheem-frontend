import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface ResidentBalance {
  name: string;
  owes: number;
  toReceive: number;
}

export interface BalanceSummary {
  youOwe: number;
  youReceive: number;
  totalDebt: number;
  residents: ResidentBalance[];
}

@Injectable({ providedIn: 'root' })
export class GroupStoreService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private groupIdSignal = signal<number>(0);
  readonly groupId = this.groupIdSignal.asReadonly();

  readonly group = signal<any>(undefined);
  readonly groupLoading = signal(false);
  readonly members = signal<any[]>([]);
  readonly membersLoading = signal(false);
  readonly expenses = signal<any[]>([]);
  readonly expensesLoading = signal(false);
  readonly tasks = signal<any[]>([]);
  readonly tasksLoading = signal(false);

  readonly currentUser = computed(() => this.auth.currentUser()?.name ?? '');

  readonly categories = [
    { value: 'aluguel', label: 'Aluguel' },
    { value: 'energia', label: 'Energia' },
    { value: 'internet', label: 'Internet' },
    { value: 'agua', label: 'Água' },
    { value: 'compras', label: 'Compras' },
    { value: 'limpeza', label: 'Limpeza' },
    { value: 'outros', label: 'Outros' },
  ];

  readonly memberNames = computed(() =>
    this.members().map((m: any) => m.nome ?? m.name ?? '')
  );

  readonly adminUser = computed(() => {
    const admins = this.members().filter((m: any) => m.admin === true);
    return admins.length > 0 ? (admins[0].nome ?? admins[0].name) : '';
  });

  readonly balanceSummary = computed((): BalanceSummary => {
    const expenses = this.expenses();
    const allMembers = this.members();
    const currentUser = this.currentUser();

    const map = new Map<string, ResidentBalance>();
    for (const m of allMembers) {
      const name = m.nome ?? m.name ?? '';
      map.set(name, { name, owes: 0, toReceive: 0 });
    }

    let youOwe = 0;
    let youReceive = 0;
    let totalDebt = 0;

    for (const exp of expenses) {
      const payer = exp.paidBy;
      const splits = exp.splitValues ?? [];
      const payments = exp.payments ?? [];

      for (const sv of splits) {
        if (sv.name === payer) continue;

        const payment = payments.find((p: any) =>
          (p.memberName === sv.name || p.memberName === sv.name) &&
          p.status === 'approved'
        );

        if (!payment) {
          const owesAmount = sv.value;
          totalDebt += owesAmount;

          const resident = map.get(sv.name);
          if (resident) resident.owes += owesAmount;

          const payerResident = map.get(payer);
          if (payerResident) payerResident.toReceive += owesAmount;

          if (sv.name === currentUser) youOwe += owesAmount;
          if (payer === currentUser) youReceive += owesAmount;
        }
      }
    }

    return { youOwe, youReceive, totalDebt, residents: [...map.values()] };
  });

  readonly recentExpenses = computed(() =>
    [...this.expenses()]
      .sort((a: any, b: any) => String(b.competenceDate ?? '').localeCompare(String(a.competenceDate ?? '')))
      .slice(0, 5)
  );

  readonly pendingTasks = computed(() =>
    this.tasks()
      .filter((t: any) => t.status !== 'done')
      .slice(0, 4)
  );

  setGroupId(id: number): void {
    this.groupIdSignal.set(id);
    if (id) this.fetchAll(id);
  }

  private fetchAll(groupId: number): void {
    this.groupLoading.set(true);
    this.http.get<any>(`${environment.apiUrl}/groups/${groupId}`).subscribe({
      next: res => this.group.set(res),
      error: () => this.group.set(undefined),
      complete: () => this.groupLoading.set(false),
    });

    this.membersLoading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/groups/${groupId}/members`).subscribe({
      next: res => {
        const data = Array.isArray(res) ? res : (res as any)?.data ?? [];
        this.members.set(data);
      },
      error: () => this.members.set([]),
      complete: () => this.membersLoading.set(false),
    });

    this.expensesLoading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/groups/${groupId}/expenses`).subscribe({
      next: res => {
        const data = Array.isArray(res) ? res : (res as any)?.data ?? [];
        this.expenses.set(data);
      },
      error: () => this.expenses.set([]),
      complete: () => this.expensesLoading.set(false),
    });

    this.tasksLoading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/groups/${groupId}/tasks`).subscribe({
      next: res => {
        const data = Array.isArray(res) ? res : (res as any)?.data ?? [];
        this.tasks.set(data);
      },
      error: () => this.tasks.set([]),
      complete: () => this.tasksLoading.set(false),
    });
  }
}

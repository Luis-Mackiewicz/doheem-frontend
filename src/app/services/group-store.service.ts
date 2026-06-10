import { Injectable, inject, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
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
  private auth = inject(AuthService);

  private groupIdSignal = signal<number>(0);
  readonly groupId = this.groupIdSignal.asReadonly();

  private groupReq = httpResource<any>(() =>
    this.groupId() ? `${environment.apiUrl}/groups/${this.groupId()}` : undefined
  );
  readonly group = this.groupReq.value;
  readonly groupLoading = this.groupReq.isLoading;

  private membersReq = httpResource<any[]>(() =>
    this.groupId() ? `${environment.apiUrl}/groups/${this.groupId()}/members` : undefined
  );
  readonly members = computed<any[]>(() => {
    const val = this.membersReq.value();
    if (Array.isArray(val)) return val;
    return (val as any)?.data ?? [];
  });
  readonly membersLoading = this.membersReq.isLoading;

  private expensesReq = httpResource<any[]>(() =>
    this.groupId() ? `${environment.apiUrl}/groups/${this.groupId()}/expenses` : undefined
  );
  readonly expenses = computed<any[]>(() => {
    const val = this.expensesReq.value();
    if (Array.isArray(val)) return val;
    return (val as any)?.data ?? [];
  });
  readonly expensesLoading = this.expensesReq.isLoading;

  private tasksReq = httpResource<any[]>(() =>
    this.groupId() ? `${environment.apiUrl}/groups/${this.groupId()}/tasks` : undefined
  );
  readonly tasks = computed<any[]>(() => {
    const val = this.tasksReq.value();
    if (Array.isArray(val)) return val;
    return (val as any)?.data ?? [];
  });
  readonly tasksLoading = this.tasksReq.isLoading;

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
  }
}

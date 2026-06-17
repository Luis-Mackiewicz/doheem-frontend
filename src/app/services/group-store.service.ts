import { Injectable, inject, computed, signal, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, of } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);

  private groupIdSignal = signal<string>('');
  readonly groupId = this.groupIdSignal.asReadonly();

  readonly group = signal<any>(undefined);
  readonly groupLoading = signal(false);
  readonly members = signal<any[]>([]);
  readonly membersLoading = signal(false);
  readonly expenses = signal<any[]>([]);
  readonly expensesLoading = signal(false);
  readonly expensesTotal = signal(0);
  readonly monthExpenses = signal<any[]>([]);
  readonly monthExpensesLoading = signal(false);
  readonly monthExpensesTotal = signal(0);

  readonly normalizedExpenses = computed(() => {
    const members = this.members();
    const uuidToName = new Map<string, string>();
    for (const m of members) {
      uuidToName.set(m.user_id, m.nome ?? m.name);
    }
    const idToSlug = this.categoryIdToSlug();
    return this.expenses().map((e: any) => ({
      ...e,
      category: idToSlug[e.category_id] ?? e.category_id ?? e.category,
      paidBy: uuidToName.get(e.paid_by) ?? e.paid_by ?? e.paidBy,
      competenceDate: e.competence_date ?? e.competenceDate,
      dueDate: e.due_date ?? e.dueDate,
      splitMode: e.split_mode ?? e.splitMode,
      splitValues: Array.isArray(e.splits) ? e.splits.map((s: any) => ({
        id: s.id,
        name: s.user_name,
        value: s.amount,
        is_paid: s.is_paid ?? false,
        receipt_data: s.receipt_data,
        receipt_type: s.receipt_type,
        receipt_file_name: s.receipt_file_name,
      })) : [],
      createdBy: e.created_by ?? e.createdBy,
      installmentGroup: e.installment_index ? { index: e.installment_index, total: e.installment_total } : undefined,
      fixed: e.is_fixed ?? e.fixed,
    }));
  });

  readonly normalizedMonthExpenses = computed(() => {
    const members = this.members();
    const uuidToName = new Map<string, string>();
    for (const m of members) {
      uuidToName.set(m.user_id, m.nome ?? m.name);
    }
    const idToSlug = this.categoryIdToSlug();
    return this.monthExpenses().map((e: any) => ({
      ...e,
      category: idToSlug[e.category_id] ?? e.category_id ?? e.category,
      paidBy: uuidToName.get(e.paid_by) ?? e.paid_by ?? e.paidBy,
      competenceDate: e.competence_date ?? e.competenceDate,
      dueDate: e.due_date ?? e.dueDate,
      splitMode: e.split_mode ?? e.splitMode,
      splitValues: Array.isArray(e.splits) ? e.splits.map((s: any) => ({
        id: s.id,
        name: s.user_name,
        value: s.amount,
        is_paid: s.is_paid ?? false,
        receipt_data: s.receipt_data,
        receipt_type: s.receipt_type,
        receipt_file_name: s.receipt_file_name,
      })) : [],
      createdBy: e.created_by ?? e.createdBy,
      installmentGroup: e.installment_index ? { index: e.installment_index, total: e.installment_total } : undefined,
      fixed: e.is_fixed ?? e.fixed,
    }));
  });
  readonly tasks = signal<any[]>([]);
  readonly tasksLoading = signal(false);

  readonly currentUser = computed(() => this.auth.currentUser()?.name ?? '');

  readonly slugToCategoryId = signal<Record<string, string>>({});
  readonly categoryIdToSlug = signal<Record<string, string>>({});

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
    const expenses = this.normalizedExpenses();
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

      for (const sv of splits) {
        if (sv.is_paid) continue;

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

    return { youOwe, youReceive, totalDebt, residents: [...map.values()] };
  });

  readonly recentExpenses = computed(() =>
    [...this.normalizedExpenses()]
      .sort((a: any, b: any) => String(b.competenceDate ?? '').localeCompare(String(a.competenceDate ?? '')))
      .slice(0, 5)
  );

  readonly pendingTasks = computed(() => {
    const members = this.members();
    return this.tasks()
      .filter((t: any) => t.status !== 'done')
      .map((t: any) => ({
        ...t,
        assignedTo: members.find((m: any) => m.user_id === t.assignedTo)?.nome ?? t.assignedTo,
      }))
      .slice(0, 4);
  });

  private searchDebouncer = new Subject<{ limit: number; offset: number; search: string; dateFrom: string; dateTo: string; myExpenses: boolean }>();

  refreshExpenses(limit: number, offset: number, search = '', dateFrom = '', dateTo = '', myExpenses = false): void {
    this.searchDebouncer.next({ limit, offset, search, dateFrom, dateTo, myExpenses });
  }

  private initDebounce(): void {
    this.searchDebouncer.pipe(
      switchMap(({ limit, offset, search, dateFrom, dateTo, myExpenses }) => {
        const groupId = this.groupIdSignal();
        if (!groupId) return of(null);
        this.expensesLoading.set(true);
        let url = `${environment.apiUrl}/groups/${groupId}/expenses?limit=${limit}&offset=${offset}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (dateFrom) url += `&competence_date_from=${dateFrom}`;
        if (dateTo) url += `&competence_date_to=${dateTo}`;
        if (myExpenses) url += `&my_expenses=true`;
        return this.http.get<any>(url);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: res => {
        if (res && res?.data !== undefined && res?.total !== undefined) {
          this.expenses.set(res.data);
          this.expensesTotal.set(res.total);
        }
        this.expensesLoading.set(false);
      },
      error: () => this.expensesLoading.set(false),
    });
  }

  refreshExpensesByMonth(year: number, month: number): void {
    const groupId = this.groupIdSignal();
    if (!groupId) return;
    this.monthExpensesLoading.set(true);
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    const url = `${environment.apiUrl}/groups/${groupId}/expenses?competence_date_from=${from}&competence_date_to=${to}&limit=500&offset=0`;
    this.http.get<any>(url).subscribe({
      next: res => {
        if (res?.data !== undefined && res?.total !== undefined) {
          this.monthExpenses.set(res.data);
          this.monthExpensesTotal.set(res.total);
        } else {
          const data = Array.isArray(res) ? res : [];
          this.monthExpenses.set(data);
          this.monthExpensesTotal.set(data.length);
        }
      },
      error: () => this.monthExpenses.set([]),
      complete: () => this.monthExpensesLoading.set(false),
    });
  }

  private lastFetchedGroupId = '';

  setGroupId(id: string): void {
    this.groupIdSignal.set(id);
    if (id && id !== this.lastFetchedGroupId) {
      this.lastFetchedGroupId = id;
      this.fetchAll(id);
    }
  }

  private fetchAll(groupId: string): void {
    this.initDebounce();

    this.groupLoading.set(true);
    this.http.get<any>(`${environment.apiUrl}/groups/${groupId}`).subscribe({
      next: res => this.group.set(res),
      error: () => this.group.set(undefined),
      complete: () => this.groupLoading.set(false),
    });

    this.membersLoading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/groups/${groupId}/members`).subscribe({
      next: res => {
        const raw = Array.isArray(res) ? res : (res as any)?.data ?? [];
        this.members.set(raw.map((m: any) => ({
          id: m.id,
          user_id: m.user_id ?? '',
          nome: m.user_name ?? m.nome ?? m.name ?? '',
          email: m.user_email ?? m.email ?? '',
          telefone: m.user_phone ?? m.telefone ?? '',
          admin: m.is_admin ?? m.admin ?? false,
          fotoBase64: m.avatar_url ?? m.foto_base64 ?? m.fotoBase64 ?? '',
        })));
      },
      error: () => this.members.set([]),
      complete: () => this.membersLoading.set(false),
    });

    this.http.get<any>(`${environment.apiUrl}/categories`).subscribe({
      next: res => {
        const data = Array.isArray(res) ? res : res?.data ?? [];
        const slugToId: Record<string, string> = {};
        const idToSlug: Record<string, string> = {};
        for (const c of data) {
          slugToId[c.slug] = c.id;
          idToSlug[c.id] = c.slug;
        }
        this.slugToCategoryId.set(slugToId);
        this.categoryIdToSlug.set(idToSlug);
      },
    });

    this.tasksLoading.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/groups/${groupId}/tasks`).subscribe({
      next: res => {
        const data = Array.isArray(res) ? res : (res as any)?.data ?? [];
        this.tasks.set(data.map((t: any) => ({
          ...t,
          dueDate: t.due_date ?? t.dueDate,
          assignedTo: t.assigned_to ?? t.assignedTo,
        })));
      },
      error: () => this.tasks.set([]),
      complete: () => this.tasksLoading.set(false),
    });
  }
}

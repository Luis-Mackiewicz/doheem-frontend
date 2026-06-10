import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  category: string;
  competenceDate: string;
  dueDate: string;
  paidBy: string;
  splitMode: string;
  splitValues: { name: string; value: number }[];
  installments: number;
  firstDueDate: string;
  fixed: boolean;
}

export interface UpdateExpenseRequest {
  description?: string;
  amount?: number;
  category?: string;
  dueDate?: string;
}

export interface CreateCategoryRequest {
  name: string;
  label: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  label?: string;
}

@Injectable({ providedIn: 'root' })
export class ExpensesApiService {
  private http = inject(HttpClient);

  listByGroup(groupId: string) {
    return httpResource<any[]>(() => `${environment.apiUrl}/groups/${groupId}/expenses`);
  }

  getById(id: string) {
    return httpResource<any>(() => `${environment.apiUrl}/expenses/${id}`);
  }

  create(groupId: string, data: CreateExpenseRequest) {
    return this.http.post<any>(`${environment.apiUrl}/groups/${groupId}/expenses`, data);
  }

  update(id: number, data: UpdateExpenseRequest) {
    return this.http.put<any>(`${environment.apiUrl}/expenses/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/expenses/${id}`);
  }

  getSplits(expenseId: number) {
    return httpResource<any[]>(() => `${environment.apiUrl}/expenses/${expenseId}/splits`);
  }

  markSplitAsPaid(splitId: number) {
    return this.http.patch<any>(`${environment.apiUrl}/expenses/splits/${splitId}/pay`, {});
  }

  getInstallments(expenseId: number) {
    return httpResource<any[]>(() => `${environment.apiUrl}/expenses/${expenseId}/installments`);
  }

  listCategories() {
    return httpResource<any[]>(() => `${environment.apiUrl}/categories`);
  }

  createCategory(data: CreateCategoryRequest) {
    return this.http.post<any>(`${environment.apiUrl}/categories`, data);
  }

  updateCategory(id: number, data: UpdateCategoryRequest) {
    return this.http.put<any>(`${environment.apiUrl}/categories/${id}`, data);
  }

  deleteCategory(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/categories/${id}`);
  }
}

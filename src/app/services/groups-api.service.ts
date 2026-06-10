import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CreateGroupRequest {
  name: string;
  description: string;
  currency: string;
  imagemBase64: string;

}

export interface UpdateGroupRequest {
  name: string;
  description: string;
  imagemBase64?: string;
}

export interface AddMemberRequest {
  name: string;
  email: string;
}

export interface UpdateMemberRoleRequest {
  is_admin: boolean;
}

@Injectable({ providedIn: 'root' })
export class GroupsApiService {
  private http = inject(HttpClient);

  readonly list = httpResource<any[]>(() => `${environment.apiUrl}/groups`);

  getById(id: string) {
    return httpResource<any>(() => `${environment.apiUrl}/groups/${id}`);
  }

  create(data: CreateGroupRequest) {
    return this.http.post<any>(`${environment.apiUrl}/groups`, data);
  }

  update(id: string, data: UpdateGroupRequest) {
    return this.http.put<any>(`${environment.apiUrl}/groups/${id}`, data);
  }

  getMembers(groupId: string) {
    return httpResource<any[]>(() => `${environment.apiUrl}/groups/${groupId}/members`);
  }

  addMember(groupId: string, data: AddMemberRequest) {
    return this.http.post<any>(`${environment.apiUrl}/groups/${groupId}/members`, data);
  }

  updateMemberRole(groupId: string, userId: string, data: UpdateMemberRoleRequest) {
    return this.http.put<any>(`${environment.apiUrl}/groups/${groupId}/members/${userId}`, data);
  }

  removeMember(groupId: string, userId: string) {
    return this.http.delete<void>(`${environment.apiUrl}/groups/${groupId}/members/${userId}`);
  }

  join(groupId: string) {
    return this.http.post<any>(`${environment.apiUrl}/groups/${groupId}/join`, {});
  }

  regenerateInvite(groupId: string) {
    return this.http.post<any>(`${environment.apiUrl}/groups/${groupId}/regenerate-invite`, {});
  }

  getInviteToken(groupId: string) {
    return httpResource<string>(() => `${environment.apiUrl}/groups/${groupId}/invite-token`);
  }
}

import { Component, inject, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GroupsApiService } from '../../services/groups-api.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../services/notification-service';
import { ButtonComponent } from '../../components/button/button';
import { LucideHome, LucideUsers, LucideLoader } from '@lucide/angular';

@Component({
  selector: 'app-join-group',
  imports: [RouterLink, ButtonComponent, LucideHome, LucideUsers, LucideLoader],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-page transition-colors duration-150">
      <div class="max-w-7xl mx-auto w-full flex justify-center px-6 md:px-16 lg:px-24 py-24">

        <div class="w-full max-w-md rounded-3xl bg-card border-theme shadow-2xl p-8 md:p-10">

          <a routerLink="/groups" aria-label="Voltar" class="text-secondary hover-text-primary text-sm flex items-center gap-1.5 mb-6 transition cursor-pointer">
            ← Voltar para grupos
          </a>

          @if (loading()) {
            <div class="flex flex-col items-center justify-center py-12 gap-3">
              <svg lucideLoader class="w-8 h-8 text-muted animate-spin"></svg>
              <p class="text-muted text-sm">Carregando...</p>
            </div>
          } @else if (error()) {
            <div class="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div class="w-16 h-16 rounded-2xl badge-rose flex items-center justify-center">
                <svg lucideHome class="w-8 h-8"></svg>
              </div>
              <p class="text-primary font-semibold text-lg">Grupo não encontrado</p>
              <p class="text-secondary text-sm">Esse link de convite pode estar expirado ou o grupo não existe mais.</p>
              <app-button type="button" variant="solid" label="Ver grupos disponíveis" (click)="goToGroups()" />
            </div>
          } @else if (group(); as g) {
            <div class="flex flex-col items-center text-center gap-4">
              @if (g.imagemBase64) {
                <img [src]="g.imagemBase64" alt="" class="w-20 h-20 rounded-2xl object-cover border border-theme" />
              } @else {
                <div class="w-20 h-20 rounded-2xl badge-purple flex items-center justify-center">
                  <svg lucideHome class="w-10 h-10"></svg>
                </div>
              }

              <div>
                <h2 class="text-2xl font-bold text-primary">{{ g.name }}</h2>
                @if (g.description) {
                  <p class="text-secondary text-sm mt-1">{{ g.description }}</p>
                }
              </div>

              <div class="flex items-center gap-2 text-secondary text-sm">
                <svg lucideUsers class="w-4 h-4"></svg>
                <span>{{ g.members }} membros</span>
              </div>

              <div class="w-full border-t border-theme pt-6 mt-2">
                <app-button type="button" variant="solid" label="Entrar no grupo" (click)="join()" />
              </div>
            </div>
          }

        </div>

      </div>
    </section>
  `,
})
export class JoinGroupPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private groupsApi = inject(GroupsApiService);
  private auth = inject(AuthService);
  private notif = inject(NotificationService);

  protected readonly groupId = Number(this.route.snapshot.paramMap.get('id'));

  private groupReq = httpResource<any>(() =>
    this.groupId ? `${environment.apiUrl}/groups/${this.groupId}` : undefined
  );
  protected readonly group = this.groupReq.value;
  protected readonly loading = this.groupReq.isLoading;
  protected readonly error = computed(() =>
    !this.groupId || (this.groupReq.isLoading() === false && !this.groupReq.value())
  );

  join(): void {
    const g = this.group();
    if (!g) return;
    this.groupsApi.join(g.id).subscribe({
      next: () => {
        this.notif.add('success', 'Bem-vindo!', `Você entrou no grupo "${g.name}"!`, this.auth.currentUser()?.name ?? '');
        this.router.navigate([`/groups/${g.id}/dashboard`]);
      },
    });
  }

  goToGroups(): void {
    this.router.navigate(['/groups']);
  }
}

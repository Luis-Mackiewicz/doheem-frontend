import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { GroupsPage } from './pages/groups/groups';
import { PerfilPage } from './pages/profile/profile';
import { NotFoundPage } from './pages/not-found/not-found';
import { GroupLayoutComponent } from './pages/group-layout/group-layout';
import { DashboardPage } from './pages/dashboard/dashboard';
import { FinanceiroPage } from './pages/financial/financial';
import { TarefasPage } from './pages/tasks/tasks';
import { HistoricoPage } from './pages/historical/historical';
import { NotificacoesPage } from './pages/notifications/notifications';
import { MembrosPage } from './pages/members/members';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'groups', component: GroupsPage },
  { path: 'perfil', component: PerfilPage },
  {
    path: 'groups/:id',
    component: GroupLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'financeiro', component: FinanceiroPage },
      { path: 'tarefas', component: TarefasPage },
      { path: 'historico', component: HistoricoPage },
      { path: 'notificacoes', component: NotificacoesPage },
      { path: 'membros', component: MembrosPage },
    ],
  },
  { path: '**', component: NotFoundPage },
];

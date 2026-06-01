import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';
import { GroupsPage } from './pages/groups/groups';
import { PerfilPage } from './pages/perfil/perfil';
import { NotFoundPage } from './pages/not-found/not-found';
import { GroupLayoutComponent } from './pages/group-layout/group-layout';
import { DashboardPage } from './pages/dashboard/dashboard';
import { FinanceiroPage } from './pages/financeiro/financeiro';
import { TarefasPage } from './pages/tarefas/tarefas';
import { HistoricoPage } from './pages/historico/historico';
import { NotificacoesPage } from './pages/notificacoes/notificacoes';

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
    ],
  },
  { path: '**', component: NotFoundPage },
];

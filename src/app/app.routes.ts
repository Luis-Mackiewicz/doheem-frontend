import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomePage) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterPage) },
  { path: 'groups', loadComponent: () => import('./pages/groups/groups').then(m => m.GroupsPage) },
  { path: 'groups/join/:id', loadComponent: () => import('./pages/join-group/join-group').then(m => m.JoinGroupPage) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.ProfilePage) },
  {
    path: 'groups/:id',
    loadComponent: () => import('./pages/group-layout/group-layout').then(m => m.GroupLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardPage) },
      { path: 'financial', loadComponent: () => import('./pages/financial/financial').then(m => m.FinancialPage) },
      { path: 'tasks', loadComponent: () => import('./pages/tasks/tasks').then(m => m.TasksPage) },
      { path: 'historical', loadComponent: () => import('./pages/historical/historical').then(m => m.HistoricalPage) },
      { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications').then(m => m.NotificationsPage) },
      { path: 'group', loadComponent: () => import('./pages/group/group').then(m => m.GroupPage) },
      { path: 'balances', loadComponent: () => import('./pages/balances/balances').then(m => m.BalancesPage) },
    ],
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundPage) },
];

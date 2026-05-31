import { Routes } from '@angular/router';
import { HomePage } from './home/home';
import { LoginPage } from './login/login';
import { RegisterPage } from './register/register';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
];

import { Routes } from '@angular/router';
import { HomePage } from './home/home';
import { RegisterPage } from './register/register';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'register', component: RegisterPage },
];

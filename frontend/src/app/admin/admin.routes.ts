import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.AdminLogin),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.AdminDashboard),
    canActivate: [authGuard],
  },
];

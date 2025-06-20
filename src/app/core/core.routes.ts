import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const CORE_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((comp) => comp.LoginComponent),
  },
  // {
  //   path: 'dashboard',
  //   canActivate: [authGuard],
  //   loadComponent: () =>
  //     import('./components/dashboard-page/dashboard-page.component').then((comp) => comp.DashboardPageComponent),
  // },
    {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/dashboard-page/dashboard-page.component').then((comp) => comp.DashboardPageComponent),
  },
  {
    path: 'new-account',
    loadComponent: () =>
      import('./components/create-account/create-account.component').then((comp) => comp.CreateAccountComponent),
  },
  {
    path: 'page-not-found',
    loadComponent: () =>
      import('../shared/components/page-not-found/page-not-found.component').then((comp) => comp.PageNotFoundComponent),
  },
  { path: '**', redirectTo: 'page-not-found' },
];
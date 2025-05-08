import { Routes } from '@angular/router';

export const CORE_ROUTES: Routes = [
  {path: '',redirectTo: 'login',pathMatch: 'full'},
  {path :'login', loadComponent: () => import('./components/login/login.component').then((comp)=> comp.LoginComponent)},
  {path :'dashboard' , loadComponent: () => import('./components/dashboard-page/dashboard-page.component').then((comp)=> comp.DashboardPageComponent)},
  {path :'page-not-found' , loadComponent: () => import('../shared/components/page-not-found/page-not-found.component').then((comp)=> comp.PageNotFoundComponent)},
  {path:'new-account',loadComponent:() => import('./components/create-account/create-account.component').then((comp)=> comp.CreateAccountComponent)},
  {path: '**',redirectTo: 'page-not-found'}
];
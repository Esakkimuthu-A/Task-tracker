import { Routes } from '@angular/router';
import { CORE_ROUTES } from './core/core.routes';

export const routes: Routes = [
  { path:'', children: CORE_ROUTES }
];

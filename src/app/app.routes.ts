import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'videogames', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./feature/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'videogames',
    loadComponent: () => import('./feature/videogames/list/list.component').then(m => m.ListComponent)
  },
  {
    path: 'videogames/new',
    loadComponent: () => import('./feature/videogames/form/form.component').then(m => m.FormComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'videogames/:id',
    loadComponent: () => import('./feature/videogames/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: 'videogames/:id/edit',
    loadComponent: () => import('./feature/videogames/form/form.component').then(m => m.FormComponent),
    canActivate: [adminGuard]
  },
  { path: '**', redirectTo: 'videogames' }
];

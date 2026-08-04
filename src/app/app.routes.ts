import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./feature/home/home.component').then(m => m.HomeComponent),
    data: { animation: 'home' }
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login.component').then(m => m.LoginComponent),
    data: { animation: 'auth' }
  },
  {
    path: 'register',
    loadComponent: () => import('./feature/auth/register/register.component').then(m => m.RegisterComponent),
    data: { animation: 'auth' }
  },
  {
    path: 'videogames',
    loadComponent: () => import('./feature/videogames/list/list.component').then(m => m.ListComponent),
    data: { animation: 'list' }
  },
  {
    path: 'videogames/new',
    loadComponent: () => import('./feature/videogames/form/form.component').then(m => m.FormComponent),
    canActivate: [adminGuard],
    data: { animation: 'form' }
  },
  {
    path: 'videogames/:id',
    loadComponent: () => import('./feature/videogames/detail/detail.component').then(m => m.DetailComponent),
    data: { animation: 'detail' }
  },
  {
    path: 'videogames/:id/edit',
    loadComponent: () => import('./feature/videogames/form/form.component').then(m => m.FormComponent),
    canActivate: [adminGuard],
    data: { animation: 'form' }
  },
  {
    path: 'profile',
    loadComponent: () => import('./feature/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    data: { animation: 'profile' }
  },
  { path: '**', redirectTo: '' }
];

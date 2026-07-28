import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthContextService } from '../../services/auth-context.service';
import { AuthService } from '../../../feature/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="header-left">
        @if (authContext.isAuthenticated()) {
          @if (authContext.isAdmin()) {
            <a mat-button routerLink="/videogames/new">
              <mat-icon>add</mat-icon> Nuevo
            </a>
          }
        }
      </div>

      <a routerLink="/" class="logo-gr">GR</a>

      <div class="header-right">
        @if (authContext.isAuthenticated()) {
          <a class="user-info" routerLink="/profile">{{ authContext.getUsername() }}</a>
          <button mat-button (click)="logout()">Cerrar sesion</button>
        } @else {
          <a mat-button routerLink="/login">Iniciar sesion</a>
          <a mat-button routerLink="/register">Registrarse</a>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
    }
    .header-left, .header-right {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .header-right {
      justify-content: flex-end;
    }
    .logo-gr {
      color: inherit;
      text-decoration: none;
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: 0.3em;
      text-shadow: 0 0 10px rgba(255, 113, 206, 0.5);
      transition: text-shadow 0.3s;
    }
    .logo-gr:hover {
      text-shadow: 0 0 20px rgba(255, 113, 206, 0.8), 0 0 40px rgba(1, 205, 254, 0.4);
    }
    .user-info {
      font-size: 0.9rem; opacity: 0.9; margin-right: 4px;
      color: inherit; text-decoration: none; cursor: pointer;
    }
    .user-info:hover { text-decoration: underline; }
  `]
})
export class HeaderComponent {
  authContext = inject(AuthContextService);
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}

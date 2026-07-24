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
      <a routerLink="/videogames" class="logo">GameReview</a>
      <span class="spacer"></span>

      @if (authContext.isAuthenticated()) {
        <span class="user-info">{{ authContext.getUsername() }}</span>
        @if (authContext.isAdmin()) {
          <a mat-button routerLink="/videogames/new">
            <mat-icon>add</mat-icon> Nuevo
          </a>
        }
        <button mat-button (click)="logout()">Cerrar sesion</button>
      } @else {
        <a mat-button routerLink="/login">Iniciar sesion</a>
        <a mat-button routerLink="/register">Registrarse</a>
      }
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar { display: flex; gap: 8px; }
    .logo { color: inherit; text-decoration: none; font-size: 1.3rem; font-weight: 500; }
    .spacer { flex: 1; }
    .user-info { font-size: 0.9rem; opacity: 0.9; margin-right: 8px; }
  `]
})
export class HeaderComponent {
  authContext = inject(AuthContextService);
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}

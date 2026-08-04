import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthContextService } from '../../services/auth-context.service';
import { AuthService } from '../../../feature/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="header-left">
        @if (authContext.isAuthenticated()) {
          @if (authContext.isAdmin()) {
            <a mat-button routerLink="/videogames/new">
              <mat-icon>add</mat-icon> New Game
            </a>
          }
        }
      </div>

      <a routerLink="/" class="logo-gr" aria-label="GameReview home">GR</a>

      <div class="header-right">
        @if (authContext.isAuthenticated()) {
          <a class="user-info" routerLink="/profile">{{ authContext.getUsername() }}</a>
          <button mat-button (click)="logout()">Log out</button>
        } @else {
          <a mat-button routerLink="/login">Log in</a>
          <a mat-button routerLink="/register">Sign up</a>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      background: var(--gr-bg-dark);
      border-bottom: 1px solid var(--gr-surface-border);
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
      font-family: var(--gr-font-display);
      font-size: 1.5rem;
      font-weight: 900;
      letter-spacing: 0.3em;
      text-shadow: 0 0 10px var(--gr-glow-pink);
      transition: text-shadow 0.3s;
    }
    .logo-gr:hover {
      text-shadow: 0 0 20px var(--gr-glow-pink), 0 0 40px var(--gr-glow-cyan);
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

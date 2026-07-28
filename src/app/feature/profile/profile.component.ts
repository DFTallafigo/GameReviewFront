import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../shared/services/user.service';
import { AuthContextService } from '../../shared/services/auth-context.service';
import { UserProfile } from '../../domain/user-profile.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    @if (profile()) {
      <div class="profile-container">
        <mat-card class="profile-card">
          <div class="profile-header">
            <div class="avatar">{{ profile()!.username.charAt(0).toUpperCase() }}</div>
            <div class="profile-info">
              <h1>{{ profile()!.username }}</h1>
              <p class="email">{{ profile()!.email }}</p>
              <div class="meta">
                <span class="role-chip">{{ profile()!.role }}</span>
                <span class="member-since">Miembro desde {{ profile()!.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>
        </mat-card>

        <h2>Mis reviews ({{ profile()!.reviews.length }})</h2>

        <div class="reviews-grid">
          @for (review of profile()!.reviews; track review.videogameId) {
            <mat-card class="review-card">
              @if (review.coverUrl) {
                <img mat-card-image [src]="review.coverUrl" [alt]="review.videogameName" class="cover" />
              } @else {
                <div class="no-cover">
                  <mat-icon>videogame_asset</mat-icon>
                </div>
              }
              <mat-card-header>
                <mat-card-title>
                  <a [routerLink]="['/videogames', review.videogameId]">{{ review.videogameName }}</a>
                </mat-card-title>
                <mat-card-subtitle>{{ review.reviewCreatedAt | date:'mediumDate' }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="score">{{ '★'.repeat(review.score) }}{{ '☆'.repeat(5 - review.score) }} {{ review.score }}/5</p>
                @if (review.completed) {
                  <span class="completed-chip">
                    <mat-icon>check_circle</mat-icon> Completado
                  </span>
                }
                @if (review.comment) {
                  <p class="comment">{{ review.comment }}</p>
                }
              </mat-card-content>
            </mat-card>
          } @empty {
            <p class="no-reviews">Aun no has escrito ninguna review.</p>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .profile-container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .profile-card { margin-bottom: 24px; }
    .profile-header { display: flex; align-items: center; gap: 24px; padding: 24px; }
    .avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: var(--mat-sys-primary); color: var(--mat-sys-on-primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; font-weight: bold; flex-shrink: 0;
    }
    .profile-info h1 { margin: 0 0 4px; }
    .email { margin: 0 0 8px; opacity: 0.7; }
    .meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .role-chip {
      background: var(--mat-sys-secondary-container, #e0e0e0);
      color: var(--mat-sys-on-secondary-container, #333);
      padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 500;
    }
    .member-since { font-size: 0.85rem; opacity: 0.6; }
    .reviews-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;
    }
    .review-card { transition: transform 0.2s; }
    .review-card:hover { transform: translateY(-4px); }
    .cover { height: 160px; object-fit: cover; }
    .no-cover {
      height: 160px; display: flex; align-items: center; justify-content: center;
      background: #f0f0f0;
    }
    .no-cover mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.3; }
    .review-card mat-card-title a {
      color: inherit; text-decoration: none;
    }
    .review-card mat-card-title a:hover { text-decoration: underline; }
    .score { font-size: 1.1rem; color: #f5a623; margin: 8px 0 4px; }
    .completed-chip {
      display: inline-flex; align-items: center; gap: 4px;
      background: var(--mat-sys-primary-container, #e0e0e0);
      color: var(--mat-sys-on-primary-container, #333);
      padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;
    }
    .completed-chip mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .comment { font-size: 0.9rem; opacity: 0.8; margin-top: 8px; }
    .no-reviews { text-align: center; opacity: 0.6; padding: 48px; grid-column: 1 / -1; }
  `]
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authContext = inject(AuthContextService);

  profile = signal<UserProfile | null>(null);

  ngOnInit(): void {
    const username = this.authContext.getUsername();
    if (username) {
      this.userService.getProfile(username).subscribe({
        next: (res) => this.profile.set(res.data)
      });
    }
  }
}

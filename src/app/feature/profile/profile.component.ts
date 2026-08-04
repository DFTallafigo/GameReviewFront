import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../shared/services/user.service';
import { AuthContextService } from '../../shared/services/auth-context.service';
import { UserProfile, UserReview } from '../../domain/user-profile.model';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink, DatePipe, DecimalPipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressBarModule, MatButtonToggleModule, MatSnackBarModule,
    ScrollRevealDirective
  ],
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" class="loading-bar"></mat-progress-bar>
    }

    @if (profile()) {
      <div class="profile-layout">
        <aside class="sidebar" appScrollReveal="left">
          <mat-card class="user-card glass-card">
            <div class="avatar">{{ profile()!.username.charAt(0).toUpperCase() }}</div>
            <h2 class="username">{{ profile()!.username }}</h2>
            <p class="email">{{ profile()!.email }}</p>
            <div class="meta">
              <span class="role-chip">{{ profile()!.role }}</span>
              <span class="member-since">Member since {{ profile()!.createdAt | date:'mediumDate' }}</span>
            </div>

            <div class="stats">
              <div class="stat-item">
                <mat-icon>rate_review</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ totalReviews() }}</span>
                  <span class="stat-label">Reviews</span>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>star</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ averageScore() | number:'1.1-1' }}</span>
                  <span class="stat-label">Average</span>
                </div>
              </div>
              <div class="stat-item">
                <mat-icon>check_circle</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ completedCount() }}</span>
                  <span class="stat-label">Completed</span>
                </div>
              </div>
            </div>
          </mat-card>
        </aside>

        <main class="main-content" appScrollReveal="up" [style.--stagger-index]="'1'">
          <div class="games-header">
            <h2 class="section-title">My Games ({{ filteredGames().length }})</h2>
            <div class="filters">
              <mat-button-toggle-group [value]="filter()" (change)="onFilterChange($event)">
                <mat-button-toggle value="all">All</mat-button-toggle>
                <mat-button-toggle value="completed">Completed</mat-button-toggle>
                <mat-button-toggle value="pending">Pending</mat-button-toggle>
              </mat-button-toggle-group>
            </div>
          </div>

          <div class="games-grid">
            @for (review of filteredGames(); track review.videogameId; let i = $index) {
              <mat-card class="game-card" (click)="goToDetail(review.videogameId)" appScrollReveal="scale" [style.--stagger-index]="'' + (i + 2)">
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
                  <p class="score">
                    @for (star of [1,2,3,4,5]; track star) {
                      <mat-icon class="star" [class.filled]="star <= review.score">
                        {{ star <= review.score ? 'star' : 'star_border' }}
                      </mat-icon>
                    }
                    <span class="score-text">{{ review.score }}/5</span>
                  </p>
                  @if (review.completed) {
                    <span class="completed-chip">
                      <mat-icon>check_circle</mat-icon> Completed
                    </span>
                  } @else {
                    <span class="pending-chip">
                      <mat-icon>schedule</mat-icon> Pending
                    </span>
                  }
                  @if (review.comment) {
                    <p class="comment">{{ review.comment }}</p>
                  }
                </mat-card-content>
              </mat-card>
            } @empty {
              <div class="empty-state">
                <mat-icon class="empty-icon">sports_esports</mat-icon>
                @if (filter() !== 'all') {
                  <p>No {{ filter() === 'completed' ? 'completed' : 'pending' }} games.</p>
                  <button mat-button color="primary" (click)="filter.set('all')">View all</button>
                } @else {
                  <p>You haven't written any reviews yet.</p>
                  <a mat-raised-button color="primary" routerLink="/videogames">Browse games</a>
                }
              </div>
            }
          </div>
        </main>
      </div>
    }
  `,
  styles: [`
    .loading-bar { position: fixed; top: 0; z-index: 1000; }

    .profile-layout {
      display: flex;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }

    .sidebar { flex: 0 0 300px; }

    .user-card {
      padding: 24px;
      position: sticky;
      top: 24px;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gr-accent-pink), var(--gr-accent-cyan));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto 16px;
    }

    .username { margin: 0 0 4px; text-align: center; color: var(--gr-text-primary); }
    .email { margin: 0 0 12px; text-align: center; font-size: var(--gr-text-sm); color: var(--gr-text-muted); }

    .meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .role-chip {
      background: var(--gr-chip-genre-bg);
      color: var(--gr-text-primary);
      padding: 2px 10px;
      border-radius: var(--gr-radius-chip);
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid var(--gr-chip-genre-border);
    }

    .member-since { font-size: var(--gr-text-sm); color: var(--gr-text-muted); }

    .stats {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--gr-border-subtle);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-item mat-icon {
      color: var(--gr-accent-pink);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .stat-content { display: flex; flex-direction: column; }
    .stat-value { font-weight: 600; font-size: 1.1rem; line-height: 1.2; color: var(--gr-text-primary); }
    .stat-label { font-size: 0.75rem; color: var(--gr-text-muted); }

    .main-content { flex: 1; min-width: 0; }

    .games-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 20px;
    }

    .section-title {
      font-family: var(--gr-font-display);
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--gr-text-primary);
      margin: 0;
    }

    .filters { display: flex; gap: 8px; }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .game-card {
      cursor: pointer;
    }

    .cover { height: 160px; object-fit: cover; }

    .no-cover {
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gr-glass2-bg);
    }

    .no-cover mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.3; }

    .game-card mat-card-title a {
      color: var(--gr-text-primary);
      text-decoration: none;
    }

    .game-card mat-card-title a:hover { text-decoration: underline; }

    .game-card mat-card-subtitle { color: var(--gr-text-dim); }

    .score {
      display: flex;
      align-items: center;
      gap: 2px;
      margin: 8px 0 4px;
    }

    .star { font-size: 18px; width: 18px; height: 18px; color: rgba(255, 255, 255, 0.3); }
    .star.filled { color: var(--gr-accent-star); }
    .score-text { margin-left: 8px; font-size: 0.9rem; color: var(--gr-text-secondary); }

    .completed-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: var(--gr-radius-chip);
      font-size: 0.75rem;
      background: var(--gr-chip-platform-bg);
      border: 1px solid var(--gr-chip-platform-border);
      color: var(--gr-text-primary);
    }

    .pending-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: var(--gr-radius-chip);
      font-size: 0.75rem;
      background: rgba(255, 113, 206, 0.15);
      border: 1px solid rgba(255, 113, 206, 0.25);
      color: var(--gr-text-secondary);
    }

    .completed-chip mat-icon, .pending-chip mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .comment {
      font-size: 0.9rem;
      margin-top: 8px;
      color: var(--gr-text-secondary);
    }

    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 64px 24px;
      color: var(--gr-text-muted);
    }

    .empty-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .empty-state p { margin-bottom: 16px; }

    @media (max-width: 768px) {
      .profile-layout { flex-direction: column; }
      .sidebar { flex: none; width: 100%; }
      .user-card { text-align: left; }
      .avatar { margin: 0 0 16px; }
      .username, .email { text-align: left; }
      .meta { justify-content: flex-start; }
      .stats { flex-direction: row; flex-wrap: wrap; }
      .stat-item { flex: 1; min-width: 80px; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly authContext = inject(AuthContextService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  filter = signal<'all' | 'completed' | 'pending'>('all');

  readonly totalReviews = computed(() => this.profile()?.reviews.length ?? 0);

  readonly averageScore = computed(() => {
    const reviews = this.profile()?.reviews;
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length;
  });

  readonly completedCount = computed(() => {
    return this.profile()?.reviews.filter(r => r.completed).length ?? 0;
  });

  readonly filteredGames = computed(() => {
    const reviews = this.profile()?.reviews ?? [];
    const f = this.filter();
    if (f === 'completed') return reviews.filter(r => r.completed);
    if (f === 'pending') return reviews.filter(r => !r.completed);
    return reviews;
  });

  ngOnInit(): void {
    const username = this.authContext.getUsername();
    if (username) {
      this.userService.getProfile(username).subscribe({
        next: (res) => {
          this.profile.set(res.data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.snackBar.open('Failed to load profile', 'Close', { duration: 4000 });
        }
      });
    } else {
      this.loading.set(false);
    }
  }

  goToDetail(id: number): void {
    this.router.navigate(['/videogames', id]);
  }

  onFilterChange(event: any): void {
    this.filter.set(event.value);
  }
}

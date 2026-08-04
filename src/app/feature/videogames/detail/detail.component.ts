import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { VideogameService } from '../videogame.service';
import { ReviewService } from '../../reviews/review.service';
import { VideogameResponse } from '../../../domain/videogame.model';
import { ReviewResponse } from '../../../domain/review.model';
import { AuthContextService } from '../../../shared/services/auth-context.service';
import { ReviewFormComponent } from '../../reviews/review-form/review-form.component';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-detail',
  imports: [
    RouterLink, DecimalPipe, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSnackBarModule, MatDialogModule,
    ScrollRevealDirective
  ],
  template: `
    @if (game()) {
      <div class="detail-container">
        <div class="game-header" appScrollReveal="left">
          @if (game()!.coverUrl) {
            <img [src]="game()!.coverUrl" [alt]="game()!.name + ' cover'" class="cover" />
          } @else {
            <div class="no-cover">
              <mat-icon aria-hidden="true">videogame_asset</mat-icon>
            </div>
          }
          <div class="game-info">
            <h1 class="game-title">{{ game()!.name }}</h1>
            @if (game()!.releaseDate) {
              <p><strong>Release date:</strong> {{ game()!.releaseDate }}</p>
            }
            @if (game()!.metacritic) {
              <p><strong>Metacritic:</strong> {{ game()!.metacritic }}</p>
            }
            @if (game()!.averageRating) {
              <p><strong>User rating:</strong> {{ game()!.averageRating | number:'1.1-1' }}/5 ({{ game()!.totalReviews }} reviews)</p>
            }
            @if (game()!.esrbRating) {
              <p><strong>ESRB:</strong> {{ game()!.esrbRating }}</p>
            }
            @if (game()!.playtime) {
              <p><strong>Playtime:</strong> {{ game()!.playtime }}h</p>
            }
            <div class="chips-section">
              @for (g of game()!.genres; track g) {
                <span class="chip chip--genre">{{ g }}</span>
              }
            </div>
            <div class="chips-section">
              @for (p of game()!.platforms; track p) {
                <span class="chip chip--platform">{{ p }}</span>
              }
            </div>
            <div class="actions">
              @if (authContext.isAdmin()) {
                <a mat-raised-button color="primary" [routerLink]="['/videogames', game()!.id, 'edit']">
                  <mat-icon>edit</mat-icon> Edit
                </a>
                <button mat-raised-button color="warn" (click)="deleteGame()">
                  <mat-icon>delete</mat-icon> Delete
                </button>
              }
              @if (authContext.isAuthenticated()) {
                <button mat-raised-button color="accent" (click)="openReviewDialog()">
                  <mat-icon>rate_review</mat-icon> Write Review
                </button>
              }
            </div>
          </div>
        </div>

        @if (game()!.synopsis) {
          <mat-card class="synopsis-card glass-card" appScrollReveal="up" [style.--stagger-index]="'1'">
            <mat-card-header><mat-card-title>Synopsis</mat-card-title></mat-card-header>
            <mat-card-content><p>{{ game()!.synopsis }}</p></mat-card-content>
          </mat-card>
        }

        <h2 class="section-title" appScrollReveal="up" [style.--stagger-index]="'2'">Reviews</h2>
        @for (review of reviews(); track review.id; let i = $index) {
          <mat-card class="review-card glass-card" appScrollReveal="up" [style.--stagger-index]="'' + (i + 3)">
            <mat-card-header>
              <mat-card-title>{{ review.username }}</mat-card-title>
              <mat-card-subtitle>{{ review.createdAt | date:'medium' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="score" [attr.aria-label]="'Score: ' + review.score + ' out of 5'">{{ '★'.repeat(review.score) }}{{ '☆'.repeat(5 - review.score) }} {{ review.score }}/5</p>
              @if (review.comment) {
                <p>{{ review.comment }}</p>
              }
            </mat-card-content>
          </mat-card>
        } @empty {
          <p class="no-reviews">No reviews yet.</p>
        }
      </div>
    }
  `,
  styles: [`
    .detail-container { max-width: 900px; margin: 0 auto; padding: 24px; }
    .game-header { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
    .cover {
      width: 300px;
      max-height: 250px;
      border-radius: 8px;
      object-fit: contain;
    }
    .no-cover {
      width: 300px;
      height: 200px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .no-cover mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.2; }
    .game-info { flex: 1; min-width: 280px; color: var(--gr-text-primary); }
    .game-title {
      font-family: var(--gr-font-display);
      font-size: clamp(1.2rem, 3vw, 1.6rem);
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-top: 0;
      color: var(--gr-text-primary);
    }
    .game-info p { color: var(--gr-text-secondary); margin: 4px 0; }
    .game-info strong { color: var(--gr-text-primary); }
    .chips-section { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; }
    .chip--genre {
      background: var(--gr-chip-genre-bg);
      color: var(--gr-text-primary);
      padding: 2px 8px;
      border-radius: var(--gr-radius-chip);
      font-size: 0.75rem;
      border: 1px solid var(--gr-chip-genre-border);
    }
    .chip--platform {
      background: var(--gr-chip-platform-bg);
      color: var(--gr-text-primary);
      padding: 2px 8px;
      border-radius: var(--gr-radius-chip);
      font-size: 0.75rem;
      border: 1px solid var(--gr-chip-platform-border);
    }
    .actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .section-title {
      font-family: var(--gr-font-display);
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--gr-text-primary);
    }
    .synopsis-card { margin-bottom: 24px; }
    .synopsis-card mat-card-title { font-family: var(--gr-font-display); font-weight: 700; letter-spacing: 0.03em; color: var(--gr-text-primary); }
    .synopsis-card p { color: var(--gr-text-secondary); line-height: 1.7; }
    .review-card { margin-bottom: 12px; }
    .review-card mat-card-title { color: var(--gr-text-primary); }
    .review-card mat-card-subtitle { color: var(--gr-text-dim); }
    .review-card p { color: var(--gr-text-secondary); }
    .score { font-size: 1.1rem; color: var(--gr-accent-star); }
    .no-reviews { opacity: 0.5; color: var(--gr-text-muted); }
    @media (max-width: 600px) {
      .game-header { flex-direction: column; align-items: center; text-align: center; }
      .cover, .no-cover { width: 100%; max-width: 300px; }
      .chips-section { justify-content: center; }
      .actions { justify-content: center; }
    }
  `]
})
export class DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly videogameService = inject(VideogameService);
  private readonly reviewService = inject(ReviewService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  authContext = inject(AuthContextService);

  game = signal<VideogameResponse | null>(null);
  reviews = signal<ReviewResponse[]>([]);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGame(id);
    this.loadReviews(id);
  }

  private loadGame(id: number): void {
    this.videogameService.getById(id).subscribe({
      next: (res) => this.game.set(res.data)
    });
  }

  private loadReviews(id: number): void {
    this.reviewService.list(id).subscribe({
      next: (res) => this.reviews.set(res.data.content)
    });
  }

  deleteGame(): void {
    if (!this.game()) return;
    this.videogameService.delete(this.game()!.id).subscribe({
      next: () => {
        this.snackBar.open('Game deleted', 'Close', { duration: 3000 });
        this.router.navigate(['/videogames']);
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Delete failed', 'Close', { duration: 4000 })
    });
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewFormComponent, {
      data: { videogameId: this.game()!.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReviews(this.game()!.id);
        this.loadGame(this.game()!.id);
      }
    });
  }
}

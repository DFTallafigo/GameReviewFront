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

@Component({
  selector: 'app-detail',
  imports: [
    RouterLink, DecimalPipe, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSnackBarModule, MatDialogModule
  ],
  template: `
    @if (game()) {
      <div class="detail-container">
        <div class="game-header">
          @if (game()!.coverUrl) {
            <img [src]="game()!.coverUrl" [alt]="game()!.name" class="cover" />
          } @else {
            <div class="no-cover">
              <mat-icon>videogame_asset</mat-icon>
            </div>
          }
          <div class="game-info">
            <h1>{{ game()!.name }}</h1>
            @if (game()!.releaseDate) {
              <p><strong>Fecha de lanzamiento:</strong> {{ game()!.releaseDate }}</p>
            }
            @if (game()!.metacritic) {
              <p><strong>Metacritic:</strong> {{ game()!.metacritic }}</p>
            }
            @if (game()!.averageRating) {
              <p><strong>Rating usuarios:</strong> {{ game()!.averageRating | number:'1.1-1' }}/5 ({{ game()!.totalReviews }} reviews)</p>
            }
            @if (game()!.esrbRating) {
              <p><strong>ESRB:</strong> {{ game()!.esrbRating }}</p>
            }
            @if (game()!.playtime) {
              <p><strong>Playtime:</strong> {{ game()!.playtime }}h</p>
            }
            <div class="chips-section">
              @for (g of game()!.genres; track g) {
                <span class="chip">{{ g }}</span>
              }
            </div>
            <div class="chips-section">
              @for (p of game()!.platforms; track p) {
                <span class="chip platform">{{ p }}</span>
              }
            </div>
            <div class="actions">
              @if (authContext.isAdmin()) {
                <a mat-raised-button color="primary" [routerLink]="['/videogames', game()!.id, 'edit']">
                  <mat-icon>edit</mat-icon> Editar
                </a>
                <button mat-raised-button color="warn" (click)="deleteGame()">
                  <mat-icon>delete</mat-icon> Eliminar
                </button>
              }
              @if (authContext.isAuthenticated()) {
                <button mat-raised-button color="accent" (click)="openReviewDialog()">
                  <mat-icon>rate_review</mat-icon> Escribir review
                </button>
              }
            </div>
          </div>
        </div>

        @if (game()!.synopsis) {
          <mat-card class="synopsis-card">
            <mat-card-header><mat-card-title>Sinopsis</mat-card-title></mat-card-header>
            <mat-card-content><p>{{ game()!.synopsis }}</p></mat-card-content>
          </mat-card>
        }

        <h2>Reviews</h2>
        @for (review of reviews(); track review.id) {
          <mat-card class="review-card">
            <mat-card-header>
              <mat-card-title>{{ review.username }}</mat-card-title>
              <mat-card-subtitle>{{ review.createdAt | date:'medium' }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="score">{{ '★'.repeat(review.score) }}{{ '☆'.repeat(5 - review.score) }} {{ review.score }}/5</p>
              @if (review.comment) {
                <p>{{ review.comment }}</p>
              }
            </mat-card-content>
          </mat-card>
        } @empty {
          <p class="no-reviews">No hay reviews aun.</p>
        }
      </div>
    }
  `,
  styles: [`
    .detail-container { max-width: 900px; margin: 0 auto; padding: 24px; }
    .game-header { display: flex; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
    .cover { width: 300px; max-height: 250px; border-radius: 8px; object-fit: contain; }
    .no-cover { width: 300px; height: 200px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .no-cover mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.3; }
    .game-info { flex: 1; min-width: 280px; color: rgba(255, 255, 255, 0.9); }
    .game-info h1 { margin-top: 0; font-size: 1.2rem; }
    .game-info p { color: rgba(255, 255, 255, 0.8); }
    .game-info strong { color: rgba(255, 255, 255, 0.95); }
    .chips-section { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; }
    .chip { background: rgba(255, 113, 206, 0.2); color: rgba(255, 255, 255, 0.9); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; border: 1px solid rgba(255, 113, 206, 0.3); }
    .chip.platform { background: rgba(1, 205, 254, 0.2); color: rgba(255, 255, 255, 0.9); border: 1px solid rgba(1, 205, 254, 0.3); }
    .actions { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .synopsis-card { margin-bottom: 24px; background: rgba(255, 255, 255, 0.06) !important; backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .synopsis-card mat-card-title, .synopsis-card p { color: rgba(255, 255, 255, 0.85); }
    .review-card { margin-bottom: 12px; background: rgba(255, 255, 255, 0.06) !important; backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .review-card mat-card-title { color: rgba(255, 255, 255, 0.9); }
    .review-card mat-card-subtitle { color: rgba(255, 255, 255, 0.5); }
    .review-card p { color: rgba(255, 255, 255, 0.8); }
    .score { font-size: 1.1rem; color: #f5a623; }
    .no-reviews { opacity: 0.6; color: rgba(255, 255, 255, 0.7); }
    h1, h2 { color: rgba(255, 255, 255, 0.9); }
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
        this.snackBar.open('Juego eliminado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/videogames']);
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar', { duration: 4000 })
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

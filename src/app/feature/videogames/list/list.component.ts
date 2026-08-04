import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { VideogameService } from '../videogame.service';
import { VideogameResponse } from '../../../domain/videogame.model';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-list',
  imports: [
    FormsModule, DecimalPipe,
    MatCardModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatPaginatorModule, MatChipsModule,
    ScrollRevealDirective
  ],
  template: `
    <div class="list-container">
      <div class="list-header" appScrollReveal="up">
        <h1 class="list-title">Browse Games</h1>
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search games...</mat-label>
          <input matInput [(ngModel)]="searchTerm" (keyup.enter)="search()" />
          <button mat-icon-button matSuffix (click)="search()" aria-label="Search">
            <mat-icon>search</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <div class="games-grid">
        @for (game of games(); track game.id; let i = $index) {
          <mat-card
            class="game-card"
            [class.game-card--featured]="i === 0"
            [class.game-card--small]="i >= 3 && i <= 4"
            (click)="goToDetail(game.id)"
            [attr.data-stagger]="i"
            appScrollReveal="up"
            tabindex="0"
            role="button"
            [attr.aria-label]="'View details for ' + game.name">
            @if (game.coverUrl) {
              <img [src]="game.coverUrl" [alt]="game.name + ' cover'" class="cover" loading="lazy" />
            } @else {
              <div class="no-cover">
                <mat-icon aria-hidden="true">videogame_asset</mat-icon>
              </div>
            }
            <mat-card-header>
              <mat-card-title>{{ game.name }}</mat-card-title>
              @if (game.releaseDate) {
                <mat-card-subtitle>{{ game.releaseDate }}</mat-card-subtitle>
              }
            </mat-card-header>
            <mat-card-content>
              <div class="chips">
                @for (genre of game.genres; track genre) {
                  <span class="chip chip--genre">{{ genre }}</span>
                }
              </div>
              @if (game.metacritic) {
                <p class="metacritic">Metacritic: {{ game.metacritic }}</p>
              }
              @if (game.averageRating) {
                <p class="rating">User rating: {{ game.averageRating | number:'1.1-1' }}/5</p>
              }
            </mat-card-content>
          </mat-card>
        } @empty {
          <p class="no-results">No games found.</p>
        }
      </div>

      <mat-paginator
        [length]="totalElements()"
        [pageSize]="pageSize"
        [pageIndex]="pageIndex"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPage($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .list-container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    .list-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
    .list-title {
      font-family: var(--gr-font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gr-text-primary);
      letter-spacing: 0.05em;
      margin: 0;
    }
    .search-field { width: 100%; max-width: 400px; }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .game-card {
      cursor: pointer;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      background: var(--gr-glass2-bg) !important;
      backdrop-filter: var(--gr-glass2-blur);
      -webkit-backdrop-filter: var(--gr-glass2-blur);
      border: 1px solid var(--gr-glass2-border);
      overflow: hidden;
    }

    .game-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    }

    .game-card:active {
      transform: scale(0.98) translateY(-2px);
    }

    .game-card:focus-visible {
      outline: none;
      box-shadow: var(--gr-focus-ring);
    }

    .game-card--featured {
      grid-column: span 2;
      grid-row: span 1;
    }

    .game-card--featured .cover {
      height: 240px;
    }

    .game-card--small {
      grid-column: span 1;
    }

    .game-card--small .cover {
      height: 120px;
    }

    .cover {
      height: 160px;
      width: 100%;
      object-fit: cover;
      display: block;
    }

    .no-cover {
      height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.03);
    }

    .no-cover mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.2; }

    .chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; }

    .chip--genre {
      background: var(--gr-chip-genre-bg);
      color: var(--gr-text-primary);
      padding: 2px 8px;
      border-radius: var(--gr-radius-chip);
      font-size: 0.7rem;
      border: 1px solid var(--gr-chip-genre-border);
    }

    .metacritic, .rating {
      font-size: 0.85rem;
      margin: 4px 0;
      color: var(--gr-text-secondary);
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      opacity: 0.5;
      padding: 48px;
      color: var(--gr-text-muted);
    }

    @media (max-width: 1024px) {
      .games-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      .game-card--featured {
        grid-column: span 2;
      }
    }

    @media (max-width: 768px) {
      .games-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .game-card--featured {
        grid-column: span 2;
      }
    }

    @media (max-width: 480px) {
      .games-grid {
        grid-template-columns: 1fr;
      }
      .game-card--featured {
        grid-column: span 1;
      }
      .list-header {
        flex-direction: column;
        align-items: stretch;
      }
      .search-field {
        max-width: 100%;
      }
    }
  `]
})
export class ListComponent implements OnInit {
  private readonly videogameService = inject(VideogameService);
  private readonly router = inject(Router);

  games = signal<VideogameResponse[]>([]);
  totalElements = signal(0);
  searchTerm = '';
  pageSize = 20;
  pageIndex = 0;

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.videogameService.list(this.pageIndex, this.pageSize, this.searchTerm || undefined).subscribe({
      next: (res) => {
        this.games.set(res.data.content);
        this.totalElements.set(res.data.totalElements);
      }
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/videogames', id]);
  }

  search(): void {
    this.pageIndex = 0;
    this.loadGames();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadGames();
  }
}

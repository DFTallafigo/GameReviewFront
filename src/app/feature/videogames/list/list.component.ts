import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { PaginatedData } from '../../../domain/api-response.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    RouterLink, FormsModule, DecimalPipe,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatPaginatorModule, MatChipsModule
  ],
  template: `
    <div class="list-container">
      <h1>Videojuegos</h1>

      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar juego...</mat-label>
        <input matInput [(ngModel)]="searchTerm" (keyup.enter)="search()" />
        <button mat-icon-button matSuffix (click)="search()">
          <mat-icon>search</mat-icon>
        </button>
      </mat-form-field>

      <div class="games-grid">
        @for (game of games(); track game.id) {
          <mat-card class="game-card">
            @if (game.coverUrl) {
              <img mat-card-image [src]="game.coverUrl" [alt]="game.name" />
            } @else {
              <div class="no-cover">
                <mat-icon>videogame_asset</mat-icon>
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
                  <span class="chip">{{ genre }}</span>
                }
              </div>
              @if (game.metacritic) {
                <p class="metacritic">Metacritic: {{ game.metacritic }}</p>
              }
              @if (game.averageRating) {
                <p class="rating">Rating usuarios: {{ game.averageRating | number:'1.1-1' }}/5</p>
              }
            </mat-card-content>
            <mat-card-actions>
              <a mat-button color="primary" [routerLink]="['/videogames', game.id]">Ver detalle</a>
            </mat-card-actions>
          </mat-card>
        } @empty {
          <p class="no-results">No se encontraron videojuegos.</p>
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
    h1 { margin-bottom: 16px; }
    .search-field { width: 100%; max-width: 400px; margin-bottom: 16px; }
    .games-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .game-card { cursor: pointer; transition: transform 0.2s; }
    .game-card:hover { transform: translateY(-4px); }
    .no-cover { height: 180px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; }
    .no-cover mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.3; }
    .chips { display: flex; flex-wrap: wrap; gap: 4px; margin: 8px 0; }
    .chip { background: var(--mat-sys-primary-container, #e0e0e0); color: var(--mat-sys-on-primary-container, #333); padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; }
    .metacritic, .rating { font-size: 0.85rem; margin: 4px 0; }
    .no-results { grid-column: 1 / -1; text-align: center; opacity: 0.6; padding: 48px; }
  `]
})
export class ListComponent implements OnInit {
  private videogameService = inject(VideogameService);

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

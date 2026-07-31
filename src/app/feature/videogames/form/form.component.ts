import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VideogameService } from '../videogame.service';

@Component({
  selector: 'app-form',
  imports: [
    RouterLink, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEdit ? 'Editar Videojuego' : 'Nuevo Videojuego' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Sinopsis</mat-label>
              <textarea matInput formControlName="synopsis" rows="4"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>URL de imagen</mat-label>
              <input matInput formControlName="coverUrl" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Sitio web</mat-label>
              <input matInput formControlName="website" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Fecha de lanzamiento</mat-label>
              <input matInput type="date" formControlName="releaseDate" />
            </mat-form-field>
            <div class="form-actions">
              <a mat-button routerLink="/videogames">Cancelar</a>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { display: flex; justify-content: center; padding: 24px; }
    .form-card { width: 100%; max-width: 600px; background: rgba(255, 255, 255, 0.06) !important; backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.08); }
    .form-card mat-card-title { color: rgba(255, 255, 255, 0.9); }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
  `]
})
export class FormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly videogameService = inject(VideogameService);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    synopsis: [''],
    coverUrl: [''],
    website: [''],
    releaseDate: ['']
  });

  isEdit = false;
  private gameId: number | null = null;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.gameId = Number(id);
      this.videogameService.getById(this.gameId).subscribe({
        next: (res) => {
          const g = res.data;
          this.form.patchValue({
            name: g.name,
            synopsis: g.synopsis,
            coverUrl: g.coverUrl,
            website: g.website,
            releaseDate: g.releaseDate
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const request = this.form.value;

    const obs = this.isEdit
      ? this.videogameService.update(this.gameId!, request)
      : this.videogameService.create(request);

    obs.subscribe({
      next: () => {
        this.snackBar.open(this.isEdit ? 'Actualizado' : 'Creado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/videogames']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Error al guardar', 'Cerrar', { duration: 4000 });
      }
    });
  }
}

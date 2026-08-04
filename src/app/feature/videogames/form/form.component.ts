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
      <mat-card class="form-card glass-card">
        <mat-card-header>
          <mat-card-title class="form-title">{{ isEdit ? 'Edit Game' : 'New Game' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Synopsis</mat-label>
              <textarea matInput formControlName="synopsis" rows="4"></textarea>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Cover image URL</mat-label>
              <input matInput formControlName="coverUrl" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Website</mat-label>
              <input matInput formControlName="website" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Release date</mat-label>
              <input matInput type="date" formControlName="releaseDate" />
            </mat-form-field>
            <div class="form-actions">
              <a mat-button routerLink="/videogames">Cancel</a>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
                {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container { display: flex; justify-content: center; padding: 24px; }
    .form-card { width: 100%; max-width: 600px; }
    .form-title { font-family: var(--gr-font-display); font-weight: 700; letter-spacing: 0.03em; color: var(--gr-text-primary); }
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
        this.snackBar.open(this.isEdit ? 'Updated' : 'Created', 'Close', { duration: 3000 });
        this.router.navigate(['/videogames']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Save failed', 'Close', { duration: 4000 });
      }
    });
  }
}

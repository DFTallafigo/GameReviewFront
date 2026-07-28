import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewService } from '../review.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Escribir Review</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="score-selector">
          @for (star of [1,2,3,4,5]; track star) {
            <mat-icon
              class="star"
              [class.active]="star <= selectedScore()"
              (click)="setScore(star)">
              {{ star <= selectedScore() ? 'star' : 'star_border' }}
            </mat-icon>
          }
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Comentario (opcional)</mat-label>
          <textarea matInput formControlName="comment" rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="submit()" [disabled]="form.invalid || loading">
        {{ loading ? 'Enviando...' : 'Enviar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; }
    .score-selector { display: flex; gap: 4px; margin-bottom: 16px; }
    .star { cursor: pointer; font-size: 32px; width: 32px; height: 32px; color: #ccc; transition: color 0.2s; }
    .star.active { color: #f5a623; }
    .star:hover { color: #f5a623; }
  `]
})
export class ReviewFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly reviewService = inject(ReviewService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef<ReviewFormComponent>);
  private readonly data = inject<{ videogameId: number }>(MAT_DIALOG_DATA);

  form: FormGroup = this.fb.group({
    score: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['']
  });

  selectedScore = () => this.form.get('score')!.value as number;
  loading = false;

  setScore(score: number): void {
    this.form.patchValue({ score });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.reviewService.create(this.data.videogameId, this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Review publicada', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Error al publicar review', 'Cerrar', { duration: 4000 });
      }
    });
  }
}

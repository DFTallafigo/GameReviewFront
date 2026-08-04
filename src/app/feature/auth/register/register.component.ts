import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { SynthwavePalmsComponent } from '../../../shared/ui/synthwave-palms/synthwave-palms.component';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule,
    SynthwavePalmsComponent
  ],
  template: `
<div class="auth-page">
  <div class="sun"></div>

  <app-synthwave-palms />

  <div class="road"></div>
  <div class="split-layout">
    <div class="left-panel">
      <h2 class="auth-title">Sign Up</h2>
      <p class="welcome-text">Join GameReview.</p>
      <p class="sub-text">Create your account and start sharing your reviews.</p>
    </div>

    <div class="right-panel">
      <mat-card class="auth-card glass-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" />
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="form.invalid || loading">
              {{ loading ? 'Creating...' : 'Sign Up' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="auth-link">Already have an account? <a routerLink="/login">Sign In</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  </div>
</div>
  `,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  hidePassword = true;
  loading = false;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Account created!', 'Close', { duration: 3000 });
        this.router.navigate(['/videogames']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Registration failed', 'Close', { duration: 4000 });
      }
    });
  }
}

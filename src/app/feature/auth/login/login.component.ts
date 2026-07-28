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
  selector: 'app-login',
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
      <h2>Sign In</h2>
      <p class="welcome-text">Welcome back to GameReview.</p>
      <p class="sub-text">Discover, review, and connect with the community.</p>
    </div>

    <div class="right-panel">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>Sign In</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" />
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="form.invalid || loading">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p class="auth-link">Don't have an account? <a routerLink="/register">Sign Up</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  </div>

  <div class="grid-floor"></div>
  <div class="cyber-scanlines scanlines-overlay"></div>
</div>
  `,
  styles: [`
    :host { display: block; height: calc(100vh - 128px); height: calc(100dvh - 128px); }

    .auth-page {
      position: relative;
      height: 100%;
      overflow: hidden;
      background: linear-gradient(180deg, #b44dd8 0%, #8a3ebf 20%, #5c2d91 40%, #1a1035 65%, #0a0a1a 100%);
    }

    .sun {
      position: absolute;
      top: 3%;
      left: 50%;
      transform: translateX(-50%);
      width: clamp(80px, 25vw, 220px);
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 50%, #ffb3b3 0%, #ff6b6b 25%, #ff4757 50%, transparent 75%);
    }

    .sun::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: repeating-linear-gradient(180deg, transparent 0px, transparent 8px, rgba(0, 0, 0, 0.18) 8px, rgba(0, 0, 0, 0.18) 10px);
    }

    .split-layout {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      height: 100%;
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem;
      gap: 3rem;
    }

    .left-panel {
      flex: 1;
      color: #fff;
      text-align: center;
    }

    .left-panel h2 {
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      font-weight: 300;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin: 0 0 1rem;
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    }

    .welcome-text {
      font-size: clamp(1rem, 2.5vw, 1.3rem);
      color: rgba(255, 255, 255, 0.85);
      margin: 0 0 0.5rem;
    }

    .sub-text {
      font-size: clamp(0.85rem, 1.8vw, 1rem);
      color: rgba(255, 255, 255, 0.55);
      margin: 0;
    }

    .right-panel {
      flex: 0 0 400px;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.06) !important;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .auth-card mat-card-title {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      letter-spacing: 0.1em;
      text-align: center;
      width: 100%;
    }

    .full-width { width: 100%; }

    mat-card-actions { text-align: center; padding: 16px !important; }

    .auth-link {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
    }

    .auth-link a {
      color: #01cdfe;
      text-decoration: none;
      text-shadow: 0 0 8px rgba(1, 205, 254, 0.3);
    }

    .auth-link a:hover { text-decoration: underline; }

    .road {
      position: absolute;
      bottom: 0;
      left: 30%;
      right: 30%;
      height: 100%;
      z-index: 0;
      background: linear-gradient(180deg, #3d3d3d 0%, #2a2a2a 50%, #1a1a1a 100%);
      transform: perspective(400px) rotateX(60deg);
      transform-origin: bottom center;
      border-left: 6px solid rgba(255, 255, 255, 0.7);
      border-right: 6px solid rgba(255, 255, 255, 0.7);
      mask-image: linear-gradient(to top, black 0%, transparent 80%);
      -webkit-mask-image: linear-gradient(to top, black 0%, transparent 80%);
    }

    .road::after {
      content: '';
      position: absolute;
      left: 50%;
      width: 6px;
      height: 100%;
      margin-left: -3px;
      background: repeating-linear-gradient(180deg, #ffd700 0px, #ffd700 49px, transparent 49px, transparent 98px);
    }

    .grid-floor {
      position: absolute;
      bottom: 0;
      left: -50%;
      right: -50%;
      height: 50%;
      background-image:
        linear-gradient(rgba(255, 113, 206, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(1, 205, 254, 0.12) 1px, transparent 1px);
      background-size: 60px 60px;
      transform: perspective(400px) rotateX(60deg);
      transform-origin: bottom center;
      mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
      -webkit-mask-image: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
    }

    .cyber-scanlines::after { z-index: 3; }

    @media (max-width: 768px) {
      .split-layout {
        flex-direction: column;
        justify-content: center;
        gap: 1.5rem;
        padding: 1rem;
      }

      .left-panel h2 { margin-bottom: 0.5rem; }

      .left-panel .sub-text { display: none; }

      .right-panel { flex: 0 0 auto; width: 100%; max-width: 400px; }

      .road { left: 25%; right: 25%; }
      .road::after { width: 4px; margin-left: -2px; }
      .grid-floor { background-size: 30px 30px; height: 35%; }
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  hidePassword = true;
  loading = false;

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Welcome!', 'Close', { duration: 3000 });
        this.router.navigate(['/videogames']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.message || 'Invalid credentials', 'Close', { duration: 4000 });
      }
    });
  }
}

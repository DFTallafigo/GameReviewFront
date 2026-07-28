import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SynthwavePalmsComponent } from '../../shared/ui/synthwave-palms/synthwave-palms.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, SynthwavePalmsComponent],
  template: `
<div class="home">
  <div class="hero">
    <div class="sun"></div>
    <app-synthwave-palms />
    <div class="road"></div>
    <div class="hero-content">
      <p class="tagline">GameReview</p>
      <p class="description">
        Discover, review, and share your favorite video games.
        Find your next adventure with the help of the community.
      </p>
      <div class="cta-buttons">
        <a mat-raised-button routerLink="/videogames" class="cta-btn cta-primary">Browse Games</a>
        <a mat-raised-button routerLink="/login" class="cta-btn cta-secondary">Sign In</a>
      </div>
    </div>
    <div class="cyber-scanlines scanlines-overlay"></div>
  </div>
</div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {}

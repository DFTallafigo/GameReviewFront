import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
<div class="home">
  <div class="hero">
    <div class="sun"></div>
    <svg class="palm p-1" viewBox="0 0 100 320" fill="#08081a" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 320 Q54 200 50 100" stroke="#08081a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 100 Q10 85 5 95 Q25 103 50 100"/>
      <path d="M50 100 Q90 70 98 83 Q78 97 50 100"/>
      <path d="M50 100 Q28 52 22 60 Q42 78 50 100"/>
      <path d="M50 100 Q75 42 82 55 Q68 78 50 100"/>
      <path d="M50 100 Q46 32 48 28 Q50 55 50 78"/>
    </svg>
    <svg class="palm p-2" viewBox="0 0 100 320" fill="#08081a" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 320 Q54 200 50 100" stroke="#08081a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 100 Q10 85 5 95 Q25 103 50 100"/>
      <path d="M50 100 Q90 70 98 83 Q78 97 50 100"/>
      <path d="M50 100 Q28 52 22 60 Q42 78 50 100"/>
      <path d="M50 100 Q75 42 82 55 Q68 78 50 100"/>
      <path d="M50 100 Q46 32 48 28 Q50 55 50 78"/>
    </svg>
    <svg class="palm p-3" viewBox="0 0 100 320" fill="#08081a" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 320 Q54 200 50 100" stroke="#08081a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 100 Q10 85 5 95 Q25 103 50 100"/>
      <path d="M50 100 Q90 70 98 83 Q78 97 50 100"/>
      <path d="M50 100 Q28 52 22 60 Q42 78 50 100"/>
      <path d="M50 100 Q75 42 82 55 Q68 78 50 100"/>
      <path d="M50 100 Q46 32 48 28 Q50 55 50 78"/>
    </svg>
    <svg class="palm p-1 pr" viewBox="0 0 100 320" fill="#08081a" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 320 Q54 200 50 100" stroke="#08081a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 100 Q10 85 5 95 Q25 103 50 100"/>
      <path d="M50 100 Q90 70 98 83 Q78 97 50 100"/>
      <path d="M50 100 Q28 52 22 60 Q42 78 50 100"/>
      <path d="M50 100 Q75 42 82 55 Q68 78 50 100"/>
      <path d="M50 100 Q46 32 48 28 Q50 55 50 78"/>
    </svg>
    <svg class="palm p-2 pr" viewBox="0 0 100 320" fill="#08081a" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 320 Q54 200 50 100" stroke="#08081a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 100 Q10 85 5 95 Q25 103 50 100"/>
      <path d="M50 100 Q90 70 98 83 Q78 97 50 100"/>
      <path d="M50 100 Q28 52 22 60 Q42 78 50 100"/>
      <path d="M50 100 Q75 42 82 55 Q68 78 50 100"/>
      <path d="M50 100 Q46 32 48 28 Q50 55 50 78"/>
    </svg>
    <svg class="palm p-3 pr" viewBox="0 0 100 320" fill="#08081a" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 320 Q54 200 50 100" stroke="#08081a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M50 100 Q10 85 5 95 Q25 103 50 100"/>
      <path d="M50 100 Q90 70 98 83 Q78 97 50 100"/>
      <path d="M50 100 Q28 52 22 60 Q42 78 50 100"/>
      <path d="M50 100 Q75 42 82 55 Q68 78 50 100"/>
      <path d="M50 100 Q46 32 48 28 Q50 55 50 78"/>
    </svg>
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

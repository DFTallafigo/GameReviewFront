import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SynthwavePalmsComponent } from '../../shared/ui/synthwave-palms/synthwave-palms.component';
import { ScrollRevealDirective } from '../../shared/directives/scroll-reveal.directive';
import { MarqueeComponent } from '../../shared/ui/marquee/marquee.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, SynthwavePalmsComponent, ScrollRevealDirective, MarqueeComponent],
  template: `
<div class="home">
  <div class="hero">
    <div class="sun"></div>
    <app-synthwave-palms />
    <div class="road"></div>
    <div class="hero-content">
      <div class="hero-left">
        <h1 class="tagline" appScrollReveal="scale">GameReview</h1>
      </div>
      <div class="hero-right">
        <p class="description" appScrollReveal="up" [style.--stagger-index]="'1'">
          Discover, review, and share your favorite video games.
          Find your next adventure with the help of the community.
        </p>
        <div class="cta-buttons" appScrollReveal="up" [style.--stagger-index]="'2'">
          <a mat-raised-button routerLink="/videogames" class="cta-btn cta-primary">Browse Games</a>
          <a mat-raised-button routerLink="/login" class="cta-btn cta-secondary">Sign In</a>
        </div>
      </div>
    </div>
  </div>
  <app-marquee label="Game categories">RPG &bull; Action &bull; Adventure &bull; Strategy &bull; Indie &bull; Horror &bull; Racing &bull; Puzzle &bull; RPG &bull; Action &bull; Adventure &bull; Strategy &bull; Indie &bull; Horror &bull; Racing &bull; Puzzle</app-marquee>
</div>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {}

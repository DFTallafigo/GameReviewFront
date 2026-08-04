import { Component } from '@angular/core';

@Component({
  selector: 'app-synthwave-palms',
  template: `
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
  `,
  styles: [`
    :host { display: contents; }

    .palm {
      position: absolute;
      z-index: 1;
      pointer-events: none;
    }

    .p-1 { height: clamp(200px, 50vh, 400px); bottom: 0; left: 2%; opacity: 0.9; z-index: 3; }
    .p-2 { height: clamp(130px, 32vh, 260px); bottom: 8%; left: 6%; opacity: 0.65; z-index: 2; }
    .p-3 { height: clamp(80px, 20vh, 160px); bottom: 16%; left: 10%; opacity: 0.4; z-index: 1; }
    .pr { left: auto; }
    .p-1.pr { right: 2%; }
    .p-2.pr { right: 6%; transform: scaleX(-1); }
    .p-3.pr { right: 10%; transform: scaleX(-1); }

    @media (max-width: 768px) {
      .p-1 { height: clamp(150px, 40vh, 300px); left: 1%; }
      .p-2 { height: clamp(100px, 25vh, 200px); left: 5%; }
      .p-3 { display: none; }
      .p-1.pr { right: 1%; }
      .p-2.pr { right: 5%; }
      .p-3.pr { display: none; }
    }
  `]
})
export class SynthwavePalmsComponent {}

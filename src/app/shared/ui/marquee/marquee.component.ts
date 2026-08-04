import { Component, input } from '@angular/core';

@Component({
  selector: 'app-marquee',
  template: `
    <div class="marquee-container" [attr.aria-label]="label()">
      <div class="marquee-track">
        <span class="marquee-content"><ng-content /></span>
        <span class="marquee-content" aria-hidden="true"><ng-content /></span>
      </div>
    </div>
  `,
  styles: [`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .marquee-container {
      overflow: hidden;
      width: 100%;
      mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee 30s linear infinite;
    }

    .marquee-content {
      flex-shrink: 0;
      padding-right: 4rem;
      white-space: nowrap;
      font-family: var(--gr-font-display);
      font-size: var(--gr-text-lg);
      color: var(--gr-text-muted);
      opacity: 0.5;
    }
  `]
})
export class MarqueeComponent {
  label = input<string>('Scrolling text');
}

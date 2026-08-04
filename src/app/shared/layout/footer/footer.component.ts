import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <p>GameReview &copy; 2026 &mdash; API Backend: Spring Boot</p>
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      padding: 2px;
      font-size: var(--gr-text-sm);
      font-family: var(--gr-font-body);
      opacity: 0.5;
      border-top: 1px solid var(--gr-border-subtle);
      margin-top: 0;
      color: var(--gr-text-muted);
    }
  `]
})
export class FooterComponent {}

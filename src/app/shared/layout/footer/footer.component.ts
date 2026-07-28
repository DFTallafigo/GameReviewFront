import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p>GameReview &copy; 2026 &mdash; API Backend: Spring Boot</p>
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      padding: 2px;
      font-size: 0.75rem;
      opacity: 0.5;
      border-top: 1px solid var(--mat-sys-outline-variant, #ccc);
      margin-top: 0;
    }
  `]
})
export class FooterComponent {}

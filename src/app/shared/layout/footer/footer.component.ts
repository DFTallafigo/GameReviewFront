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
      padding: 16px;
      font-size: 0.85rem;
      opacity: 0.7;
      border-top: 1px solid var(--mat-sys-outline-variant, #ccc);
      margin-top: 32px;
    }
  `]
})
export class FooterComponent {}

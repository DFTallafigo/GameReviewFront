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
      font-size: 0.75rem;
      opacity: 0.5;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 0;
      color: rgba(255, 255, 255, 0.6);
    }
  `]
})
export class FooterComponent {}

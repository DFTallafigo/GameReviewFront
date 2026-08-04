import { Directive, ElementRef, input, OnInit, inject } from '@angular/core';

/**
 * Directive: appScrollReveal
 * Adds scroll-triggered reveal animations to any element.
 * Usage: <div appScrollReveal="up"> or <div appScrollReveal="left">
 * Respects prefers-reduced-motion.
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit {
  /** Animation direction: 'up' | 'left' | 'scale' */
  appScrollReveal = input<string>('up');

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // Add base reveal class
    element.classList.add('reveal');

    // Add direction class
    const direction = this.appScrollReveal();
    if (direction === 'left') {
      element.classList.add('reveal-left');
    } else if (direction === 'scale') {
      element.classList.add('reveal-scale');
    }

    const staggerIndex = element.dataset['stagger'];
    if (staggerIndex !== undefined) {
      element.style.setProperty('--stagger-index', staggerIndex);
    }

    // If reduced motion is preferred, show immediately
    if (this.prefersReducedMotion.matches) {
      element.classList.add('revealed');
      return;
    }

    // Use IntersectionObserver for scroll-triggered reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(element);
  }
}

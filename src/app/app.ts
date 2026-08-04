import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';

const routeAnimation = trigger('routeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(12px)' })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ], { optional: true }),
      query(':enter', [
        animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  animations: [routeAnimation],
  template: `
    <app-header />
    <main id="main-content" [@routeAnimation]="animationName()">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styles: [`
    main {
      min-height: calc(100vh - 128px);
      position: relative;
      z-index: 1;
    }
  `]
})
export class App {
  private readonly router = inject(Router);

  protected readonly animationName = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => {
        const route = this.router.routerState.snapshot.root;
        let child = route;
        while (child.firstChild) child = child.firstChild;
        return child.data['animation'] ?? 'default';
      })
    ),
    { initialValue: 'home' }
  );
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarqueeComponent } from './marquee.component';

describe('MarqueeComponent', () => {
  let component: MarqueeComponent;
  let fixture: ComponentFixture<MarqueeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarqueeComponent]
    });
    fixture = TestBed.createComponent(MarqueeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render content', () => {
    fixture.componentRef.setInput('label', 'Test marquee');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.marquee-container')).toBeTruthy();
    expect(compiled.querySelector('.marquee-track')).toBeTruthy();
  });

  it('should set aria-label from label input', () => {
    fixture.componentRef.setInput('label', 'Game categories');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.marquee-container')?.getAttribute('aria-label')).toBe('Game categories');
  });

  it('should have two marquee-content spans for seamless loop', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const spans = compiled.querySelectorAll('.marquee-content');
    expect(spans).toHaveSize(2);
  });
});

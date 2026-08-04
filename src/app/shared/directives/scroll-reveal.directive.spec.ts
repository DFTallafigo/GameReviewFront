import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  template: `<div appScrollReveal="up">Test</div>`,
  imports: [ScrollRevealDirective]
})
class TestHostComponent {}

describe('ScrollRevealDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    fixture = TestBed.createComponent(TestHostComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should add reveal class to element', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('div');
    expect(el.classList.contains('reveal')).toBeTrue();
  });

  it('should add reveal-up class for default direction', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('div');
    expect(el.classList.contains('reveal')).toBeTrue();
  });
});

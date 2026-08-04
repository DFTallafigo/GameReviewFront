import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';
import { AuthContextService } from '../../services/auth-context.service';
import { AuthService } from '../../../feature/auth/auth.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authContextSpy: jasmine.SpyObj<AuthContextService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authContextSpy = jasmine.createSpyObj('AuthContextService', ['isAuthenticated', 'isAdmin', 'getUsername']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    authContextSpy.isAuthenticated.and.returnValue(false);
    authContextSpy.isAdmin.and.returnValue(false);
    authContextSpy.getUsername.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthContextService, useValue: authContextSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show logo', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.logo-gr')?.textContent).toContain('GR');
  });

  it('should show login and register links when not authenticated', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/login"]')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/register"]')).toBeTruthy();
  });

  it('should show user info and logout when authenticated', () => {
    authContextSpy.isAuthenticated.and.returnValue(true);
    authContextSpy.getUsername.and.returnValue('testuser');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-info')?.textContent).toContain('testuser');
    expect(compiled.querySelector('button')?.textContent).toContain('Log out');
  });

  it('should show new game link for admin', () => {
    authContextSpy.isAuthenticated.and.returnValue(true);
    authContextSpy.isAdmin.and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('a[routerLink="/videogames/new"]')).toBeTruthy();
  });

  it('should call logout on button click', () => {
    authContextSpy.isAuthenticated.and.returnValue(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const btn = compiled.querySelector('button') as HTMLButtonElement;
    btn.click();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});

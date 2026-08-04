import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    TestBed.overrideProvider(MatSnackBar, { useValue: snackBarSpy });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have username and password controls', () => {
      expect(component.form.contains('username')).toBeTrue();
      expect(component.form.contains('password')).toBeTrue();
    });

    it('should make username required', () => {
      const control = component.form.get('username');
      control?.setValue('');
      expect(control?.valid).toBeFalse();
    });

    it('should make password required', () => {
      const control = component.form.get('password');
      control?.setValue('');
      expect(control?.valid).toBeFalse();
    });

    it('should have hidePassword default to true', () => {
      expect(component.hidePassword).toBeTrue();
    });

    it('should have loading default to false', () => {
      expect(component.loading).toBeFalse();
    });

    it('should be invalid when empty', () => {
      expect(component.form.valid).toBeFalse();
    });

    it('should be valid when both fields are filled', () => {
      component.form.setValue({ username: 'testuser', password: 'password123' });
      expect(component.form.valid).toBeTrue();
    });
  });

  describe('toggle password visibility', () => {
    it('should toggle hidePassword via template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const toggleBtn = compiled.querySelector('button[mat-icon-button][matSuffix]') as HTMLButtonElement;
      expect(component.hidePassword).toBeTrue();
      toggleBtn.click();
      fixture.detectChanges();
      expect(component.hidePassword).toBeFalse();
      toggleBtn.click();
      fixture.detectChanges();
      expect(component.hidePassword).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('should not call authService.login if form is invalid via ngSubmit', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit'));
      tick();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    }));

    it('should set loading to true when submitting', fakeAsync(() => {
      component.form.setValue({ username: 'testuser', password: 'password123' });
      authServiceSpy.login.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'testuser', email: 'test@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(component.loading).toBeTrue();
    }));

    it('should call authService.login with form value on valid form', fakeAsync(() => {
      const credentials = { username: 'testuser', password: 'password123' };
      component.form.setValue(credentials);
      authServiceSpy.login.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'testuser', email: 'test@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(authServiceSpy.login).toHaveBeenCalledWith(credentials);
    }));

    it('should navigate to /videogames on success', fakeAsync(() => {
      component.form.setValue({ username: 'testuser', password: 'password123' });
      authServiceSpy.login.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'testuser', email: 'test@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/videogames']);
    }));

    it('should show success snackbar on success', fakeAsync(() => {
      component.form.setValue({ username: 'testuser', password: 'password123' });
      authServiceSpy.login.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'testuser', email: 'test@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Welcome!', 'Close', { duration: 3000 });
    }));

    it('should reset loading on error', fakeAsync(() => {
      component.form.setValue({ username: 'testuser', password: 'wrong' });
      authServiceSpy.login.and.returnValue(throwError(() => ({
        error: { message: 'Invalid credentials' }
      })));
      component.onSubmit();
      tick();
      expect(component.loading).toBeFalse();
    }));

    it('should show error snackbar with server message on error', fakeAsync(() => {
      component.form.setValue({ username: 'testuser', password: 'wrong' });
      authServiceSpy.login.and.returnValue(throwError(() => ({
        error: { message: 'Invalid credentials' }
      })));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Invalid credentials', 'Close', { duration: 4000 });
    }));

    it('should show default error message when no server message', fakeAsync(() => {
      component.form.setValue({ username: 'testuser', password: 'wrong' });
      authServiceSpy.login.and.returnValue(throwError(() => ({})));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Invalid credentials', 'Close', { duration: 4000 });
    }));
  });

  describe('template', () => {
    it('should render the sign in form', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('form')).toBeTruthy();
      expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Sign In');
    });

    it('should disable submit button when form is invalid', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.form.setValue({ username: 'testuser', password: 'password123' });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeFalse();
    });

    it('should show "Signing in..." text when loading', () => {
      component.form.setValue({ username: 'testuser', password: 'password123' });
      component.loading = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.textContent?.trim()).toContain('Signing in...');
    });

    it('should have a link to register page', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('a[routerLink="/register"]');
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain('Sign Up');
    });
  });
});
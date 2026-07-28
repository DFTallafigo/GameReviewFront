import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } }
      ]
    }).compileComponents();

    TestBed.overrideProvider(MatSnackBar, { useValue: snackBarSpy });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form initialization', () => {
    it('should have username, email and password controls', () => {
      expect(component.form.contains('username')).toBeTrue();
      expect(component.form.contains('email')).toBeTrue();
      expect(component.form.contains('password')).toBeTrue();
    });

    it('should make username required', () => {
      const control = component.form.get('username');
      control?.setValue('');
      expect(control?.valid).toBeFalse();
    });

    it('should make email required', () => {
      const control = component.form.get('email');
      control?.setValue('');
      expect(control?.valid).toBeFalse();
    });

    it('should validate email format', () => {
      const control = component.form.get('email');
      control?.setValue('invalid-email');
      expect(control?.valid).toBeFalse();
    });

    it('should accept valid email', () => {
      const control = component.form.get('email');
      control?.setValue('user@example.com');
      expect(control?.valid).toBeTrue();
    });

    it('should make password required', () => {
      const control = component.form.get('password');
      control?.setValue('');
      expect(control?.valid).toBeFalse();
    });

    it('should enforce min length of 4 for password', () => {
      const control = component.form.get('password');
      control?.setValue('ab');
      expect(control?.valid).toBeFalse();
    });

    it('should accept password with 4+ characters', () => {
      const control = component.form.get('password');
      control?.setValue('abcd');
      expect(control?.valid).toBeTrue();
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

    it('should be valid when all fields are correctly filled', () => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
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
    it('should not call authService.register if form is invalid via ngSubmit', fakeAsync(() => {
      const compiled = fixture.nativeElement as HTMLElement;
      const form = compiled.querySelector('form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit'));
      tick();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }));

    it('should set loading to true when submitting', fakeAsync(() => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      authServiceSpy.register.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'newuser', email: 'user@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(component.loading).toBeTrue();
    }));

    it('should call authService.register with form value on valid form', fakeAsync(() => {
      const credentials = {
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      };
      component.form.setValue(credentials);
      authServiceSpy.register.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'newuser', email: 'user@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(authServiceSpy.register).toHaveBeenCalledWith(credentials);
    }));

    it('should navigate to /videogames on success', fakeAsync(() => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      authServiceSpy.register.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'newuser', email: 'user@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/videogames']);
    }));

    it('should show success snackbar on success', fakeAsync(() => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      authServiceSpy.register.and.returnValue(of({
        status: 200,
        message: 'OK',
        data: { token: 'jwt', type: 'Bearer', username: 'newuser', email: 'user@example.com', role: 'USER' }
      }));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Account created!', 'Close', { duration: 3000 });
    }));

    it('should reset loading on error', fakeAsync(() => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      authServiceSpy.register.and.returnValue(throwError(() => ({
        error: { message: 'Registration failed' }
      })));
      component.onSubmit();
      tick();
      expect(component.loading).toBeFalse();
    }));

    it('should show error snackbar with server message on error', fakeAsync(() => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      authServiceSpy.register.and.returnValue(throwError(() => ({
        error: { message: 'Username already taken' }
      })));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Username already taken', 'Close', { duration: 4000 });
    }));

    it('should show default error message when no server message', fakeAsync(() => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      authServiceSpy.register.and.returnValue(throwError(() => ({})));
      component.onSubmit();
      tick();
      expect(snackBarSpy.open).toHaveBeenCalledWith('Registration failed', 'Close', { duration: 4000 });
    }));
  });

  describe('template', () => {
    it('should render the sign up form', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('form')).toBeTruthy();
      expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Create Account');
    });

    it('should disable submit button when form is invalid', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.disabled).toBeFalse();
    });

    it('should show "Creating..." text when loading', () => {
      component.form.setValue({
        username: 'newuser',
        email: 'user@example.com',
        password: 'password123'
      });
      component.loading = true;
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(button.textContent?.trim()).toContain('Creating...');
    });

    it('should have a link to login page', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('a[routerLink="/login"]');
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain('Sign In');
    });
  });
});
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthContextService } from '../../shared/services/auth-context.service';

describe('authGuard', () => {
  let authContextSpy: jasmine.SpyObj<AuthContextService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authContextSpy = jasmine.createSpyObj('AuthContextService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthContextService, useValue: authContextSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should return true if authenticated', () => {
    authContextSpy.isAuthenticated.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('should redirect to /login if not authenticated', () => {
    authContextSpy.isAuthenticated.and.returnValue(false);
    routerSpy.parseUrl.and.returnValue('/login' as any);
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
  });
});

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin.guard';
import { AuthContextService } from '../../shared/services/auth-context.service';

describe('adminGuard', () => {
  let authContextSpy: jasmine.SpyObj<AuthContextService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authContextSpy = jasmine.createSpyObj('AuthContextService', ['isAuthenticated', 'isAdmin']);
    routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthContextService, useValue: authContextSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should return true if authenticated and admin', () => {
    authContextSpy.isAuthenticated.and.returnValue(true);
    authContextSpy.isAdmin.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('should redirect to /videogames if not authenticated', () => {
    authContextSpy.isAuthenticated.and.returnValue(false);
    authContextSpy.isAdmin.and.returnValue(false);
    routerSpy.parseUrl.and.returnValue('/videogames' as any);
    TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/videogames');
  });

  it('should redirect to /videogames if authenticated but not admin', () => {
    authContextSpy.isAuthenticated.and.returnValue(true);
    authContextSpy.isAdmin.and.returnValue(false);
    routerSpy.parseUrl.and.returnValue('/videogames' as any);
    TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(routerSpy.parseUrl).toHaveBeenCalledWith('/videogames');
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpRequest } from '@angular/common/http';
import { jwtInterceptor } from './jwt.interceptor';
import { AuthContextService } from '../../shared/services/auth-context.service';

describe('jwtInterceptor', () => {
  let authContextSpy: jasmine.SpyObj<AuthContextService>;

  beforeEach(() => {
    authContextSpy = jasmine.createSpyObj('AuthContextService', [], { token: jasmine.createSpy() });
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthContextService, useValue: authContextSpy }
      ]
    });
  });

  it('should add Authorization header when token exists', () => {
    (authContextSpy.token as jasmine.Spy).and.returnValue('test-token');
    const req = new HttpRequest('GET', '/api/test');
    const next = jasmine.createSpy('next');

    TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

    const clonedReq = next.calls.first().args[0] as HttpRequest<any>;
    expect(clonedReq.headers.get('Authorization')).toBe('Bearer test-token');
  });

  it('should not add Authorization header when no token', () => {
    (authContextSpy.token as jasmine.Spy).and.returnValue(null);
    const req = new HttpRequest('GET', '/api/test');
    const next = jasmine.createSpy('next');

    TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

    expect(next).toHaveBeenCalledWith(req);
  });
});

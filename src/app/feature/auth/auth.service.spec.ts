import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthContextService } from '../../shared/services/auth-context.service';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../domain/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let authContextSpy: jasmine.SpyObj<AuthContextService>;

  const mockAuthResponse: AuthResponse = {
    token: 'jwt-token',
    type: 'Bearer',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER'
  };

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    authContextSpy = jasmine.createSpyObj('AuthContextService', ['setUser', 'clear']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: AuthContextService, useValue: authContextSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    const loginRequest: LoginRequest = {
      username: 'testuser',
      password: 'password123'
    };

    it('should POST to /auth/login with the request body', () => {
      service.login(loginRequest).subscribe(res => {
        expect(res.data).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush({ status: 200, message: 'OK', data: mockAuthResponse });
    });

    it('should call authContext.setUser via tap operator', () => {
      service.login(loginRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush({ status: 200, message: 'OK', data: mockAuthResponse });

      expect(authContextSpy.setUser).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should propagate error', () => {
      let error: any;
      service.login(loginRequest).subscribe({
        error: (err) => { error = err; }
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });

      expect(error).toBeTruthy();
    });
  });

  describe('register', () => {
    const registerRequest: RegisterRequest = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123'
    };

    it('should POST to /auth/register with the request body', () => {
      service.register(registerRequest).subscribe(res => {
        expect(res.data).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush({ status: 200, message: 'OK', data: mockAuthResponse });
    });

    it('should call authContext.setUser via tap operator', () => {
      service.register(registerRequest).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush({ status: 200, message: 'OK', data: mockAuthResponse });

      expect(authContextSpy.setUser).toHaveBeenCalledWith(mockAuthResponse);
    });

    it('should propagate error', () => {
      let error: any;
      service.register(registerRequest).subscribe({
        error: (err) => { error = err; }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush('Register failed', { status: 400, statusText: 'Bad Request' });

      expect(error).toBeTruthy();
    });
  });

  describe('logout', () => {
    it('should call authContext.clear()', () => {
      service.logout();
      expect(authContextSpy.clear).toHaveBeenCalled();
    });
  });
});
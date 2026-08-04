import { TestBed } from '@angular/core/testing';
import { AuthContextService } from './auth-context.service';
import { AuthResponse } from '../../domain/auth.model';

describe('AuthContextService', () => {
  let service: AuthContextService;

  const mockAuth: AuthResponse = {
    token: 'fake-jwt-token',
    type: 'Bearer',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER'
  };

  const mockAdminAuth: AuthResponse = {
    token: 'admin-jwt-token',
    type: 'Bearer',
    username: 'admin',
    email: 'admin@example.com',
    role: 'ADMIN'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthContextService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have null currentUser when no stored data', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('should have isAuthenticated as false initially', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should have isAdmin as false initially', () => {
      expect(service.isAdmin()).toBeFalse();
    });

    it('should have token as null initially', () => {
      expect(service.token()).toBeNull();
    });

    it('should return null from getUsername() initially', () => {
      expect(service.getUsername()).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set currentUser signal', () => {
      service.setUser(mockAuth);
      expect(service.currentUser()).toEqual(mockAuth);
    });

    it('should persist user to localStorage', () => {
      service.setUser(mockAuth);
      const stored = JSON.parse(localStorage.getItem('gr_user')!);
      expect(stored).toEqual(mockAuth);
    });

    it('should persist token to localStorage', () => {
      service.setUser(mockAuth);
      expect(localStorage.getItem('gr_token')).toBe('fake-jwt-token');
    });

    it('should update isAuthenticated to true', () => {
      service.setUser(mockAuth);
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should update token signal', () => {
      service.setUser(mockAuth);
      expect(service.token()).toBe('fake-jwt-token');
    });

    it('should return username from getUsername()', () => {
      service.setUser(mockAuth);
      expect(service.getUsername()).toBe('testuser');
    });

    it('should set isAdmin to false for USER role', () => {
      service.setUser(mockAuth);
      expect(service.isAdmin()).toBeFalse();
    });

    it('should set isAdmin to true for ADMIN role', () => {
      service.setUser(mockAdminAuth);
      expect(service.isAdmin()).toBeTrue();
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      service.setUser(mockAuth);
    });

    it('should set currentUser to null', () => {
      service.clear();
      expect(service.currentUser()).toBeNull();
    });

    it('should remove user from localStorage', () => {
      service.clear();
      expect(localStorage.getItem('gr_user')).toBeNull();
    });

    it('should remove token from localStorage', () => {
      service.clear();
      expect(localStorage.getItem('gr_token')).toBeNull();
    });

    it('should set isAuthenticated to false', () => {
      service.clear();
      expect(service.isAuthenticated()).toBeFalse();
    });

    it('should set token to null', () => {
      service.clear();
      expect(service.token()).toBeNull();
    });

    it('should return null from getUsername() after clear', () => {
      service.clear();
      expect(service.getUsername()).toBeNull();
    });
  });

  describe('loadUser from localStorage on construction', () => {
    it('should load user from localStorage if present', () => {
      localStorage.setItem('gr_user', JSON.stringify(mockAuth));
      localStorage.setItem('gr_token', 'fake-jwt-token');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const freshService = TestBed.inject(AuthContextService);
      expect(freshService.currentUser()).toEqual(mockAuth);
      expect(freshService.isAuthenticated()).toBeTrue();
      expect(freshService.token()).toBe('fake-jwt-token');
    });
  });
});
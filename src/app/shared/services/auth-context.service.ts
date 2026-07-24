import { Injectable, signal, computed } from '@angular/core';
import { AuthResponse } from '../../domain/auth.model';

const USER_KEY = 'gr_user';
const TOKEN_KEY = 'gr_token';

@Injectable({ providedIn: 'root' })
export class AuthContextService {
  private user = signal<AuthResponse | null>(this.loadUser());

  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = computed(() => !!this.user());
  readonly isAdmin = computed(() => this.user()?.role === 'ADMIN');
  readonly token = computed(() => this.user()?.token ?? null);

  private loadUser(): AuthResponse | null {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  setUser(auth: AuthResponse): void {
    localStorage.setItem(USER_KEY, JSON.stringify(auth));
    localStorage.setItem(TOKEN_KEY, auth.token);
    this.user.set(auth);
  }

  clear(): void {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.user.set(null);
  }

  getUsername(): string | null {
    return this.user()?.username ?? null;
  }
}

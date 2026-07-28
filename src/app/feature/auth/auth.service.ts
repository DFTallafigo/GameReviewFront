import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../domain/api-response.model';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../domain/auth.model';
import { AuthContextService } from '../../shared/services/auth-context.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authContext = inject(AuthContextService);
  private readonly url = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.url}/login`, request)
      .pipe(tap(res => this.authContext.setUser(res.data)));
  }

  register(request: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.url}/register`, request)
      .pipe(tap(res => this.authContext.setUser(res.data)));
  }

  logout(): void {
    this.authContext.clear();
  }
}

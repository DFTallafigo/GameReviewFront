import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthContextService } from '../../shared/services/auth-context.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authContext = inject(AuthContextService);
  const token = authContext.token();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};

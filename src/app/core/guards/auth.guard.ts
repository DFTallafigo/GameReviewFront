import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthContextService } from '../../shared/services/auth-context.service';

export const authGuard: CanActivateFn = () => {
  const authContext = inject(AuthContextService);
  const router = inject(Router);

  if (authContext.isAuthenticated()) return true;

  router.navigate(['/login']);
  return false;
};

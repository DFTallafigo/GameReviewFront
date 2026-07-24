import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthContextService } from '../../shared/services/auth-context.service';

export const adminGuard: CanActivateFn = () => {
  const authContext = inject(AuthContextService);
  const router = inject(Router);

  if (authContext.isAuthenticated() && authContext.isAdmin()) return true;

  router.navigate(['/videogames']);
  return false;
};

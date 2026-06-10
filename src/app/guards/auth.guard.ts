import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = (route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  return router.createUrlTree(['/login'], { queryParams: { redirect: state?.url ?? '' } });
};

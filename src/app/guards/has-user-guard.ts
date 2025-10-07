import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const hasUserGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const hasUser = auth.hasUser$.getValue();
  return hasUser ? true : router.createUrlTree(['/acceso']);
};

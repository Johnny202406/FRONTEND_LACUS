import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const isGuestGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const isGuest = auth.user$.getValue();
  return isGuest ? router.createUrlTree(['/carrito']) : true;
};

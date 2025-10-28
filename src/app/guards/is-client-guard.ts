import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const isClientGuard: CanActivateFn = async (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.user()?.tipo_usuario.id === 2 ? true : router.createUrlTree(['/acceso']);
};

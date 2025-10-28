import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
    const router = inject(Router);
    return auth.user()?.tipo_usuario.id === 1 ? true : router.createUrlTree(['/acceso']);
};

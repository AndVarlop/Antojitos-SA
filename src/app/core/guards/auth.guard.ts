import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.logueado()) return true;
  return router.createUrlTree(['/auth/login'], { queryParams: { redirect: state.url } });
};

export const verificadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.logueado()) return router.createUrlTree(['/auth/login']);
  if (!auth.verificado()) return router.createUrlTree(['/auth/verificar']);
  return true;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.logueado()) return router.createUrlTree(['/auth/login']);
  if (!auth.esAdmin()) return router.createUrlTree(['/']);
  return true;
};

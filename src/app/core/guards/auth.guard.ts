import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

function esperarAuth(auth: AuthService) {
  if (auth.inicializado()) return null;
  return toObservable(auth.inicializado).pipe(filter(v => v), take(1));
}

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const check = () => auth.logueado()
    ? true
    : router.createUrlTree(['/auth/login'], { queryParams: { redirect: state.url } });
  const obs = esperarAuth(auth);
  return obs ? obs.pipe(map(check)) : check();
};

export const verificadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const check = () => {
    if (!auth.logueado()) return router.createUrlTree(['/auth/login']);
    if (!auth.verificado()) return router.createUrlTree(['/auth/verificar']);
    return true;
  };
  const obs = esperarAuth(auth);
  return obs ? obs.pipe(map(check)) : check();
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const check = () => {
    if (!auth.logueado()) return router.createUrlTree(['/auth/login']);
    if (!auth.esAdmin()) return router.createUrlTree(['/']);
    return true;
  };
  const obs = esperarAuth(auth);
  return obs ? obs.pipe(map(check)) : check();
};

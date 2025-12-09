import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { canAccessRoute, getDefaultRoute, buildPath, PATH } from '@route/path.route';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  authService.restoreSession();

  if (!authService.isAuthenticated()) {
    router.navigate([buildPath(PATH.auth.signIn)]);
    return false;
  }

  const user = authService.user();

  // Extraer la ruta sin el leading slash y sin query params
  const currentPath = state.url.split('?')[0].replace(/^\//, '');

  // Verificar si el usuario tiene acceso a esta ruta
  if (user && !canAccessRoute(currentPath, user.nivel)) {
    const defaultRoute = getDefaultRoute(user.nivel);
    router.navigate([defaultRoute]);
    return false;
  }

  return true;
};

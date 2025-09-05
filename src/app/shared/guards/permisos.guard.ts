import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LoginService } from 'src/app/pages/00-login/services/login.service';
import { tap } from 'rxjs';

export const permisosGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.checkPermisos(state.url)
    .pipe(
      tap(valid => {
        if (!valid) {
          router.navigateByUrl('/home');
        }
      })
    );
};

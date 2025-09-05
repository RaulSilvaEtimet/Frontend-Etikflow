import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from '../../pages/00-login/services/login.service';
import { SweetAlertService } from '../services/sweet-alert.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const sweetService = inject(SweetAlertService);

  return loginService.getValidarToken()
    .pipe(
      tap((resp: any) => {
        if (resp === null || resp === undefined) {
          router.navigateByUrl('/');
        }

        if (!resp.success) {
          router.navigateByUrl('/');
        } else {
          //TODO: controlar error 
        }
      })
    );
};

// shared/token.interceptor.ts
import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStore } from '../global-store';
import { AlertService } from './alert/alert.service';
import { catchError, first, switchMap, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const globalStore = inject(GlobalStore);
  const alertService = inject(AlertService);

  return globalStore.token$.pipe(
    first(),
    switchMap((token) => {
      const request = token
        ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
        : req;

      return next(request).pipe(
        catchError((err: any) => {
          if (err.status === HttpStatusCode.Unauthorized) {
            globalStore.clearState();
            router.navigate(['./login']);
          }
          if (err.status === HttpStatusCode.Forbidden) {
            alertService.showError([err.error?.message]);
            router.navigate(['.']);
          }
          if (err.status === HttpStatusCode.UnprocessableEntity && token) {
            alertService.showError([err.error?.message]);
          }
          return throwError(() => err);
        })
      );
    })
  );
};

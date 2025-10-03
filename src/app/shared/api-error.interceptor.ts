import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-response.model';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        // si viene en el shape esperado
        const apiError: ApiError = Array.isArray(err.error?.errors)
          ? err.error.errors
          : [{ general: err.error?.message || 'Error desconocido' }];

        return throwError(() => apiError);
      }
      return throwError(() => [{ general: 'Error inesperado' } as Record<string, string>]);
    })
  );
};

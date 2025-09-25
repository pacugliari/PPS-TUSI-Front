import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { delay, finalize } from 'rxjs';
import { Store } from './spinner.store';
import { environment } from '../../../environments/environment';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(Store);

  loading.requestStarted();

  return environment.production
    ? next(req).pipe(finalize(() => loading.requestEnded()))
    : next(req).pipe(
        delay(1000),
        finalize(() => loading.requestEnded())
      );
};

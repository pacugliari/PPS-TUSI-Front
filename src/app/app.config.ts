import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  LOCALE_ID
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiErrorInterceptor } from './shared/api-error.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { tokenInterceptor } from './shared/token.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore(),
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideHttpClient(withInterceptors([apiErrorInterceptor,tokenInterceptor])),
  ],
};

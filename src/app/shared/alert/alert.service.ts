import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SweetAlertService } from './sweet-alert.service';

export enum DismissReason {
  cancel,
  backdrop,
  close,
  esc,
  timer,
  overlay,
  unrelated,
}

export interface AlertResult {
  value?: any;
  dismiss?: DismissReason;
}

@Injectable({
  providedIn: 'root',
  useClass: SweetAlertService,
})
export abstract class AlertService {
  /**
   * Use this to show a succesful alert window to the user.
   *
   * @param message The message to show inside the alert window.
   * @return Observable that returns the reason that the window was closed.
   */
  abstract showSuccess(message: string): Observable<AlertResult>;

  /**
   * Use this to show an alert window to the user that indicates an error.
   *
   * @param message The message to show inside the alert window.
   * @return Observable that returns the reason that the window was closed.
   */
  abstract showError(messages: string[]): Observable<AlertResult>;
}

import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { AlertService, AlertResult } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertService implements AlertService {
  showSuccess(message: string): Observable<AlertResult> {
    return this.getSweetSwal('Éxito', message, 'success');
  }

  showError(messages: string[]): Observable<AlertResult> {
    const html = messages.map((m) => `<p>${m}</p>`).join('');
    return this.getSweetSwal('Error', html, 'error');
  }

  private getSweetSwal(
    title: string,
    message: string,
    icon: SweetAlertIcon
  ): Observable<AlertResult> {
    return from(
      Swal.fire({
        title,
        html: message,
        icon,
        confirmButtonText: 'OK',
      })
    ).pipe(map((result: SweetAlertResult) => result as AlertResult));
  }
}

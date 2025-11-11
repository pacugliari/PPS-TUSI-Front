import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../shared/models/api-response.model';
import { Return } from '../return.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReturnsAdminApiService {
  private readonly baseUrl = `${environment.API_URL}account/returns/admin`;

  constructor(private http: HttpClient) {}

  getDevoluciones(): Observable<ApiResponse<Return[]>> {
    return this.http.get<ApiResponse<Return[]>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: Return.adaptList(res.payload),
      }))
    );
  }

  aprobar(idDevolucion: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/${idDevolucion}/approve`,
      {}
    );
  }

  rechazar(idDevolucion: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/${idDevolucion}/reject`,
      {}
    );
  }

  confirmar(idDevolucion: number): Observable<ApiResponse<void>> {
    return this.http.patch<ApiResponse<void>>(
      `${this.baseUrl}/${idDevolucion}/confirm`,
      {}
    );
  }
}

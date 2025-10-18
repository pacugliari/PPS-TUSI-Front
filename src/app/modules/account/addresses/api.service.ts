import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Direccion, DireccionUpsertDto, Zona } from './addresses.model';

@Injectable({ providedIn: 'root' })
export class AddressesApiService {
  private readonly baseUrl = `${environment.API_URL}account/addresses`;
  private readonly zonesUrl = `${environment.API_URL}account/addresses/options`;

  constructor(private http: HttpClient) {}

  getDirecciones(): Observable<ApiResponse<Direccion[]>> {
    return this.http.get<ApiResponse<any>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: Direccion.adaptList(res?.payload.data ?? []).sort(
          (a, b) => (b.principal ? 1 : 0) - (a.principal ? 1 : 0)
        ),
      }))
    );
  }

  createDireccion(
    payload: DireccionUpsertDto
  ): Observable<ApiResponse<Direccion>> {
    return this.http
      .post<ApiResponse<any>>(this.baseUrl, payload)
      .pipe(
        map((res) => ({ ...res, payload: Direccion.adapt(res?.payload.data) }))
      );
  }

  updateDireccion(
    id: number,
    payload: DireccionUpsertDto
  ): Observable<ApiResponse<Direccion>> {
    return this.http
      .put<ApiResponse<any>>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        map((res) => ({ ...res, payload: Direccion.adapt(res?.payload.data) }))
      );
  }

  deleteDireccion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  setDireccionPrincipal(id: number): Observable<ApiResponse<Direccion>> {
    return this.http
      .patch<ApiResponse<any>>(`${this.baseUrl}/${id}/set-primary`, {})
      .pipe(
        map((res) => ({ ...res, payload: Direccion.adapt(res?.payload.data) }))
      );
  }

  getZonas(): Observable<ApiResponse<Zona[]>> {
    return this.http.get<ApiResponse<any>>(this.zonesUrl).pipe(
      map((res) => ({
        ...res,
        payload: Zona.adaptList(res?.payload ?? []),
      }))
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/api-response.model';
import { Direccion, DireccionUpsertDto } from './addresses.model';

@Injectable({ providedIn: 'root' })
export class AddressesApiService {
  private readonly baseUrl = `${environment.API_URL}account/addresses`;

  constructor(private http: HttpClient) {}

  getDirecciones(): Observable<ApiResponse<Direccion[]>> {
    return this.http.get<ApiResponse<Direccion[]>>(this.baseUrl).pipe(
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Direcciones mockeadas',
          payload: [
            {
              idDireccion: 1,
              calle: 'Av. Siempre Viva',
              numero: '742',
              adicionales: 'Depto A',
              codigoPostal: '1000',
              ciudad: 'Springfield',
              provincia: 'Buenos Aires',
              alias: 'Casa',
              principal: true,
            },
            {
              idDireccion: 2,
              calle: 'Calle Falsa',
              numero: '123',
              adicionales: 'Piso 2',
              codigoPostal: '2000',
              ciudad: 'Shelbyville',
              provincia: 'Santa Fe',
              alias: 'Trabajo',
              principal: false,
            },
          ],
          errors: [],
        } as ApiResponse<Direccion[]>)
      )
    );
  }

  createDireccion(payload: DireccionUpsertDto): Observable<ApiResponse<Direccion>> {
    return this.http.post<ApiResponse<Direccion>>(this.baseUrl, payload).pipe(
      catchError(() =>
        of({
          statusCode: 201,
          success: true,
          message: 'Dirección creada (mock)',
          payload: {
            idDireccion: 99,
            ...payload,
            principal: false,
          },
          errors: [],
        } as ApiResponse<Direccion>)
      )
    );
  }

  updateDireccion(id: number, payload: DireccionUpsertDto): Observable<ApiResponse<Direccion>> {
    return this.http.put<ApiResponse<Direccion>>(`${this.baseUrl}/${id}`, payload).pipe(
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Dirección actualizada (mock)',
          payload: {
            idDireccion: id,
            ...payload,
            principal: false,
          },
          errors: [],
        } as ApiResponse<Direccion>)
      )
    );
  }

  deleteDireccion(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Dirección eliminada (mock)',
          payload: null,
          errors: [],
        } as ApiResponse<void>)
      )
    );
  }

  setDireccionPrincipal(id: number): Observable<ApiResponse<Direccion>> {
    return this.http.post<ApiResponse<Direccion>>(`${this.baseUrl}/${id}/set-primary`, {}).pipe(
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Dirección establecida como principal (mock)',
          payload: {
            idDireccion: id,
            calle: 'Mock Calle',
            numero: '111',
            adicionales: 'Mock piso',
            codigoPostal: '9999',
            ciudad: 'MockCity',
            provincia: 'MockProvincia',
            alias: 'Principal',
            principal: true,
          },
          errors: [],
        } as ApiResponse<Direccion>)
      )
    );
  }
}

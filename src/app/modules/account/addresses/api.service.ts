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
  private readonly zonesUrl = `${environment.API_URL}account/zones`;

  constructor(private http: HttpClient) {}

  getDirecciones(): Observable<ApiResponse<Direccion[]>> {
    return this.http.get<ApiResponse<any>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: Direccion.adaptList(res?.payload ?? []),
      })),
      // Mock "feliz" si falla el backend
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Direcciones mockeadas',
          payload: Direccion.adaptList([
            {
              idDireccion: 1,
              idZona: 1,
              idUsuario: 3,
              direccion: 'Av. Siempre Viva 742',
              localidad: 'Springfield',
              cp: '1000',
              alias: 'Casa',
              adicionales: 'Depto A',
              principal: true,
              createdAt: '2025-09-25T11:13:39.000Z',
              updatedAt: '2025-09-25T11:13:39.000Z',
              usuario: { idUsuario: 3, email: 'usuario@mail.com' },
              zona: { idZona: 1, nombre: 'Zona 1' },
            },
            {
              idDireccion: 2,
              idZona: 2,
              idUsuario: 3,
              direccion: 'Calle Falsa 123',
              localidad: 'Shelbyville',
              cp: '2000',
              alias: 'Trabajo',
              adicionales: 'Piso 2',
              principal: false,
              createdAt: '2025-09-25T11:13:39.000Z',
              updatedAt: '2025-09-25T11:13:39.000Z',
              usuario: { idUsuario: 3, email: 'usuario@mail.com' },
              zona: { idZona: 2, nombre: 'Zona 2' },
            },
          ]),
          errors: [],
        } as ApiResponse<Direccion[]>)
      )
    );
  }

  createDireccion(
    payload: DireccionUpsertDto
  ): Observable<ApiResponse<Direccion>> {
    return this.http.post<ApiResponse<any>>(this.baseUrl, payload).pipe(
      map((res) => ({ ...res, payload: Direccion.adapt(res?.payload) })),
      catchError(() =>
        of({
          statusCode: 201,
          success: true,
          message: 'Dirección creada (mock)',
          payload: Direccion.adapt({
            idDireccion: 99,
            idZona: payload.idZona,
            idUsuario: 3,
            direccion: payload.direccion,
            localidad: payload.localidad,
            cp: payload.cp,
            alias: payload.alias,
            adicionales: payload.adicionales,
            principal: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usuario: { idUsuario: 3, email: 'usuario@mail.com' },
            zona: { idZona: payload.idZona, nombre: 'Zona mock' },
          }),
          errors: [],
        } as ApiResponse<Direccion>)
      )
    );
  }

  updateDireccion(
    id: number,
    payload: DireccionUpsertDto
  ): Observable<ApiResponse<Direccion>> {
    return this.http
      .put<ApiResponse<any>>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        map((res) => ({ ...res, payload: Direccion.adapt(res?.payload) })),
        catchError(() =>
          of({
            statusCode: 200,
            success: true,
            message: 'Dirección actualizada (mock)',
            payload: Direccion.adapt({
              idDireccion: id,
              idZona: payload.idZona,
              idUsuario: 3,
              direccion: payload.direccion,
              localidad: payload.localidad,
              cp: payload.cp,
              alias: payload.alias,
              adicionales: payload.adicionales,
              principal: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              usuario: { idUsuario: 3, email: 'usuario@mail.com' },
              zona: { idZona: payload.idZona, nombre: 'Zona mock' },
            }),
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
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/${id}/set-primary`, {})
      .pipe(
        map((res) => ({ ...res, payload: Direccion.adapt(res?.payload) })),
        catchError(() =>
          of({
            statusCode: 200,
            success: true,
            message: 'Dirección establecida como principal (mock)',
            payload: Direccion.adapt({
              idDireccion: id,
              idZona: 1,
              idUsuario: 3,
              direccion: 'Mock Calle 111',
              localidad: 'MockCity',
              cp: '9999',
              alias: 'Principal',
              adicionales: 'Mock piso',
              principal: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              usuario: { idUsuario: 3, email: 'usuario@mail.com' },
              zona: { idZona: 1, nombre: 'Zona 1' },
            }),
            errors: [],
          } as ApiResponse<Direccion>)
        )
      );
  }

  getZonas(): Observable<ApiResponse<Zona[]>> {
    return this.http.get<ApiResponse<any>>(this.zonesUrl).pipe(
      map((res) => ({
        ...res,
        payload: Zona.adaptList(res?.payload ?? []),
      })),
      // Mock si falla
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Zonas mock',
          payload: Zona.adaptList([
            {
              idZona: 1,
              nombre: 'Zona 1',
              costoEnvio: '300.00',
              createdAt: '2025-09-25T11:13:39.000Z',
              updatedAt: '2025-09-25T11:13:39.000Z',
              ciudad: 'Springfield',
              provincia: 'Buenos Aires',
            },
            {
              idZona: 2,
              nombre: 'Zona 2',
              costoEnvio: '325.00',
              createdAt: '2025-09-25T11:13:39.000Z',
              updatedAt: '2025-09-25T11:13:39.000Z',
              ciudad: 'Shelbyville',
              provincia: 'Santa Fe',
            },
          ]),
          errors: [],
        } as ApiResponse<Zona[]>)
      )
    );
  }
}

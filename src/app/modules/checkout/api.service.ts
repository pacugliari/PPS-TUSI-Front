import { Injectable } from '@angular/core';
import { CheckoutPayload, Direccion, UserProfile } from './checkout.model';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { HttpClient } from '@angular/common/http';

type ApiProfileItem = {
  idPerfil: number;
  idUsuario: number;
  nombre: string;
  tipoDocumento: string;
  dni: number;
  telefono: string;
  createdAt: string;
  updatedAt: string;
  usuario: { idUsuario: number; email: string };
};

type ApiDireccionItem = {
  idDireccion: number;
  idZona: number;
  idUsuario: number;
  direccion: string;
  cp: string;
  alias: string;
  adicionales?: string;
  principal: boolean;
  createdAt: string;
  updatedAt: string;
  usuario: { idUsuario: number; email: string };
  zona: {
    idZona: number;
    nombre: string;
    ciudad: string;
    provincia: string;
    costoEnvio?: number;
  };
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  submitOrder(payload: CheckoutPayload) {
    console.log('[CheckoutService] submitOrder', payload);
    // TODO: integrar API real
  }

  /** Perfil del usuario (ya sin direcciones) */
  getProfile(): Observable<UserProfile | null> {
    return this.http.get<ApiResponse<ApiProfileItem>>('/checkout/profile').pipe(
      map((res) => {
        const item = res?.payload;
        if (!item) return null;
        return {
          nombreCompleto: item.nombre ?? '',
          email: item.usuario?.email ?? '',
          telefono: item.telefono ?? '',
        } as UserProfile;
      }),
      catchError((err) => {
        console.warn('[ApiService] Error perfil, mock:', err);
        const mock: UserProfile = {
          nombreCompleto: 'Usuario Mock',
          email: 'mock@mail.com',
          telefono: '+54 11 4444-0000',
        };
        return of(mock);
      })
    );
  }

  /** Direcciones del usuario (con zona.{ciudad, provincia, costoEnvio}) */
  getDirecciones(): Observable<Direccion[]> {
    return this.http.get<ApiResponse<ApiDireccionItem[]>>('/checkout/direcciones').pipe(
      map((res) => {
        const list = res?.payload ?? [];
        return list.map<Direccion>((d) => ({
          id: d.idDireccion,
          etiqueta: d.alias ?? '',
          calle: d.direccion ?? '',
          cp: d.cp ?? '',
          adicionales: d.adicionales ?? '',
          principal: d.principal ?? false,
          zona: {
            id: d.zona?.idZona ?? d.idZona,
            nombre: d.zona?.nombre ?? '',
            ciudad: d.zona?.ciudad ?? '',
            provincia: d.zona?.provincia ?? '',
            costoEnvio: d.zona?.costoEnvio ?? this.getCostoEnvioMock(d.zona?.idZona ?? d.idZona),
          },
        }));
      }),
      catchError((err) => {
        console.warn('[ApiService] Error direcciones, mock:', err);
        const mock: Direccion[] = [
          {
            id: 1,
            etiqueta: 'Casa',
            calle: 'Av. Siempre Viva 742',
            cp: '1000',
            adicionales: 'Depto A',
            principal: true,
            zona: { id: 1, nombre: 'Zona 1', ciudad: 'Springfield', provincia: 'Buenos Aires', costoEnvio: 2500 },
          },
          {
            id: 2,
            etiqueta: 'Trabajo',
            calle: 'Calle Falsa 123',
            cp: '2000',
            adicionales: 'Piso 2',
            principal: false,
            zona: { id: 2, nombre: 'Zona 2', ciudad: 'Shelbyville', provincia: 'Buenos Aires', costoEnvio: 3800 },
          },
        ];
        return of(mock);
      })
    );
  }

  private getCostoEnvioMock(idZona: number): number {
    switch (idZona) {
      case 1: return 2500;
      case 2: return 3800;
      default: return 3000;
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { CheckoutPayload, Direccion, UserProfile } from './checkout.model';
import { environment } from '../../../environments/environment';

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

type ApiCheckoutOptions = {
  perfil: ApiProfileItem | null;
  direcciones: ApiDireccionItem[];
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  submitOrder(payload: CheckoutPayload) {
    console.log('[CheckoutService] submitOrder', payload);
  }

  getCheckoutOptions(): Observable<{
    profile: UserProfile | null;
    direcciones: Direccion[];
  }> {
    return this.http
      .get<ApiResponse<ApiCheckoutOptions>>(
        `${environment.API_URL}checkout/options`
      )
      .pipe(
        map((res) => {
          const p = res?.payload?.perfil ?? null;
          const d = res?.payload?.direcciones ?? [];

          const profile: UserProfile | null = p
            ? {
                nombreCompleto: p.nombre ?? '',
                email: p.usuario?.email ?? '',
                telefono: p.telefono ?? '',
              }
            : null;

          const direcciones: Direccion[] = d.map((x) => ({
            id: x.idDireccion,
            etiqueta: x.alias ?? '',
            calle: x.direccion ?? '',
            cp: x.cp ?? '',
            adicionales: x.adicionales ?? '',
            principal: x.principal ?? false,
            zona: {
              id: x.zona?.idZona ?? x.idZona,
              nombre: x.zona?.nombre ?? '',
              ciudad: x.zona?.ciudad ?? '',
              provincia: x.zona?.provincia ?? '',
              costoEnvio: x.zona?.costoEnvio ?? 0,
            },
          }));

          return { profile, direcciones };
        })
      );
  }
}

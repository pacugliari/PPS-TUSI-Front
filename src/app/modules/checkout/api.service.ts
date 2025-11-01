import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../../shared/models/api-response.model';
import { CheckoutPayload, Direccion, UserProfile } from './checkout.model';
import { environment } from '../../../environments/environment';
import {
  CheckoutOptions,
  CardValidationResponse,
  ValidateCardRequest,
} from './checkout.types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  submitOrder(payload: {
    formaPago: 'efectivo' | 'electronico';
    productos: { idProducto: number; cantidad: number }[];
    idTarjeta?: number | null;
    idDireccion?: number | null;
    idCupon?: number | null;
  }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${environment.API_URL}checkout/order`,
      payload
    );
  }

  getCheckoutOptions(): Observable<{
    profile: UserProfile | null;
    direcciones: Direccion[];
  }> {
    return this.http
      .get<ApiResponse<CheckoutOptions>>(
        `${environment.API_URL}checkout/options`
      )
      .pipe(
        map((res) => {
          const adapted = CheckoutOptions.adapt(res?.payload);
          const profile: UserProfile | null = adapted.perfil
            ? {
                nombreCompleto: adapted.perfil.nombre,
                email: adapted.perfil.email,
                telefono: adapted.perfil.telefono,
              }
            : null;

          const direcciones: Direccion[] = adapted.direcciones.map((d) => ({
            id: d.id,
            etiqueta: d.alias ?? '',
            calle: d.direccion,
            cp: d.cp ?? '',
            adicionales: d.adicionales ?? '',
            localidad: d.localidad ?? '',
            principal: d.principal,
            zona: {
              id: d.zona.idZona,
              nombre: d.zona.nombre,
              ciudad: d.zona.ciudad,
              provincia: d.zona.provincia,
              costoEnvio: d.zona.costoEnvio,
            },
          }));

          return { profile, direcciones };
        })
      );
  }

  validateCard(
    payload: ValidateCardRequest
  ): Observable<ApiResponse<CardValidationResponse>> {
    return this.http
      .post<ApiResponse<any>>(
        `${environment.API_URL}checkout/validate-card`,
        payload
      )
      .pipe(
        map((res) => {
          const a = CardValidationResponse.adapt(res?.payload);
          return { ...res, payload: a };
        })
      );
  }
}

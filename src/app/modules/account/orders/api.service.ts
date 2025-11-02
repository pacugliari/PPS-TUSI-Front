import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { PedidoDetail, PedidoSummary, ProductRatingDto } from './orders.model';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly baseUrl = `${environment.API_URL}account/orders`;

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<ApiResponse<PedidoSummary[]>> {
    return this.http.get<ApiResponse<PedidoSummary[]>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: PedidoSummary.adaptList(res?.payload ?? []),
      }))
    );
  }

  getPedidoDetalle(id: number): Observable<ApiResponse<PedidoDetail>> {
    return this.http.get<ApiResponse<PedidoDetail>>(`${this.baseUrl}/${id}`);
  }

  cancelarPedido(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/cancel/${id}`, {
      to: 'cancelado',
    });
  }

  marcarEnviado(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/sent/${id}`, {
      to: 'enviado',
    });
  }

  marcarEntregado(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/delivered/${id}`,
      {
        to: 'entregado',
      }
    );
  }
}

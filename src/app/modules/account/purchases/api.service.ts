import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import {
  PedidoDetail,
  PedidoSummary,
  ProductRatingDto,
} from './purchases.model';

@Injectable({ providedIn: 'root' })
export class PurchasesApiService {
  private readonly baseUrl = `${environment.API_URL}account/purchases`;

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<ApiResponse<PedidoSummary[]>> {
    return this.http.get<ApiResponse<any>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: PedidoSummary.adaptList(res?.payload ?? []),
      }))
    );
  }

  getPedidoDetalle(id: number): Observable<ApiResponse<PedidoDetail>> {
    return this.http.get<ApiResponse<PedidoDetail>>(`${this.baseUrl}/${id}`);
  }

  downloadFactura(id: number): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/${id}/invoice`, { responseType: 'blob' })
      .pipe(
        catchError(() => {
          const blob = new Blob([`Factura mock del pedido ${id}`], {
            type: 'application/pdf',
          });
          return of(blob);
        })
      );
  }

  rateProduct(
    idProducto: number,
    dto: ProductRatingDto
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/${idProducto}/rate`,
      dto
    );
  }

  cancelarPedido(id: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/cancel/${id}`, {
      to: 'cancelado',
    });
  }

  devolverProducto(
    idPedido: number,
    idProducto: number,
    dto: { motivo: string; comentario: string }
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/${idPedido}/returns/${idProducto}`,
      dto
    );
  }
}

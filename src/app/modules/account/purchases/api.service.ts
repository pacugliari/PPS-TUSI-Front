import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/api-response.model';
import { PedidoDetail, PedidoSummary } from './purchases.model';

@Injectable({ providedIn: 'root' })
export class PurchasesApiService {
  private readonly baseUrl = `${environment.API_URL}/account/orders`;

  constructor(private http: HttpClient) {}

  getPedidos(): Observable<ApiResponse<PedidoSummary[]>> {
    return this.http.get<ApiResponse<{ rows: any[] }>>(this.baseUrl).pipe(
      map((res) => ({
        ...res,
        payload: PedidoSummary.adaptList(res?.payload?.rows ?? []),
      })),
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Pedidos mock',
          payload: PedidoSummary.adaptList([
            {
              idPedido: 1,
              fecha: '2025-09-25T11:13:39.000Z',
              estado: 'pagado',
              impuestos: '89250.00',
              subtotal: '425000.00',
              total: '514250.00',
              formaPago: 'electronico',
            },
            {
              idPedido: 4,
              fecha: '2025-09-25T11:13:39.000Z',
              estado: 'pendiente',
              impuestos: '70875.00',
              subtotal: '337500.00',
              total: '408375.00',
              formaPago: 'efectivo',
            },
          ]),
          errors: [],
        } as ApiResponse<PedidoSummary[]>)
      )
    );
  }

  getPedidoDetalle(id: number): Observable<ApiResponse<PedidoDetail>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}`).pipe(
      map((res) => ({ ...res, payload: PedidoDetail.adapt(res?.payload) })),
      catchError(() =>
        of({
          statusCode: 200,
          success: true,
          message: 'Detalle mock',
          payload: PedidoDetail.adapt({
            idPedido: id,
            items: [
              {
                articulo:
                  'CPU Water Cooler 240mm Thermaltake TH240 V2 Ultra EX ARGB - LCD DISPLAY',
                precio: '264208.00',
                cantidad: 1,
                subtotal: '264208.00',
              },
              {
                articulo: 'Seguro Envío',
                precio: '1325.16',
                cantidad: 1,
                subtotal: '1325.16',
              },
              {
                articulo: 'Cargo Envío',
                precio: '9583.88',
                cantidad: 1,
                subtotal: '9583.88',
              },
            ],
            total: '275117.04',
          }),
          errors: [],
        } as ApiResponse<PedidoDetail>)
      )
    );
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
}

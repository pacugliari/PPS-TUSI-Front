import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

import {
  CreateOrderDto,
  MarkDeliveredDto,
  ProductToReplenish,
  PurchaseOrder,
  PurchaseOrderDetail,
  adaptOrderDetail,
} from './purchase-orders.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/purchase-orders`;

  list(): Observable<PurchaseOrder[]> {
    return this.http
      .get<ApiResponse<PurchaseOrder[]>>(this.baseUrl)
      .pipe(map((res) => PurchaseOrder.adaptList(res.payload ?? [])));
  }

  details(id: number): Observable<PurchaseOrderDetail> {
    return this.http
      .get<ApiResponse<PurchaseOrderDetail>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => adaptOrderDetail(res.payload)));
  }

  markAsDelivered(
    id: number,
    dto: MarkDeliveredDto
  ): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(
      `${this.baseUrl}/${id}/deliver`,
      dto
    );
  }

  getProductsToReplenish(): Observable<ProductToReplenish[]> {
    return this.http
      .get<ApiResponse<ProductToReplenish[]>>(
        `${this.baseUrl}/generate-preview`
      )
      .pipe(map((res) => res.payload ?? []));
  }

  createOrder(dto: CreateOrderDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.baseUrl}/generate`, dto);
  }
}

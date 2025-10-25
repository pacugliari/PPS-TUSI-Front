import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Producto } from '../models/producto.model';
import { Coupon } from '../models/coupon';

@Injectable({
  providedIn: 'root',
})
export class SharedApiService {
  constructor(private http: HttpClient) {}

  public getProducts(ids: number[]): Observable<ApiResponse<Producto[]>> {
    return this.http.post<ApiResponse<Producto[]>>(
      environment.API_URL + 'cart/products',
      { ids }
    );
  }

  validateCoupon(code: string): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(
      `${environment.API_URL}cart/coupons/validate`,
      {
        code,
      }
    );
  }
}

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

  public getProducts(): Observable<ApiResponse<Producto[]>> {
    return this.http.get<any>(environment.API_URL + 'productos');
  }

  validateCoupon(code: string): Observable<Coupon> {
    return this.http
      .post<ApiResponse<any>>(`${environment.API_URL}/coupons/validate`, {
        code,
      })
      .pipe(
        map((res) => Coupon.adapt(res?.payload)),
        catchError(() =>
          of(new Coupon(code, code.toUpperCase() === 'BIENVENIDO10' ? 10 : 0))
        )
      );
  }
}

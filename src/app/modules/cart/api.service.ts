import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/api-response.model';
import { Coupon } from './cart.model';

@Injectable({ providedIn: 'root' })
export class CartApiService {
  private readonly baseUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

  validateCoupon(code: string): Observable<Coupon> {
    return this.http
      .post<ApiResponse<any>>(`${this.baseUrl}/coupons/validate`, {
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

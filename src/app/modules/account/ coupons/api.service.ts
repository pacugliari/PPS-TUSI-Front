import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Coupon, CouponUpsertDto, CouponsOptions, User } from './coupons.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CouponsApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.API_URL}account/coupons`;

  list(): Observable<Coupon[]> {
    return this.http
      .get<ApiResponse<Coupon[]>>(this.base)
      .pipe(map((response) => Coupon.adaptList(response.payload ?? [])));
  }

  options(): Observable<CouponsOptions> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.base}/options`)
      .pipe(map((response) => ({ users: User.adaptList(response.payload ?? []) })));
  }

  create(dto: CouponUpsertDto): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(this.base, dto);
  }

  update(idCupon: number, dto: CouponUpsertDto): Observable<ApiResponse<Coupon>> {
    return this.http.put<ApiResponse<Coupon>>(`${this.base}/${idCupon}`, dto);
  }

  remove(idCupon: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${idCupon}`);
  }
}

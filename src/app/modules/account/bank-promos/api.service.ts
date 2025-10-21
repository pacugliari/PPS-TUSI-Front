import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {
  BankPromo,
  BankPromoUpsertDto,
  BankPromoOptions,
} from './bank-promos.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BankPromosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/bank-promos`;

  list() {
    return this.http
      .get<ApiResponse<BankPromo[]>>(this.baseUrl)
      .pipe(map((res) => BankPromo.adaptList(res.payload ?? [])));
  }

  create(dto: BankPromoUpsertDto) {
    return this.http.post<ApiResponse<any>>(this.baseUrl, dto);
  }

  update(id: number, dto: BankPromoUpsertDto) {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }

  getOptions() {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/options`)
      .pipe(map((res) => BankPromoOptions.adapt(res.payload)));
  }
}

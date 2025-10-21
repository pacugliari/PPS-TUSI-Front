import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Bank, BankUpsertDto } from './banks.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BanksApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/banks`;

  list(): Observable<Bank[]> {
    return this.http
      .get<ApiResponse<Bank[]>>(this.baseUrl)
      .pipe(map((res) => Bank.adaptList(res.payload ?? [])));
  }

  create(dto: BankUpsertDto) {
    return this.http.post<ApiResponse<any>>(this.baseUrl, dto);
  }

  update(idBanco: number, dto: BankUpsertDto) {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${idBanco}`, dto);
  }

  delete(idBanco: number) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${idBanco}`);
  }
}

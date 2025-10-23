import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Brand, BrandUpsertDto } from './brands.model';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class BrandApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/brands`;

  getAll() {
    return this.http.get<{ payload: any[] }>(this.baseUrl);
  }

  create(dto: BrandUpsertDto) {
    return this.http.post<ApiResponse<Brand>>(this.baseUrl, dto);
  }

  update(id: number, dto: BrandUpsertDto) {
    return this.http.put<ApiResponse<Brand>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import {
  CarouselPrincipal,
  CarouselPrincipalUpsertDto,
} from './carousel-principal.model';

@Injectable({ providedIn: 'root' })
export class CarouselPrincipalApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/carousel-principal`;

  list() {
    return this.http
      .get<ApiResponse<any[]>>(this.baseUrl)
      .pipe(map((r) => CarouselPrincipal.adaptList(r.payload ?? [])));
  }

  create(dto: CarouselPrincipalUpsertDto) {
    return this.http.post<ApiResponse<any>>(this.baseUrl, dto);
  }

  update(id: number, dto: CarouselPrincipalUpsertDto) {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
}

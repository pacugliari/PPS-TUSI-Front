import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import {
  CarouselPrincipal,
  CarouselPrincipalUpsertDto,
  dtoToFormData,
} from './carousel-principal.model';

@Injectable({ providedIn: 'root' })
export class CarouselPrincipalApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/carousel-principal`;

  list() {
    return this.http
      .get<ApiResponse<CarouselPrincipal[]>>(this.baseUrl)
      .pipe(map((r) => CarouselPrincipal.adaptList(r.payload ?? [])));
  }

  create(dto: CarouselPrincipalUpsertDto & { file?: File | null }) {
    if (dto.file instanceof File) {
      const fd = dtoToFormData(dto, dto.file);
      return this.http.post<ApiResponse<CarouselPrincipal>>(this.baseUrl, fd);
    }

    const { file, ...body } = dto;
    return this.http.post<ApiResponse<CarouselPrincipal>>(this.baseUrl, body);
  }

  update(id: number, dto: CarouselPrincipalUpsertDto & { file?: File | null }) {
    if (dto.file instanceof File) {
      const fd = dtoToFormData(dto, dto.file);
      return this.http.put<ApiResponse<CarouselPrincipal>>(
        `${this.baseUrl}/${id}`,
        fd
      );
    }

    const { file, ...body } = dto;
    return this.http.put<ApiResponse<CarouselPrincipal>>(
      `${this.baseUrl}/${id}`,
      body
    );
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}

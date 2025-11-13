import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { CarouselMarca, CarouselMarcaUpsertDto } from './carousel-marcas.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarouselMarcasApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/carousel-marcas`;

  list() {
    return this.http
      .get<ApiResponse<any[]>>(this.baseUrl)
      .pipe(map((res) => CarouselMarca.adaptList(res.payload ?? [])));
  }

  create(dto: CarouselMarcaUpsertDto) {
    return this.http.post<ApiResponse<any>>(this.baseUrl, dto);
  }

  update(id: number, dto: CarouselMarcaUpsertDto) {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`);
  }
}

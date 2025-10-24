import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Feature, FeatureUpsertDto } from './features.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FeaturesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/features`;

  list(): Observable<Feature[]> {
    return this.http
      .get<ApiResponse<Feature[]>>(this.baseUrl)
      .pipe(map((res) => Feature.adaptList(res.payload ?? [])));
  }

  create(dto: FeatureUpsertDto) {
    return this.http.post<ApiResponse<Feature>>(this.baseUrl, dto);
  }

  update(id: number, dto: FeatureUpsertDto) {
    return this.http.put<ApiResponse<Feature>>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}

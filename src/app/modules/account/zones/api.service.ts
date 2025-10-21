import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Zone, ZoneUpsertDto } from './zones.model';

@Injectable({ providedIn: 'root' })
export class ZonesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/zones`;

  list(): Observable<Zone[]> {
    return this.http
      .get<ApiResponse<Zone[]>>(this.baseUrl)
      .pipe(map((res) => Zone.adaptList(res.payload ?? [])));
  }

  create(dto: ZoneUpsertDto): Observable<ApiResponse<Zone>> {
    return this.http.post<ApiResponse<Zone>>(this.baseUrl, dto);
  }

  update(idZona: number, dto: ZoneUpsertDto): Observable<ApiResponse<Zone>> {
    return this.http.put<ApiResponse<Zone>>(`${this.baseUrl}/${idZona}`, dto);
  }

  delete(idZona: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${idZona}`);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Category, CategoryUpsertDto } from './categories.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/categories`;

  list(): Observable<Category[]> {
    return this.http
      .get<ApiResponse<Category[]>>(this.baseUrl)
      .pipe(map((res) => Category.adaptList(res.payload ?? [])));
  }

  create(dto: CategoryUpsertDto) {
    return this.http.post<ApiResponse<Category>>(this.baseUrl, dto);
  }

  update(id: number, dto: CategoryUpsertDto) {
    return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}

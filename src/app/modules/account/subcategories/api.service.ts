import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {
  SubCategory,
  SubCategoryUpsertDto,
  SubCategoryOptions,
} from './subcategories.model';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubCategoriesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}account/subcategories`;

  list() {
    return this.http
      .get<ApiResponse<SubCategory[]>>(this.baseUrl)
      .pipe(map((res) => SubCategory.adaptList(res.payload ?? [])));
  }

  options() {
    return this.http
      .get<ApiResponse<SubCategoryOptions>>(`${this.baseUrl}/options`)
      .pipe(map((res) => SubCategoryOptions.adapt(res.payload)));
  }

  create(dto: SubCategoryUpsertDto) {
    return this.http.post<ApiResponse<SubCategory>>(this.baseUrl, dto);
  }

  update(id: number, dto: SubCategoryUpsertDto) {
    return this.http.put<ApiResponse<SubCategory>>(
      `${this.baseUrl}/${id}`,
      dto
    );
  }

  remove(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}

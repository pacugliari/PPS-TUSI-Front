import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';
import { Product, ProductOptions, ProductUpsertDto } from './products.model';
import { dtoToFormData } from './products.util';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly baseUrl = `${environment.API_URL}account/products`;

  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<any>>(this.baseUrl)
      .pipe(map((res) => Product.adaptList(res?.payload ?? [])));
  }

  options(): Observable<ProductOptions> {
    return this.http
      .get<ApiResponse<ProductOptions>>(`${this.baseUrl}/options`)
      .pipe(map((res) => ProductOptions.adapt(res?.payload ?? {})));
  }

  create(
    dto: ProductUpsertDto,
    files?: File[]
  ): Observable<ApiResponse<Product>> {
    const hasFiles = Array.isArray(files) && files.length > 0;

    if (hasFiles) {
      const fd = dtoToFormData(dto, files);
      return this.http.post<ApiResponse<Product>>(this.baseUrl, fd);
    }

    const body = {
      ...dto,
      fotos: dto.fotos.slice(0, 3),
    };
    return this.http.post<ApiResponse<Product>>(this.baseUrl, body);
  }

  update(
    idProducto: number,
    dto: ProductUpsertDto,
    files?: File[]
  ): Observable<ApiResponse<Product>> {
    const hasFiles = Array.isArray(files) && files.length > 0;

    if (hasFiles) {
      const fd = dtoToFormData(dto, files);
      return this.http.put<ApiResponse<Product>>(
        `${this.baseUrl}/${idProducto}`,
        fd
      );
    }

    return this.http.put<ApiResponse<Product>>(
      `${this.baseUrl}/${idProducto}`,
      dto
    );
  }

  remove(idProducto: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${idProducto}`);
  }
}

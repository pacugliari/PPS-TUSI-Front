import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import {
  ApiProductoDto,
  ApiProductoLiteDto,
  Product,
  ProductAdapter,
  ProductCard,
} from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private base = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http
      .get<ApiResponse<any>>(`${this.base}shop/products/${id}`)
      .pipe(
        map((res) => {
          return {
            ...res,
            payload: ProductAdapter.fromApi(res.payload.data),
          } as ApiResponse<Product>;
        })
      );
  }

  getLatest() {
    return this.http
      .get<ApiResponse<ApiProductoLiteDto[]>>(`${this.base}home/latestProducts`)
      .pipe(
        map(
          (res) =>
            ({
              ...res,
              payload: (res?.payload ?? []).map(ProductAdapter.liteFromApi),
            } as ApiResponse<ProductCard[]>)
        )
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto } from './index.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public getPopularProducts(): Observable<Producto[]> {
    return this.http
      .get<ApiResponse<Producto[]>>(
        environment.API_URL + 'home/popularProducts'
      )
      .pipe(map((res) => res?.payload?.map(Producto.adapt) ?? []));
  }

  public getLatestProducts(): Observable<Producto[]> {
    return this.http
      .get<ApiResponse<Producto[]>>(environment.API_URL + 'home/latestProducts')
      .pipe(map((res) => res?.payload?.map(Producto.adapt) ?? []));
  }
}

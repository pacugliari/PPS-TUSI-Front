import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Producto, CarouselPrincipal, CarouselMarca } from './index.model';
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

  public getCarouselSlides(): Observable<CarouselPrincipal[]> {
    return this.http
      .get<ApiResponse<CarouselPrincipal[]>>(
        environment.API_URL + 'home/carousel'
      )
      .pipe(map((res) => res?.payload ?? []));
  }

  public getCarouselBrands(): Observable<CarouselMarca[]> {
    return this.http
      .get<ApiResponse<CarouselMarca[]>>(
        environment.API_URL + 'home/carousel-brands'
      )
      .pipe(map((res) => res?.payload ?? []));
  }
}

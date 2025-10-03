import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../api-response.model';
import { Producto } from './producto.model';

@Injectable({
  providedIn: 'root',
})
export class SharedApiService {
  constructor(private http: HttpClient) {}

  public getProducts(): Observable<ApiResponse<Producto[]>> {
    return this.http.get<any>(environment.API_URL + 'products');
  }
}

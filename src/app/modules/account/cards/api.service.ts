import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, Observable } from 'rxjs';
import {
  Bank,
  Card,
  CardCreateRequest,
  CardValidateRequest,
} from './cards.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  constructor(private http: HttpClient) {}

  list(): Observable<Card[]> {
    return this.http
      .get<ApiResponse<{ data: Card[] }>>(`${environment.API_URL}account/cards`)
      .pipe(map((res) => res?.payload?.data ?? []));
  }

  options(): Observable<Bank[]> {
    return this.http
      .get<ApiResponse<Bank[]>>(`${environment.API_URL}account/cards/options`)
      .pipe(map((res) => res?.payload ?? []));
  }

  create(body: CardCreateRequest): Observable<ApiResponse<Card>> {
    return this.http.post<ApiResponse<Card>>(
      `${environment.API_URL}account/cards`,
      body
    );
  }

  delete(idTarjeta: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${environment.API_URL}account/cards/${idTarjeta}`
    );
  }
}

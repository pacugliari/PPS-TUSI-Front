import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, Observable } from 'rxjs';
import { ApiResponse, Card, CardCreateRequest, CardValidateRequest } from './cards.model';

@Injectable({ providedIn: 'root' })
export class CardsApiService {
  constructor(private http: HttpClient) {}

  list(): Observable<Card[]> {
    return this.http.get<ApiResponse<Card[]>>('account/cards').pipe(
      map(res => res?.payload ?? []),
      catchError(err => {
        console.warn('[CardsApiService] list error, mock ->', err);
        const mock: Card[] = [
          {
            idTarjeta: 145,
            tipo: 'VISA',
            last4: '1111',
            maskedNumber: '**** **** **** 1111',
            createdAt: new Date().toISOString(),
          },
          {
            idTarjeta: 146,
            tipo: 'MASTERCARD',
            last4: '4444',
            maskedNumber: '**** **** **** 4444',
            createdAt: new Date().toISOString(),
          },
        ];
        return of(mock);
      })
    );
  }

  create(body: CardCreateRequest): Observable<Card> {
    return this.http.post<ApiResponse<Card>>('account/cards', body).pipe(
      map(res => res?.payload as Card),
      catchError(err => {
        console.warn('[CardsApiService] create error, mock ->', err);
        const last4 = body.numero.slice(-4);
        const mock: Card = {
          idTarjeta: Math.floor(Math.random() * 10000) + 100,
          tipo: body.tipo,
          last4,
          maskedNumber: `**** **** **** ${last4}`,
          createdAt: new Date().toISOString(),
        };
        return of(mock);
      })
    );
  }

  delete(idTarjeta: number): Observable<{ idTarjeta: number }> {
    return this.http.delete<ApiResponse<{ idTarjeta: number }>>(`account/cards/${idTarjeta}`).pipe(
      map(res => res?.payload ?? { idTarjeta }),
      catchError(err => {
        console.warn('[CardsApiService] delete error, mock ->', err);
        return of({ idTarjeta });
      })
    );
  }
}

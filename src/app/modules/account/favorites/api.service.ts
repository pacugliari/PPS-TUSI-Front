import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Favorite } from './favorites.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  constructor(private http: HttpClient) {}

  getProductsByIds(ids: number[]): Observable<Favorite[]> {
    return this.http
      .post<ApiResponse<Favorite[]>>(
        `${environment.API_URL}account/favorites`,
        { ids }
      )
      .pipe(map((res) => Favorite.adaptList(res.payload ?? [])));
  }
}

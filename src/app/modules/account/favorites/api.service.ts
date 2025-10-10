import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Favorite } from './favorites.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritesApiService {
  constructor(private http: HttpClient) {}

  //TODO
  /*getProductsByIds(ids: number[]): Observable<Favorite[]> {
    return this.http.post<Favorite[]>('/account/favorites', { ids });
  }*/

  getProductsByIds(ids: number[]): Observable<Favorite[]> {
    return this.http.get<any>(`${environment.API_URL}productos`).pipe(
      map((res) => {
        const all = res?.payload ?? [];
        const idSet = new Set(ids);

        return all
          .filter((p: any) => idSet.has(Number(p.idProducto)))
          .map(Favorite.adapt);
      })
    );
  }
}

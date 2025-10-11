import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { GlobalStore } from '../../../global-store';
import { ApiError } from '../../../shared/models/api-response.model';
import { FavoritesApiService } from './api.service';
import { Favorite } from './favorites.model';

export interface FavoritesState {
  isLoading: boolean;
  products: Favorite[];
  errors: ApiError | null;
}

const initialState: FavoritesState = {
  isLoading: false,
  products: [],
  errors: null,
};

@Injectable()
export class FavoritesStore extends ComponentStore<FavoritesState> {
  private readonly api = inject(FavoritesApiService);
  private readonly global = inject(GlobalStore);

  constructor() {
    super(initialState);
    this.connectFavorites();
  }

  readonly vm$ = this.select(({ isLoading, products, errors }) => ({
    isLoading,
    products,
    errors,
  }));

  private readonly connectFavorites = this.effect<void>(() =>
    this.global.favorites$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      switchMap((ids) => {
        const idSet = new Set(ids);
        const order = new Map<number, number>();
        ids.forEach((id, i) => order.set(id, i));

        return this.api.getProductsByIds(ids).pipe(
          map((list) =>
            [...list].sort(
              (a, b) =>
                (order.get(a.idProducto) ?? 0) - (order.get(b.idProducto) ?? 0)
            )
          ),
          tapResponse({
            next: (products) => this.patchState({ products }),
            error: (errors: ApiError) => {
              console.error(errors);
              this.patchState({ products: [], errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        );
      }),
      catchError(() => {
        this.patchState({ isLoading: false });
        return of([]);
      })
    )
  );

  removeFavorite(id: number) {
    this.global.removeFavorite(id);
  }

  addToCart(p: Favorite) {
    this.global.addToCart({ producto: p, cantidad: 1 });
  }

  addAllToCart(list: Favorite[]) {
    list.forEach((p) => this.global.addToCart({ producto: p, cantidad: 1 }));
  }
}

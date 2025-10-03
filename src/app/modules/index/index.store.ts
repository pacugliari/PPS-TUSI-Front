import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../shared/api-response.model';
import { Producto } from '../../shared/api/producto.model';
import { SharedApiService } from '../../shared/api/api.service';

export interface State {
  isLoading: boolean;
  popularProducts: Producto[] | null;
  latestProducts: Producto[] | null;
  errors: any;
}

const InitialState: State = {
  isLoading: false,
  popularProducts: null,
  latestProducts: null,
  errors: null,
};

@Injectable()
export class Store extends ComponentStore<State> {
  constructor(
    private readonly apiService: SharedApiService,
    private readonly alertService: AlertService
  ) {
    super(InitialState);
  }

  readonly loadData = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.apiService.getProducts().pipe(
          tapResponse({
            next: (response) => {
              const products = response.payload ?? [];
              const lastFour = products.slice(-4);
              this.patchState({
                popularProducts: lastFour,
                latestProducts: lastFour,
              });
            },
            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({
                errors,
              });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly vm$ = this.select(
    ({ isLoading, popularProducts, latestProducts, errors }) => ({
      isLoading,
      popularProducts,
      latestProducts,
      errors,
    })
  );
}

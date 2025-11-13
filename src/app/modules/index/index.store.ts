import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, forkJoin, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../shared/models/api-response.model';
import { ApiService } from './api.service';
import { Producto, CarouselMarca, CarouselPrincipal } from './index.model';

export interface State {
  isLoading: boolean;
  popularProducts: Producto[] | null;
  latestProducts: Producto[] | null;
  slides: CarouselPrincipal[] | null;
  brands: CarouselMarca[] | null;
  errors: any;
}

const InitialState: State = {
  isLoading: false,
  popularProducts: null,
  latestProducts: null,
  slides: null,
  brands: null,
  errors: null,
};

@Injectable()
export class Store extends ComponentStore<State> {
  constructor(
    private readonly apiService: ApiService,
    private readonly alertService: AlertService
  ) {
    super(InitialState);
  }

  readonly slides$ = this.select((s) => s.slides);

  readonly loadData = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),

      exhaustMap(() =>
        forkJoin({
          popular: this.apiService.getPopularProducts(),
          latest: this.apiService.getLatestProducts(),
          slides: this.apiService.getCarouselSlides(),
          brands: this.apiService.getCarouselBrands(),
        }).pipe(
          tapResponse({
            next: ({ popular, latest, slides, brands }) => {
              this.patchState({
                popularProducts: popular,
                latestProducts: latest,
                slides,
                brands,
              });
            },

            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                (Array.isArray(errors) ? errors : [errors]).flatMap((err) =>
                  Object.values(err)
                )
              );
              this.patchState({ errors });
            },

            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly vm$ = this.select(
    ({
      isLoading,
      popularProducts,
      latestProducts,
      slides,
      brands,
      errors,
    }) => ({
      isLoading,
      popularProducts,
      latestProducts,
      slides,
      brands,
      errors,
    })
  );
}

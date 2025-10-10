import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../shared/models/api-response.model';
import { Producto } from './shop.model';
import { ApiService } from './api.service';

export interface State {
  isLoading: boolean;
  products: Producto[] | null;
  errors: any;
  page: number; // 1-based
  pageSize: number; // = 6
}

const InitialState: State = {
  isLoading: false,
  products: null,
  errors: null,
  page: 1,
  pageSize: 6,
};

@Injectable()
export class Store extends ComponentStore<State> {
  constructor(
    private readonly apiService: ApiService,
    private readonly alertService: AlertService
  ) {
    super(InitialState);
  }

  //Selectors
  readonly totalPages$ = this.select(({ products, pageSize }) =>
    Math.max(1, Math.ceil((products?.length ?? 0) / pageSize))
  );

  readonly pagedProducts$ = this.select(
    this.select((s) => s.products),
    this.select((s) => s.page),
    this.select((s) => s.pageSize),
    (products, page, pageSize) => {
      const list = products ?? [];
      const start = (page - 1) * pageSize;
      return list.slice(start, start + pageSize);
    }
  );

  readonly pages$ = this.select(this.totalPages$, (t) =>
    Array.from({ length: t }, (_, i) => i + 1)
  );

  readonly vm$ = this.select(
    this.select((s) => s.isLoading),
    this.pagedProducts$,
    this.select((s) => s.errors),
    this.select((s) => s.page),
    this.totalPages$,
    this.pages$,
    (isLoading, products, errors, page, totalPages, pages) => ({
      isLoading,
      products,
      errors,
      page,
      totalPages,
      pages,
    })
  );

  //Updaters
  readonly setPage = this.updater<number>((state, page) => {
    const total = state.products?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    const clamped = Math.min(Math.max(1, page), totalPages);
    return { ...state, page: clamped };
  });

  readonly nextPage = this.updater((state) => {
    const total = state.products?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    return { ...state, page: Math.min(state.page + 1, totalPages) };
  });

  readonly prevPage = this.updater((state) => ({
    ...state,
    page: Math.max(1, state.page - 1),
  }));

  //Effects
  readonly loadData = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null, page: 1 })),
      exhaustMap(() =>
        this.apiService.getProducts().pipe(
          tapResponse({
            next: (response) => {
              const products = response.payload ?? [];
              this.patchState({ products });

              const totalPages = Math.max(
                1,
                Math.ceil(products.length / this.get().pageSize)
              );
              if (this.get().page > totalPages) this.setPage(totalPages);
            },
            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );
}

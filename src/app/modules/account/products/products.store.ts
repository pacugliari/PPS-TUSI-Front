import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, tap, withLatestFrom } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { ProductsApiService } from './api.service';
import { Product, ProductOptions, ProductUpsertDto } from './products.model';
import { ApiError } from '../../../shared/models/api-response.model';
import { AlertService } from '../../../shared/alert/alert.service';

type SavePayload = {
  id?: number | null;
  dto: ProductUpsertDto;
  files?: File[];
};

interface ProductsState {
  isLoading: boolean;
  products: Product[];
  options: ProductOptions | null;
  selected: Product | null;
  showForm: boolean;
  errors: ApiError | null;
}

@Injectable()
export class ProductsStore extends ComponentStore<ProductsState> {
  private readonly api = inject(ProductsApiService);
  private readonly alert = inject(AlertService);

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    products: s.products,
    options: s.options,
    selected: s.selected,
    showForm: s.showForm,
    errors: s.errors,
  }));

  constructor() {
    super({
      isLoading: false,
      products: [],
      options: null,
      selected: null,
      showForm: false,
      errors: null,
    });
    this.load();
    this.loadOptions();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (res) =>
              this.patchState({
                products: res ?? [],
              }),
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly loadOptions = this.effect<void>((o$) =>
    o$.pipe(
      exhaustMap(() =>
        this.api.options().pipe(
          tapResponse({
            next: (res) => this.patchState({ options: res ?? null }),
            error: (errors: ApiError) => this.patchState({ errors }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      tap(() =>
        this.patchState({
          selected: null,
          showForm: true,
          errors: null,
        })
      )
    )
  );

  readonly openEdit = this.effect<Product>((p$) =>
    p$.pipe(
      tap((p) =>
        this.patchState({
          selected: p,
          showForm: true,
          errors: null,
        })
      )
    )
  );

  readonly backToList = this.effect<void>((o$) =>
    o$.pipe(
      tap(() =>
        this.patchState({
          selected: null,
          showForm: false,
          errors: null,
        })
      )
    )
  );

  readonly save = this.effect<SavePayload>((payload$) =>
    payload$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      withLatestFrom(this.select((s) => s.selected)),
      exhaustMap(([{ id, dto, files }, selected]) => {
        const hasId = !!id;
        const call$ = hasId
          ? this.api.update(id as number, dto, files)
          : this.api.create(dto, files);

        return call$.pipe(
          tapResponse({
            next: (response) => {
              const photoErrors = Array.isArray(response?.errors)
                ? response.errors
                : [];
              if (photoErrors.length) {
                const flat = photoErrors
                  .map((e) => Object.entries(e).map(([k, v]) => `${k}: ${v}`))
                  .flat();
                this.alert.showError(flat);
              } else {
                this.alert.showSuccess(response.message);
              }
              this.patchState({ showForm: false, selected: null });
              this.load();
            },
            error: (errors: ApiError) => {
              this.alert.showError(errors.flatMap((e) => Object.values(e)));
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        );
      })
    )
  );

  readonly remove = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap((id) =>
        this.api.remove(id).pipe(
          tapResponse({
            next: (response) => {
              this.alert.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alert.showError(errors.flatMap((e) => Object.values(e)));
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );
}

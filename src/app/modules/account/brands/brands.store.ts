import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { BrandApiService } from './api.service';
import { BrandDialogComponent } from './brand-dialog.component';
import { Brand, BrandUpsertDto } from './brands.model';

interface BrandsState {
  isLoading: boolean;
  isSubmitting: boolean;
  brands: Brand[];
  errors: ApiError | null;
}

@Injectable()
export class BrandsStore extends ComponentStore<BrandsState> {
  private readonly api = inject(BrandApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    isSubmitting: s.isSubmitting,
    brands: s.brands,
    error: s.errors,
  }));

  constructor() {
    super({
      isLoading: false,
      isSubmitting: false,
      brands: [],
      errors: null,
    });
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.getAll().pipe(
          tapResponse({
            next: (res) => {
              this.patchState({ brands: res.payload ?? [] });
            },
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly remove = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((id) =>
        this.api.delete(id).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      switchMap(() =>
        this.dialog
          .open(BrandDialogComponent, {
            data: { mode: 'create' } as const,
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is BrandUpsertDto => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((dto) =>
        this.api.create(dto).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openEdit = this.effect<Brand>((brand$) =>
    brand$.pipe(
      switchMap((brand) =>
        this.dialog
          .open(BrandDialogComponent, {
            data: { mode: 'edit', brand } as const,
            width: 'auto',
          })
          .afterClosed()
          .pipe(
            filter((dto): dto is BrandUpsertDto => !!dto),
            tap((dto) => this.update({ id: brand.idMarca, dto }))
          )
      )
    )
  );

  readonly update = this.effect<{ id: number; dto: BrandUpsertDto }>((in$) =>
    in$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(({ id, dto }) =>
        this.api.update(id, dto).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );
}

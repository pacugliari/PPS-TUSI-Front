import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

import {
  BankPromo,
  BankPromoUpsertDto,
  BankPromoOptions,
  SimpleBank,
} from './bank-promos.model';
import { MatDialog } from '@angular/material/dialog';
import { BankPromoDialogComponent } from './bank-promo-dialog.component';

import { switchMap, filter, tap, exhaustMap, withLatestFrom } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { BankPromosApiService } from './api.service';

export interface BankPromosState {
  isLoading: boolean;
  isSubmitting: boolean;
  promos: BankPromo[];
  bancos: SimpleBank[];
  errors: ApiError | null;
}

const initialState: BankPromosState = {
  isLoading: false,
  isSubmitting: false,
  promos: [],
  bancos: [],
  errors: null,
};

@Injectable()
export class BankPromosStore extends ComponentStore<BankPromosState> {
  private readonly api = inject(BankPromosApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select(({ isLoading, promos }) => ({
    isLoading,
    promos,
  }));

  constructor() {
    super(initialState);
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (promos) => this.patchState({ promos, isLoading: false }),
            error: (err: any) =>
              this.patchState({ isLoading: false, errors: err }),
          })
        )
      )
    )
  );

  readonly loadOptions = this.effect<void>((o$) =>
    o$.pipe(
      exhaustMap(() =>
        this.api.getOptions().pipe(
          tapResponse({
            next: (opts: BankPromoOptions) =>
              this.patchState({ bancos: opts.bancos }),
            error: () => void 0,
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      withLatestFrom(this.select((s) => s.bancos)),
      switchMap(([, bancos]) =>
        this.dialog
          .open(BankPromoDialogComponent, {
            data: { mode: 'create', bancos } as const,
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is BankPromoUpsertDto => !!dto),
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
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openEdit = this.effect<BankPromo>((promo$) =>
    promo$.pipe(
      withLatestFrom(this.select((s) => s.bancos)),
      switchMap(([promo, bancos]) =>
        this.dialog
          .open(BankPromoDialogComponent, {
            data: { mode: 'edit', promo, bancos } as const,
            width: 'auto',
          })
          .afterClosed()
          .pipe(
            filter((dto): dto is BankPromoUpsertDto => !!dto),
            tap((dto) => this.update({ id: promo.idPromocionBancaria, dto }))
          )
      )
    )
  );

  readonly update = this.effect<{ id: number; dto: BankPromoUpsertDto }>(
    (in$) =>
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
                  errors.flatMap((e) => Object.values(e))
                );
                this.patchState({ errors });
              },
              finalize: () => this.patchState({ isSubmitting: false }),
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
                errors.flatMap((e) => Object.values(e))
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

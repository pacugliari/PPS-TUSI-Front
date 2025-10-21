import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Bank, BankUpsertDto } from './banks.model';
import { MatDialog } from '@angular/material/dialog';
import { BankDialogComponent } from './bank-dialog.component';
import { switchMap, filter, tap, exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { BanksApiService } from './api.service';

export interface BanksState {
  isLoading: boolean;
  isSubmitting: boolean;
  banks: Bank[];
  errors: ApiError | null;
}

const initialState: BanksState = {
  isLoading: false,
  isSubmitting: false,
  banks: [],
  errors: null,
};

@Injectable()
export class BanksStore extends ComponentStore<BanksState> {
  private readonly api = inject(BanksApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select(({ isLoading, banks }) => ({ isLoading, banks }));

  constructor() {
    super(initialState);
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (banks) => this.patchState({ banks, isLoading: false }),
            error: (errors: ApiError) =>
              this.patchState({ isLoading: false, errors }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      switchMap(() =>
        this.dialog
          .open(BankDialogComponent, {
            data: { mode: 'create' } as const,
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is BankUpsertDto => !!dto),
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

  readonly openEdit = this.effect<Bank>((bank$) =>
    bank$.pipe(
      switchMap((bank) =>
        this.dialog
          .open(BankDialogComponent, {
            data: { mode: 'edit', bank } as const,
            width: 'auto',
          })
          .afterClosed()
          .pipe(
            filter((dto): dto is BankUpsertDto => !!dto),
            tap((dto) => this.update({ idBanco: bank.idBanco, dto }))
          )
      )
    )
  );

  readonly update = this.effect<{ idBanco: number; dto: BankUpsertDto }>(
    (in$) =>
      in$.pipe(
        tap(() => this.patchState({ isSubmitting: true, errors: null })),
        exhaustMap(({ idBanco, dto }) =>
          this.api.update(idBanco, dto).pipe(
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
      exhaustMap((idBanco) =>
        this.api.delete(idBanco).pipe(
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

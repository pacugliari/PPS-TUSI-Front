import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MatDialog } from '@angular/material/dialog';
import { Coupon, CouponUpsertDto, User } from './coupons.model';
import { CouponDialogComponent } from './coupon-dialog.component';
import { exhaustMap, filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { forkJoin } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { CouponsApiService } from './api.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { AlertService } from '../../../shared/alert/alert.service';

interface CouponsState {
  isLoading: boolean;
  isSubmitting: boolean;
  coupons: Coupon[];
  users: User[];
  errors: ApiError | null;
}

@Injectable()
export class CouponsStore extends ComponentStore<CouponsState> {
  private readonly api = inject(CouponsApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    isSubmitting: s.isSubmitting,
    coupons: s.coupons,
    error: s.errors,
  }));

  constructor() {
    super({
      isLoading: false,
      isSubmitting: false,
      coupons: [],
      users: [],
      errors: null,
    });
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        forkJoin({
          coupons: this.api.list(),
          options: this.api.options(),
        }).pipe(
          tapResponse({
            next: ({ coupons, options }) => {
              this.patchState({
                coupons,
                users: options.users ?? [],
              });
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
        this.api.remove(id).pipe(
          tapResponse({
            next: (response) =>
             {
              this.alertService.showSuccess(response.message)
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
      withLatestFrom(this.select((s) => s.users)),
      switchMap(([_, users]) =>
        this.dialog
          .open(CouponDialogComponent, {
            data: { mode: 'create', users },
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is CouponUpsertDto => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((dto) =>
        this.api.create(dto).pipe(
          tapResponse({
            next: (response) =>
             {
              this.alertService.showSuccess(response.message)
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

  readonly openEdit = this.effect<Coupon>((coupon$) =>
    coupon$.pipe(
      withLatestFrom(this.select((s) => s.users)),
      switchMap(([coupon, users]) =>
        this.dialog
          .open(CouponDialogComponent, {
            data: { mode: 'edit', coupon, users },
            width: 'auto',
          })
          .afterClosed()
          .pipe(withLatestFrom(this.select((_) => coupon.idCupon)))
      ),
      filter(([dto]) => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(([dto, id]) =>
        this.api.update(id as number, dto as CouponUpsertDto).pipe(
          tapResponse({
            next: (response) =>
             {
              this.alertService.showSuccess(response.message)
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

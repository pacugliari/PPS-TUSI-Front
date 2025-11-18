import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tap, exhaustMap, filter, switchMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { MatDialog } from '@angular/material/dialog';

import { PurchaseOrder, PurchaseOrderDetail } from './purchase-orders.model';
import { ApiService } from './api.service';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';

import { PurchaseOrderDetailComponent } from './purchase-order-detail.component';
import { PurchaseOrderGenerateDialogComponent } from './purchase-order-generate-dialog.component';
import {
  DeliveredItemData,
  DeliveredPayload,
  PurchaseOrderDeliveredDialogComponent,
} from './purchase-order-delivered-dialog.component';

export interface PurchaseOrdersState {
  isLoading: boolean;
  isSubmitting: boolean;
  orders: PurchaseOrder[];
  selected: PurchaseOrderDetail | null;
  errors: ApiError | null;
}

const initialState: PurchaseOrdersState = {
  isLoading: false,
  isSubmitting: false,
  orders: [],
  selected: null,
  errors: null,
};

@Injectable()
export class PurchaseOrdersStore extends ComponentStore<PurchaseOrdersState> {
  private readonly api = inject(ApiService);
  private readonly alert = inject(AlertService);
  private readonly dialog = inject(MatDialog);

  readonly vm$ = this.select(({ isLoading, orders }) => ({
    isLoading,
    orders,
  }));

  constructor() {
    super(initialState);
    this.load();
  }

  readonly load = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (orders) => this.patchState({ orders, isLoading: false }),
            error: (err: ApiError) => {
              this.alert.showError(err.flatMap((e) => Object.values(e)));
              this.patchState({ errors: err, isLoading: false });
            },
          })
        )
      )
    )
  );

  readonly openDetails = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isLoading: true, selected: null })),
      exhaustMap((id) =>
        this.api.details(id).pipe(
          tapResponse({
            next: (detail) => {
              this.patchState({ selected: detail, isLoading: false });
              this.dialog.open(PurchaseOrderDetailComponent, {
                width: '65vw',
                maxWidth: '65vw',
                data: detail,
              });
            },
            error: (err: ApiError) => {
              this.alert.showError(err.flatMap((e) => Object.values(e)));
              this.patchState({ errors: err, isLoading: false });
            },
          })
        )
      )
    )
  );

  readonly markDelivered = this.effect<{
    idOrdenCompra: number;
    dto: DeliveredPayload;
  }>((ev$) =>
    ev$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(({ idOrdenCompra, dto }) =>
        this.api.markAsDelivered(idOrdenCompra, dto).pipe(
          tapResponse({
            next: (res) => {
              this.alert.showSuccess(res.message);
              this.load();
            },
            error: (err: ApiError) => {
              this.alert.showError(err.flatMap((e) => Object.values(e)));
              this.patchState({ errors: err });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openDeliveredDialog = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap((idOrdenCompra) =>
        this.api.details(idOrdenCompra).pipe(
          switchMap((detail) => {
            this.patchState({ isLoading: false });

            const data: DeliveredItemData[] = detail.items.map((it) => ({
              idItemOrdenCompra: it.idItemOrdenCompra,
              nombre: it.nombre,
              cantidad: it.cantidad,
            }));

            const ref = this.dialog.open(
              PurchaseOrderDeliveredDialogComponent,
              {
                width: '70vw',
                maxWidth: '70vw',
                data,
              }
            );

            return ref.afterClosed().pipe(
              filter((payload): payload is DeliveredPayload => !!payload),
              switchMap((payload) =>
                this.api.markAsDelivered(idOrdenCompra, payload).pipe(
                  tapResponse({
                    next: (res) => {
                      this.alert.showSuccess(res.message);
                      this.load();
                    },
                    error: (err: ApiError) => {
                      this.alert.showError(
                        err.flatMap((e) => Object.values(e))
                      );
                      this.patchState({ errors: err });
                    },
                  })
                )
              )
            );
          }),
          tapResponse({
            next: () => {},
            error: (err: ApiError) => {
              this.alert.showError(err.flatMap((e) => Object.values(e)));
              this.patchState({ errors: err, isLoading: false });
            },
          })
        )
      )
    )
  );

  readonly generateOrder = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.getProductsToReplenish().pipe(
          switchMap((items) => {
            this.patchState({ isLoading: false });

            if (!items.length) {
              this.alert.showSuccess('No hay productos para reponer.');
              return [];
            }

            const dialogRef = this.dialog.open(
              PurchaseOrderGenerateDialogComponent,
              {
                width: '80vw',
                maxWidth: '80vw',
                data: items,
              }
            );

            return dialogRef.afterClosed();
          }),
          filter((payload) => !!payload),
          exhaustMap((payload) =>
            this.api.createOrder(payload).pipe(
              tapResponse({
                next: (res) => {
                  this.alert.showSuccess(res.message);
                  this.load();
                },
                error: (err: ApiError) => {
                  this.alert.showError(err.flatMap((e) => Object.values(e)));
                  this.patchState({ errors: err });
                },
              })
            )
          )
        )
      )
    )
  );
}

import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, switchMap, take, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ApiError } from '../../../shared/models/api-response.model';
import { OrdersApiService } from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseDetailComponent } from './orders-detail.component';
import { PedidoDetail, PedidoSummary, ProductRatingDto } from './orders.model';
import { AlertService } from '../../../shared/alert/alert.service';

export interface OrdersState {
  isLoading: boolean;
  downloading: boolean;
  pedidos: PedidoSummary[];
  selected: PedidoDetail | null;
  showDetail: boolean;
  errors: ApiError | null;
}

const initialState: OrdersState = {
  isLoading: false,
  downloading: false,
  pedidos: [],
  selected: null,
  showDetail: false,
  errors: null,
};

@Injectable()
export class OrdersStore extends ComponentStore<OrdersState> {
  private readonly api = inject(OrdersApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  constructor() {
    super(initialState);
    this.loadPedidos();
  }

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    downloading: s.downloading,
    pedidos: s.pedidos,
    selected: s.selected,
    showDetail: s.showDetail,
  }));

  readonly loadPedidos = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.getPedidos().pipe(
          tapResponse({
            next: (res) => this.patchState({ pedidos: res.payload ?? [] }),
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly openDetail = this.effect<number>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, selected: null })),
      exhaustMap((idPedido) =>
        this.api.getPedidoDetalle(idPedido).pipe(
          tapResponse({
            next: (res) => {
              const detail = res.payload;
              this.patchState({ selected: detail, showDetail: !!detail });

              if (!detail) return;

              const ref = this.dialog.open(PurchaseDetailComponent, {
                width: '60vw',
                maxWidth: '900px',
                maxHeight: '90vh',
                data: detail,
              });

              ref
                .afterClosed()
                .pipe(take(1))
                .subscribe((result) => {
                  this.patchState({ showDetail: false, selected: null });
                });
            },
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly cancelarPedido = this.effect<number>((id$) =>
    id$.pipe(
      switchMap((id) =>
        this.api.cancelarPedido(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.loadPedidos();
            },
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly marcarEnviado = this.effect<number>((id$) =>
    id$.pipe(
      switchMap((id) =>
        this.api.marcarEnviado(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.loadPedidos();
            },
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

    readonly marcarEntregado = this.effect<number>((id$) =>
    id$.pipe(
      switchMap((id) =>
        this.api.marcarEntregado(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.loadPedidos();
            },
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );
}

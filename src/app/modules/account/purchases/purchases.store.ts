import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, switchMap, take, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ApiError } from '../../../shared/models/api-response.model';
import { PurchasesApiService } from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseDetailComponent } from './purchase-detail.component';
import {
  PedidoDetail,
  PedidoSummary,
  ProductRatingDto,
} from './purchases.model';
import { AlertService } from '../../../shared/alert/alert.service';

export interface PurchasesState {
  isLoading: boolean;
  downloading: boolean;
  pedidos: PedidoSummary[];
  selected: PedidoDetail | null;
  showDetail: boolean;
  errors: ApiError | null;
}

const initialState: PurchasesState = {
  isLoading: false,
  downloading: false,
  pedidos: [],
  selected: null,
  showDetail: false,
  errors: null,
};

@Injectable()
export class PurchasesStore extends ComponentStore<PurchasesState> {
  private readonly api = inject(PurchasesApiService);
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
                  if (result) {
                    if (result.puntuacion) {
                      const dto: ProductRatingDto = {
                        puntuacion: Number(result.puntuacion),
                        comentario: result.comentario ?? null,
                      };
                      this.submitRating({ idProducto: result.idProducto, dto });
                    } else if (result.motivo) {
                      const dto = {
                        motivo: result.motivo,
                        comentario: result.comentario ?? null,
                      };
                      this.submitReturn({
                        idPedido: result.idPedido,
                        idProducto: result.idProducto,
                        dto,
                      });
                    }
                  }
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

  readonly submitRating = this.effect<{
    idProducto: number;
    dto: ProductRatingDto;
  }>((data$) =>
    data$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(({ idProducto, dto }) =>
        this.api.rateProduct(idProducto, dto).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(
                res.message ?? 'Calificación enviada'
              );
              this.loadPedidos();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly submitReturn = this.effect<{
    idPedido: number;
    idProducto: number;
    dto: { motivo: string; comentario: string };
  }>((data$) =>
    data$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(({ idPedido, idProducto, dto }) =>
        this.api.devolverProducto(idPedido, idProducto, dto).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(
                res.message ?? 'Devolución registrada'
              );
              this.loadPedidos();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly downloadInvoice = this.effect<number>(($) =>
    $.pipe(
      tap(() => this.patchState({ downloading: true })),
      exhaustMap((id) =>
        this.api.downloadFactura(id).pipe(
          tap((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `factura-${id}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
          }),
          tap(() => this.patchState({ downloading: false }))
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
}

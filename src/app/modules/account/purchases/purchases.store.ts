import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, take, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ApiError } from '../../../shared/models/api-response.model';
import { PurchasesApiService } from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseDetailComponent } from './purchase-detail.component';
import { PedidoDetail, PedidoSummary } from './purchases.model';

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
      exhaustMap((id) =>
        this.api.getPedidoDetalle(id).pipe(
          tapResponse({
            next: (res) => {
              const detail = res.payload;
              this.patchState({ selected: detail, showDetail: !!detail });

              if (detail) {
                const ref = this.dialog.open(PurchaseDetailComponent, {
                  width: 'auto',
                  data: detail,
                });

                ref
                  .afterClosed()
                  .pipe(take(1))
                  .subscribe(() => {
                    this.patchState({ showDetail: false, selected: null });
                  });
              }
            },
            error: (errors: ApiError) => this.patchState({ errors }),
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
}

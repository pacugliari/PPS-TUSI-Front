import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, map, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { GlobalStore } from '../../global-store';
import { ApiError } from '../../shared/api-response.model';
import { CartApiService } from './api.service';
import { CartLine, Coupon, CartTotals } from './cart.model';
import { AlertService } from '../../shared/alert/alert.service';

export interface CartState {
  isLoading: boolean;
  applyingCoupon: boolean;
  lines: CartLine[];
  coupon: Coupon | null;
  errors: ApiError | null;
}

const initialState: CartState = {
  isLoading: false,
  applyingCoupon: false,
  lines: [],
  coupon: null,
  errors: null,
};

@Injectable()
export class CartStore extends ComponentStore<CartState> {
  private readonly api = inject(CartApiService);
  private readonly global = inject(GlobalStore);
  private readonly alertService = inject(AlertService);

  constructor() {
    super(initialState);
  }

  readonly subtotal$ = this.select((s) =>
    s.lines.reduce((acc, l) => acc + l.total, 0)
  );

  readonly totals$ = this.select(
    this.subtotal$,
    this.select((s) => s.coupon),
    (subtotal, coupon): CartTotals => {
      const percent = coupon?.percent ?? 0;
      const discount = percent > 0 ? (subtotal * percent) / 100 : 0;
      return { subtotal, discount, total: Math.max(0, subtotal - discount) };
    }
  );

  readonly vm$ = this.select(
    this.select((s) => s.isLoading),
    this.select((s) => s.applyingCoupon),
    this.select((s) => s.lines),
    this.totals$,
    (isLoading, applyingCoupon, lines, totals) => ({
      isLoading,
      applyingCoupon,
      lines,
      totals,
    })
  );

  readonly setLines = this.updater<CartLine[]>((s, lines) => ({ ...s, lines }));
  readonly setCoupon = this.updater<Coupon | null>((s, coupon) => ({
    ...s,
    coupon,
  }));

  readonly loadData = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      switchMap(() => this.global.cart$),
      map((cart) => {
        if (!cart || cart.length === 0) {
          return [] as CartLine[];
        }
        return cart.map((c) => {
          const qty = c.cantidad ?? 1;
          const product = {
            idProducto: c.idProducto,
            nombre: c.nombre,
            precio: c.precio ?? 0,
            imagen: c.imagen ?? '',
          };

          return new CartLine(product, qty);
        });
      }),
      tap((lines) => {
        this.patchState({ lines, isLoading: false });
      })
    )
  );

  readonly applyCoupon = this.effect<string>(($) =>
    $.pipe(
      tap(() => this.patchState({ applyingCoupon: true })),
      switchMap((code) =>
        this.api.validateCoupon(code).pipe(
          tapResponse({
            next: (coupon) => {
              if (
                coupon &&
                typeof coupon.percent === 'number' &&
                coupon.percent > 0
              ) {
                this.setCoupon(coupon);
                this.alertService.showSuccess(
                  `Cupón aplicado: ${coupon.code ?? code} (-${
                    coupon.percent
                  }%).`
                );
              } else {
                this.setCoupon(null);
                this.alertService.showError([
                  `El cupón "${code}" no es válido o no tiene descuento.`,
                ]);
              }
            },
            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                (Array.isArray(errors) ? errors : [errors]).flatMap((e) =>
                  Object.values(e)
                )
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ applyingCoupon: false }),
          })
        )
      )
    )
  );

  inc = (idProducto: number, current: number) =>
    this.global.updateQuantity({ idProducto, cantidad: current + 1 });

  dec = (idProducto: number, current: number) =>
    this.global.updateQuantity({
      idProducto,
      cantidad: Math.max(1, current - 1),
    });

  remove = (idProducto: number) => this.global.removeFromCart(idProducto);

  clear = () => this.global.clearCart();
}

// cart.store.ts (extracto)
import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { switchMap, map, tap } from 'rxjs';
import { GlobalStore } from '../../global-store';
import { ApiError } from '../../shared/models/api-response.model';
import { CartLine, CartTotals } from './cart.model';

export interface CartState {
  isLoading: boolean;
  lines: CartLine[];
  errors: ApiError | null;
}

const initialState: CartState = {
  isLoading: false,
  lines: [],
  errors: null,
};

@Injectable()
export class CartStore extends ComponentStore<CartState> {
  private readonly global = inject(GlobalStore);

  constructor() {
    super(initialState);
  }

  readonly subtotal$ = this.select((s) =>
    s.lines.reduce((acc, l) => acc + l.total, 0)
  );

  readonly totals$ = this.select(
    this.subtotal$,
    this.global.discountPercent$,
    (subtotal, percent): CartTotals => {
      const discount = percent > 0 ? (subtotal * percent) / 100 : 0;
      return { subtotal, discount, total: Math.max(0, subtotal - discount) };
    }
  );

  readonly vm$ = this.select(
    this.select((s) => s.isLoading),
    this.select((s) => s.lines),
    this.totals$,
    this.global.coupon$, // <-- lo exponemos al componente
    this.global.isApplyingCoupon$, // <-- idem
    (isLoading, lines, totals, coupon, applyingCoupon) => ({
      isLoading,
      lines,
      totals,
      coupon,
      applyingCoupon,
    })
  );

  readonly setLines = this.updater<CartLine[]>((s, lines) => ({ ...s, lines }));

  readonly loadData = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      switchMap(() => this.global.cart$),
      map((cart) => {
        if (!cart || cart.length === 0) return [] as CartLine[];
        return cart.map(
          (c) =>
            new CartLine(
              {
                idProducto: c.idProducto,
                nombre: c.nombre,
                precio: c.precio ?? 0,
                imagen: c.imagen ?? '',
              },
              c.cantidad ?? 1
            )
        );
      }),
      tap((lines) => this.patchState({ lines, isLoading: false }))
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

  applyCoupon = (code: string) => {
    this.global.applyCoupon(code); // llama al effect del GlobalStore
  };

  clearCoupon = () => {
    this.global.clearCoupon(); // llama al effect del GlobalStore
  };
}

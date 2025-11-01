// checkout.store.ts
import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, tap, withLatestFrom } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { GlobalStore } from '../../global-store';
import { ApiError, ApiResponse } from '../../shared/models/api-response.model';
import { ApiService } from './api.service';
import {
  UserProfile,
  Direccion,
  MetodoEnvio,
  MetodoPago,
  CheckoutVM,
  CheckoutPayload,
} from './checkout.model';
import { AlertService } from '../../shared/alert/alert.service';
import {
  CardsTypes,
  CardValidationResponse,
  ValidateCardRequest,
} from './checkout.types';
import { Router } from '@angular/router';

interface State {
  isLoadingOptions: boolean;
  optionsLoaded: boolean;
  profile: UserProfile | null;
  addresses: Direccion[];
  selectedAddressId: number | null;
  metodoEnvio: MetodoEnvio;
  metodoPago: MetodoPago;
  costoEnvioDomicilio: number;

  cardLoading: boolean;
  cardValid: boolean | null;
  cardError: string | null;
  tarjetaSeleccionada: CardsTypes | null;
  ultimos4: string;
  codigoValidacion: string;

  promoDescripcion: string | null;
  promoPercent: number;
  idTarjeta: number | null;
  errors: ApiError | null;
}

@Injectable()
export class CheckoutStore extends ComponentStore<State> {
  private readonly api = inject(ApiService);
  private readonly global = inject(GlobalStore);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  constructor() {
    super({
      isLoadingOptions: false,
      optionsLoaded: false,
      profile: null,
      addresses: [],
      selectedAddressId: null,
      metodoEnvio: 'DOMICILIO',
      metodoPago: 'ONLINE',
      costoEnvioDomicilio: 0,
      cardLoading: false,
      cardValid: null,
      cardError: null,
      tarjetaSeleccionada: null,
      ultimos4: '',
      codigoValidacion: '',
      promoDescripcion: null,
      promoPercent: 0,
      errors: null,
      idTarjeta: null,
    });

    this.loadOptions();
  }

  readonly vm$ = this.select(
    this.state$,
    this.global.cart$,
    this.global.discountPercent$,
    this.global.coupon$,
    (s, items, couponPercent, coupon) => {
      const safeItems = Array.isArray(items) ? items : [];
      const subtotalNeto = safeItems.reduce(
        (acc, it) => acc + Number(it.precio || 0) * Number(it.cantidad || 0),
        0
      );

      const descuentoCupon =
        couponPercent > 0 ? (subtotalNeto * couponPercent) / 100 : 0;
      const baseTrasCupon = Math.max(0, subtotalNeto - descuentoCupon);

      const descuentoPromo =
        s.cardValid && s.promoPercent > 0
          ? (baseTrasCupon * s.promoPercent) / 100
          : 0;

      const baseFinal = Math.max(0, baseTrasCupon - descuentoPromo);

      // 🔸 Cálculo de IVA después de los descuentos
      let ivaTotal = 0;
      const ivaMap = new Map<number, number>();

      for (const it of safeItems) {
        const netoItem = Number(it.precio || 0) * Number(it.cantidad || 0);
        const share = subtotalNeto > 0 ? netoItem / subtotalNeto : 0;

        const descCuponItem = descuentoCupon * share;
        const baseItemTrasCupon = Math.max(0, netoItem - descCuponItem);
        const descPromoItem =
          (s.cardValid && s.promoPercent > 0 ? s.promoPercent / 100 : 0) *
          baseItemTrasCupon;
        const baseItemFinal = Math.max(0, baseItemTrasCupon - descPromoItem);

        const rate = Number(it.iva || 0);
        const ivaItem = baseItemFinal * (rate / 100);

        ivaTotal += ivaItem;
        ivaMap.set(rate, (ivaMap.get(rate) || 0) + ivaItem);
      }

      const ivaItems = Array.from(ivaMap.entries())
        .map(([rate, amount]) => ({ rate, amount }))
        .sort((a, b) => b.rate - a.rate);

      const costoEnvio =
        s.metodoEnvio === 'RETIRO' ? 0 : Number(s.costoEnvioDomicilio) || 0;

      const totalConIva = baseFinal + ivaTotal + costoEnvio;

      const vm: CheckoutVM & {
        isLoadingOptions: boolean;
        cardLoading: boolean;
        cardValid: boolean | null;
        cardError: string | null;
        promoDescripcion: string | null;
        promoPercent: number;
        descuentoCupon: number;
        descuentoPromo: number;
        ivaItems: { rate: number; amount: number }[];
      } = {
        profile: s.profile,
        direcciones: s.addresses,
        selectedAddressId: s.selectedAddressId,
        subtotal: subtotalNeto,
        descuento: descuentoCupon + descuentoPromo,
        descuentoCupon,
        descuentoPromo,
        total: baseFinal, // solo neto sin IVA
        percent: couponPercent,
        coupon,
        metodoEnvio: s.metodoEnvio,
        metodoPago: s.metodoPago,
        costoEnvioDomicilio: s.costoEnvioDomicilio,
        totalConEnvio: baseFinal + ivaTotal + costoEnvio,
        iva: ivaTotal,
        totalConIva,
        tarjetaSeleccionada: s.tarjetaSeleccionada,
        ultimos4: s.ultimos4,
        codigoValidacion: s.codigoValidacion,
        isLoadingOptions: s.isLoadingOptions,
        cardLoading: s.cardLoading,
        cardValid: s.cardValid,
        cardError: s.cardError,
        promoDescripcion: s.promoDescripcion,
        promoPercent: s.promoPercent,
        ivaItems,
      };
      return vm;
    }
  );

  readonly setMetodoEnvio = this.updater<MetodoEnvio>((s, v) => {
    const dir =
      s.selectedAddressId != null
        ? s.addresses.find((a) => a.id === s.selectedAddressId)
        : undefined;
    return {
      ...s,
      metodoEnvio: v,
      costoEnvioDomicilio: dir?.zona?.costoEnvio ?? 0,
    };
  });

  readonly setMetodoPago = this.updater<MetodoPago>((s, v) => {
    if (v === 'EFECTIVO') {
      return {
        ...s,
        metodoPago: v,
        metodoEnvio: 'RETIRO',
        tarjetaSeleccionada: null,
        ultimos4: '',
        codigoValidacion: '',
        cardValid: null,
        cardError: null,
        promoDescripcion: null,
        promoPercent: 0,
      };
    }
    return { ...s, metodoPago: v };
  });
  readonly setSelectedAddressId = this.updater<number | null>((s, id) => {
    const dir = id != null ? s.addresses.find((a) => a.id === id) : undefined;
    return {
      ...s,
      selectedAddressId: id,
      costoEnvioDomicilio: dir?.zona?.costoEnvio ?? 0,
    };
  });

  readonly setTarjetaSeleccionada = this.updater<CardsTypes | null>((s, t) => ({
    ...s,
    tarjetaSeleccionada: t,
    cardValid: null,
    cardError: null,
    promoDescripcion: null,
    promoPercent: 0,
  }));

  readonly setUltimos4 = this.updater<string>((s, v) => ({
    ...s,
    ultimos4: v,
    cardValid: null,
    cardError: null,
    promoPercent: 0,
  }));

  readonly setCodigoValidacion = this.updater<string>((s, v) => ({
    ...s,
    codigoValidacion: v,
    cardValid: null,
    cardError: null,
    promoPercent: 0,
  }));

  readonly loadOptions = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoadingOptions: true, errors: null })),
      exhaustMap(() =>
        this.api.getCheckoutOptions().pipe(
          tapResponse({
            next: ({ profile, direcciones }) => {
              const principalId =
                direcciones.find((d) => d.principal)?.id ??
                direcciones[0]?.id ??
                null;
              const costo = principalId
                ? direcciones.find((d) => d.id === principalId)?.zona
                    ?.costoEnvio ?? 0
                : 0;

              this.patchState({
                profile,
                addresses: direcciones,
                selectedAddressId: principalId,
                costoEnvioDomicilio: costo,
                optionsLoaded: true,
              });
            },
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoadingOptions: false }),
          })
        )
      )
    )
  );

  readonly validateCard = this.effect<void>((o$) =>
    o$.pipe(
      tap(() =>
        this.patchState({
          cardLoading: true,
          cardError: null,
          cardValid: null,
          promoDescripcion: null,
          promoPercent: 0,
        })
      ),
      exhaustMap(() => {
        const s = this.get();
        const payload: ValidateCardRequest = {
          cardBrand: s.tarjetaSeleccionada!,
          last4: s.ultimos4,
          cvv: s.codigoValidacion,
        };
        return this.api.validateCard(payload).pipe(
          tapResponse({
            next: (res: ApiResponse<CardValidationResponse>) => {
              const { payload, message } = res;
              const percent = payload?.promocion?.porcentaje
                ? Number(payload.promocion.porcentaje)
                : 0;
              this.patchState({
                cardValid: !!payload?.valida,
                promoDescripcion: payload?.promocion?.nombre ?? null,
                promoPercent: percent,
                idTarjeta: payload?.idTarjeta ?? null,
              });
              this.alertService.showSuccess(message);
            },
            error: (error: ApiError) => {
              const errors = error.flatMap((e) => Object.values(e));
              this.alertService.showError(errors);
              this.patchState({ cardValid: false });
            },
            finalize: () => this.patchState({ cardLoading: false }),
          })
        );
      })
    )
  );

  readonly confirmar = this.effect<number>((totalConIva$) =>
    totalConIva$.pipe(
      withLatestFrom(this.global.cart$, this.global.coupon$),
      exhaustMap(([totalConIva, cartItems, coupon]) => {
        const s = this.get();

        const can =
          (s.metodoEnvio === 'RETIRO' ||
            (!!s.selectedAddressId && s.addresses.length > 0)) &&
          (s.metodoPago === 'EFECTIVO'
            ? s.metodoEnvio === 'RETIRO'
            : !!s.tarjetaSeleccionada &&
              !!s.ultimos4 &&
              !!s.codigoValidacion &&
              s.cardValid === true);

        if (!can) return [];

        type OrderCreatePayload = {
          formaPago: 'efectivo' | 'electronico';
          productos: { idProducto: number; cantidad: number }[];
          idTarjeta?: number | null;
          idDireccion?: number | null;
          idCupon?: number | null;
        };

        const payload: OrderCreatePayload = {
          formaPago: s.metodoPago === 'EFECTIVO' ? 'efectivo' : 'electronico',
          productos: (cartItems ?? []).map((c: any) => ({
            idProducto: Number(c.idProducto),
            cantidad: Number(c.cantidad ?? 1),
          })),
          ...(s.metodoEnvio === 'DOMICILIO' && s.selectedAddressId
            ? { idDireccion: s.selectedAddressId }
            : {}),
          ...(coupon?.idCupon ? { idCupon: coupon.idCupon } : {}),
          ...(s.metodoPago === 'ONLINE' && s.idTarjeta
            ? { idTarjeta: s.idTarjeta }
            : {}),
        };

        return this.api.submitOrder(payload).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message ?? 'Pedido creado');
              if (payload.idCupon) {
                this.global.clearCoupon();
              }
              this.global.clearCart();
              this.router.navigate(['/account'], {
                queryParams: { tab: 'compras' },
              });
            },
            error: (err: any) => {
              const errors = Array.isArray(err)
                ? err.flatMap((e: any) => Object.values(e))
                : [err?.message ?? 'Error al crear el pedido'];
              this.alertService.showError(errors);
            },
          })
        );
      })
    )
  );
}

import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { combineLatest, filter, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { GlobalStore } from '../../global-store';
import {
  CheckoutVM,
  MetodoEnvio,
  MetodoPago,
  CheckoutPayload,
  UserProfile,
  Direccion,
} from './checkout.model';
import { ApiService } from './api.service';

interface CheckoutState {
  profile: UserProfile | null;
  addresses: Direccion[];
  selectedAddressId: number | null;

  metodoEnvio: MetodoEnvio;
  metodoPago: MetodoPago;
  costoEnvioDomicilio: number;

  tarjetaSeleccionada: string | null;
  ultimos4: string;
  codigoValidacion: string;

  optionsLoaded: boolean;
  isLoadingOptions: boolean;
}

const initialState: CheckoutState = {
  profile: null,
  addresses: [],
  selectedAddressId: null,

  metodoEnvio: 'DOMICILIO',
  metodoPago: 'ONLINE',
  costoEnvioDomicilio: 0,

  tarjetaSeleccionada: null,
  ultimos4: '',
  codigoValidacion: '',

  optionsLoaded: false,
  isLoadingOptions: false,
};

@Injectable()
export class CheckoutStore extends ComponentStore<CheckoutState> {
  private readonly global = inject(GlobalStore);
  private readonly api = inject(ApiService);

  constructor() {
    super(initialState);
    this.loadOptions();
  }

  // Selectores
  readonly profile$ = this.select((s) => s.profile);
  readonly addresses$ = this.select((s) => s.addresses);
  readonly selectedAddressId$ = this.select((s) => s.selectedAddressId);

  readonly metodoEnvio$ = this.select((s) => s.metodoEnvio);
  readonly metodoPago$ = this.select((s) => s.metodoPago);
  readonly costoEnvioDomicilio$ = this.select((s) => s.costoEnvioDomicilio);

  readonly tarjetaSeleccionada$ = this.select((s) => s.tarjetaSeleccionada);
  readonly ultimos4$ = this.select((s) => s.ultimos4);
  readonly codigoValidacion$ = this.select((s) => s.codigoValidacion);

  readonly optionsLoaded$ = this.select((s) => s.optionsLoaded);
  readonly isLoadingOptions$ = this.select((s) => s.isLoadingOptions);

  // Updaters
  readonly setMetodoEnvio = this.updater<MetodoEnvio>((s, v) => ({ ...s, metodoEnvio: v }));
  readonly setMetodoPago = this.updater<MetodoPago>((s, v) => ({ ...s, metodoPago: v }));

  readonly setSelectedAddressId = this.updater<number | null>((s, id) => {
    const dir = id != null ? s.addresses.find((a) => a.id === id) : undefined;
    const costo = dir?.zona?.costoEnvio ?? s.costoEnvioDomicilio;
    return { ...s, selectedAddressId: id, costoEnvioDomicilio: costo };
  });

  readonly setTarjetaSeleccionada = this.updater<string | null>((s, t) => ({ ...s, tarjetaSeleccionada: t }));
  readonly setUltimos4 = this.updater<string>((s, v) => ({ ...s, ultimos4: v }));
  readonly setCodigoValidacion = this.updater<string>((s, v) => ({ ...s, codigoValidacion: v }));
  readonly setCostoEnvioDomicilio = this.updater<number>((s, v) => ({ ...s, costoEnvioDomicilio: v }));

  private readonly setProfile = this.updater<UserProfile | null>((s, p) => ({ ...s, profile: p }));
  private readonly setAddresses = this.updater<Direccion[]>((s, list) => ({ ...s, addresses: list }));
  private readonly setOptionsLoaded = this.updater<boolean>((s, v) => ({ ...s, optionsLoaded: v }));
  private readonly setIsLoadingOptions = this.updater<boolean>((s, v) => ({ ...s, isLoadingOptions: v }));

  // Effect: un solo request para perfil+direcciones
  readonly loadOptions = this.effect<void>(($) =>
    $.pipe(
      withLatestFrom(this.optionsLoaded$),
      filter(([, loaded]) => !loaded),
      tap(() => this.setIsLoadingOptions(true)),
      switchMap(() =>
        this.api.getCheckoutOptions().pipe(
          tap({
            next: ({ profile, direcciones }) => {
              this.setProfile(profile);
              this.setAddresses(direcciones);
              this.setOptionsLoaded(true);
              this.setIsLoadingOptions(false);

              // Selección inicial de dirección + costo de envío
              const principalId = direcciones.find((d) => d.principal)?.id ?? direcciones[0]?.id ?? null;
              if (this.get().selectedAddressId == null) this.setSelectedAddressId(principalId);

              const cost = this.findCostoEnvioByAddressId(direcciones, this.get().selectedAddressId);
              if (cost != null) this.setCostoEnvioDomicilio(cost);
            },
            error: () => {
              this.setIsLoadingOptions(false);
              this.setOptionsLoaded(true);
            },
          })
        )
      )
    )
  );

  private findCostoEnvioByAddressId(list: Direccion[] = [], id: number | null | undefined): number | null {
    if (!id) return null;
    const d = list.find((x) => x.id === id);
    return d?.zona?.costoEnvio ?? null;
    }

  // VM con IVA
  readonly vm$ = combineLatest({
    profile: this.profile$,
    addresses: this.addresses$,
    selectedAddressId: this.selectedAddressId$,

    subtotal: this.global.cartTotal$,
    percent: this.global.discountPercent$,
    coupon: this.global.coupon$,

    metodoEnvio: this.metodoEnvio$,
    metodoPago: this.metodoPago$,

    costoEnvioDomicilio: this.costoEnvioDomicilio$,

    tarjetaSeleccionada: this.tarjetaSeleccionada$,
    ultimos4: this.ultimos4$,
    codigoValidacion: this.codigoValidacion$,
    isLoading: this.isLoadingOptions$
  }).pipe(
    map((x) => {
      const descuento = x.percent > 0 ? (x.subtotal * x.percent) / 100 : 0;
      const total = Math.max(0, x.subtotal - descuento);
      const totalConEnvio = x.metodoEnvio === 'RETIRO' ? total : total + (Number(x.costoEnvioDomicilio) || 0);
      const iva = total * 0.21;
      const totalConIva = totalConEnvio + iva;

      const vm: CheckoutVM = {
        profile: x.profile,
        direcciones: x.addresses,
        selectedAddressId: x.selectedAddressId,

        subtotal: x.subtotal,
        descuento,
        total,

        percent: x.percent,
        coupon: x.coupon,

        metodoEnvio: x.metodoEnvio,
        metodoPago: x.metodoPago,

        costoEnvioDomicilio: x.costoEnvioDomicilio,
        totalConEnvio,

        iva,
        totalConIva,

        tarjetaSeleccionada: x.tarjetaSeleccionada,
        ultimos4: x.ultimos4,
        codigoValidacion: x.codigoValidacion,
      };
      return vm;
    })
  );

  // Validaciones
  validoEnvio(): boolean {
    const { metodoEnvio, selectedAddressId, addresses } = this.get();
    if (metodoEnvio === 'DOMICILIO') return !!selectedAddressId && addresses.length > 0;
    return true;
  }

  validoPago(): boolean {
    const { metodoPago, tarjetaSeleccionada, ultimos4, codigoValidacion, metodoEnvio } = this.get();
    if (metodoPago === 'EFECTIVO') return metodoEnvio === 'RETIRO';
    const cvvOk = /^\d{3}$/.test(codigoValidacion);
    const last4Ok = /^\d{4}$/.test(ultimos4);
    return !!tarjetaSeleccionada && cvvOk && last4Ok;
  }

  puedeConfirmar(total: number): boolean {
    return this.validoEnvio() && this.validoPago() && total >= 0;
  }

  confirmar(totalConIva: number) {
    if (!this.puedeConfirmar(totalConIva)) return;

    const { metodoEnvio, metodoPago, selectedAddressId, tarjetaSeleccionada, ultimos4 } = this.get();
    const payload: CheckoutPayload = {
      envio: metodoEnvio,
      direccionId: metodoEnvio === 'DOMICILIO' ? selectedAddressId : null,
      pago: metodoPago,
      tarjeta: metodoPago === 'ONLINE' ? tarjetaSeleccionada : null,
      ultimos4: metodoPago === 'ONLINE' ? ultimos4 : null,
      total: totalConIva,
    };
    this.api.submitOrder(payload);
  }
}

import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type MetodoEnvio = 'DOMICILIO' | 'RETIRO';
type MetodoPago = 'EFECTIVO' | 'ONLINE';

export interface Direccion {
  id: number;
  etiqueta?: string; // "Casa", "Trabajo", etc.
  calle: string;
  numero: string;
  ciudad: string;
  provincia?: string;
  cp?: string;
}

export interface UserProfile {
  nombreCompleto: string;
  email: string;
  telefono: string;
  direcciones: Direccion[];
  direccionPrincipalId: number | null;
}

export interface OrderSummaryInput {
  subtotal: number;
  costoEnvio: number;
  descuento: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Checkout -->
    <section id="checkout-page" class="bg-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-semibold mb-6">Finalizar compra</h1>

        <div class="flex flex-col md:flex-row gap-4">
          <!-- Columna izquierda -->
          <div class="md:w-2/3 bg-white rounded-lg shadow-md p-4 space-y-6">
            <!-- Datos del cliente (solo lectura) -->
            <div>
              <h2 class="text-xl font-semibold mb-3">Tus datos</h2>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-600">Nombre completo</label>
                  <input
                    class="w-full mt-1 px-3 py-2 border rounded-full bg-gray-50"
                    [value]="profile?.nombreCompleto"
                    readonly
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Email</label>
                  <input
                    class="w-full mt-1 px-3 py-2 border rounded-full bg-gray-50"
                    [value]="profile?.email"
                    readonly
                  />
                </div>
                <div>
                  <label class="text-sm text-gray-600">Teléfono</label>
                  <input
                    class="w-full mt-1 px-3 py-2 border rounded-full bg-gray-50"
                    [value]="profile?.telefono"
                    readonly
                  />
                </div>
              </div>
            </div>

            <!-- Pago -->
            <div>
              <h2 class="text-xl font-semibold mb-3">Pago</h2>

              <div class="flex flex-col gap-3">
                <label class="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="pago"
                    class="accent-black"
                    [(ngModel)]="metodoPago"
                    value="EFECTIVO"
                  />
                  <span>Efectivo (solo retiro en sucursal)</span>
                </label>

                <label class="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="pago"
                    class="accent-black"
                    [(ngModel)]="metodoPago"
                    value="ONLINE"
                  />
                  <span>Pago online (tarjeta)</span>
                </label>
              </div>

              <!-- Avisos de compatibilidad -->
              @if (metodoPago === 'EFECTIVO' && metodoEnvio === 'DOMICILIO') {
              <p
                class="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3"
              >
                El pago en efectivo solo está disponible para
                <b>retiro en sucursal</b>.
              </p>
              }

              <!-- Formulario de pago online -->
              @if (metodoPago === 'ONLINE') {
              <div class="mt-4 grid md:grid-cols-3 gap-4">
                <div class="md:col-span-1">
                  <label class="text-sm text-gray-600">Tarjeta</label>
                  <select
                    class="w-full mt-1 px-3 py-2 border rounded-full"
                    [(ngModel)]="tarjetaSeleccionada"
                  >
                    <option [ngValue]="null" disabled>
                      Seleccioná una tarjeta
                    </option>
                    <option *ngFor="let t of tarjetasDisponibles" [ngValue]="t">
                      {{ t }}
                    </option>
                  </select>
                </div>
                <div class="md:col-span-1">
                  <label class="text-sm text-gray-600"
                    >Número (últimos 4)</label
                  >
                  <input
                    class="w-full mt-1 px-3 py-2 border rounded-full"
                    maxlength="4"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    [(ngModel)]="ultimos4"
                    placeholder="1234"
                  />
                </div>
                <div class="md:col-span-1">
                  <label class="text-sm text-gray-600"
                    >Código de validación</label
                  >
                  <input
                    class="w-full mt-1 px-3 py-2 border rounded-full"
                    maxlength="3"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    [(ngModel)]="codigoValidacion"
                    placeholder="CVV"
                  />
                </div>
              </div>
              }
            </div>

            <!-- Envío -->
            @if(metodoPago !== 'EFECTIVO'){
            <div>
              <h2 class="text-xl font-semibold mb-3">Envío</h2>

              <div class="flex flex-col gap-3">
                <label class="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="envio"
                    class="accent-black"
                    [(ngModel)]="metodoEnvio"
                    value="DOMICILIO"
                  />
                  <span>Envío a domicilio</span>
                </label>

                <label class="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="envio"
                    class="accent-black"
                    [(ngModel)]="metodoEnvio"
                    value="RETIRO"
                  />
                  <span>Retiro en sucursal</span>
                </label>
              </div>

              <!-- Dirección cuando es a domicilio -->
              @if (metodoEnvio === 'DOMICILIO') {
              <div class="mt-4">
                <label class="text-sm text-gray-600"
                  >Dirección de entrega</label
                >
                <select
                  class="w-full mt-1 px-3 py-2 border rounded-full"
                  [(ngModel)]="selectedAddressId"
                >
                  @for (dir of profile?.direcciones ?? []; track dir.id) {
                  <option [value]="dir.id">
                    {{
                      (dir.etiqueta || 'Dirección') +
                        ' — ' +
                        dir.calle +
                        ' ' +
                        dir.numero +
                        ', ' +
                        dir.ciudad
                    }}
                    {{ dir.provincia ? ', ' + dir.provincia : '' }}
                    {{ dir.cp ? ' (' + dir.cp + ')' : '' }}
                  </option>
                  }
                </select>

                <p class="text-xs text-gray-500 mt-2">
                  Predeterminada: {{ etiquetaDireccion(selectedAddressId()) }}
                </p>
              </div>
              }
            </div>
            }
          </div>

          <!-- Columna derecha: Resumen -->
          <div class="md:w-1/3 bg-white rounded-lg shadow-md p-4 h-fit">
            <h2 class="text-xl font-semibold mb-4">Resumen del pedido</h2>

            <div class="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>
                {{ summary?.subtotal | currency : 'ARS' : 'symbol-narrow' }}
              </p>
            </div>

            <div class="flex justify-between mb-2">
              <p>Envío</p>
              <p>
                @if (metodoEnvio === 'RETIRO') {
                {{ 0 | currency : 'ARS' : 'symbol-narrow' }}
                } @else {
                {{ summary?.costoEnvio | currency : 'ARS' : 'symbol-narrow' }}
                }
              </p>
            </div>

            <div class="flex justify-between mb-2">
              <p>Descuento</p>
              <p>
                -{{ summary?.descuento | currency : 'ARS' : 'symbol-narrow' }}
              </p>
            </div>

            <div class="border-t my-3"></div>

            <div class="flex justify-between mb-4">
              <p class="font-semibold">Total</p>
              <p class="font-semibold">
                {{ total() | currency : 'ARS' : 'symbol-narrow' }}
              </p>
            </div>

            <button
              class="bg-black text-white border border-black hover:bg-transparent hover:text-black py-2 px-4 rounded-full w-full disabled:opacity-50 disabled:cursor-not-allowed"
              [disabled]="!puedeConfirmar()"
              (click)="confirmar()"
            >
              Confirmar pedido
            </button>

            <!-- Mensajes de validación suaves -->
            @if (!validoEnvio()) {
            <p class="text-xs text-red-600 mt-3">
              Seleccioná un método de envío válido.
            </p>
            } @if (!validoPago()) {
            <p class="text-xs text-red-600 mt-1">
              Seleccioná y completá un método de pago válido.
            </p>
            }
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CheckoutComponent {
  // ====== Inputs ======
  @Input() profile: UserProfile | null = null;
  @Input() summary: OrderSummaryInput | null = null;

  // ====== Estado UI ======
  metodoEnvio: MetodoEnvio = 'DOMICILIO';
  metodoPago: MetodoPago = 'ONLINE';

  tarjetasDisponibles: string[] = ['Visa', 'Mastercard'];
  tarjetaSeleccionada: string | null = null;
  ultimos4 = '';
  codigoValidacion = '';

  // Dirección seleccionada (por defecto la principal)
  selectedAddressId = signal<number | null>(null);

  ngOnChanges(): void {
    if (this.profile && this.selectedAddressId() == null) {
      const def =
        this.profile.direccionPrincipalId ??
        this.profile.direcciones[0]?.id ??
        null;
      this.selectedAddressId.set(def);
    }
  }

  // ====== Cálculos ======
  total = computed(() => {
    if (!this.summary) return 0;
    const envio =
      this.metodoEnvio === 'RETIRO' ? 0 : this.summary.costoEnvio || 0;
    return Math.max(
      0,
      (this.summary.subtotal || 0) + envio - (this.summary.descuento || 0)
    );
  });

  // ====== Validaciones ======
  validoEnvio(): boolean {
    if (this.metodoEnvio === 'DOMICILIO') {
      return !!this.selectedAddressId();
    }
    return true; // retiro siempre válido
  }

  validoPago(): boolean {
    if (this.metodoPago === 'EFECTIVO') {
      // efectivo solo compatible con retiro
      return this.metodoEnvio === 'RETIRO';
    }
    // pago online
    const cvvOk = /^\d{3}$/.test(this.codigoValidacion);
    const last4Ok = /^\d{4}$/.test(this.ultimos4);
    return !!this.tarjetaSeleccionada && cvvOk && last4Ok;
  }

  puedeConfirmar(): boolean {
    return this.validoEnvio() && this.validoPago();
  }

  // ====== Helpers ======
  etiquetaDireccion = (id: number | null): string => {
    if (!id || !this.profile) return '-';
    const d = this.profile.direcciones.find((x) => x.id === id);
    if (!d) return '-';
    const tag = d.etiqueta ? `${d.etiqueta} — ` : '';
    return `${tag}${d.calle} ${d.numero}, ${d.ciudad}${
      d.provincia ? ', ' + d.provincia : ''
    }${d.cp ? ' (' + d.cp + ')' : ''}`;
  };

  // Emitir confirmación (acá podés integrar con tu store o servicio)
  confirmar(): void {
    if (!this.puedeConfirmar() || !this.profile || !this.summary) return;

    const payload = {
      envio: this.metodoEnvio,
      direccionId:
        this.metodoEnvio === 'DOMICILIO' ? this.selectedAddressId() : null,
      pago: this.metodoPago,
      tarjeta: this.metodoPago === 'ONLINE' ? this.tarjetaSeleccionada : null,
      ultimos4: this.metodoPago === 'ONLINE' ? this.ultimos4 : null,
      total: this.total(),
    };

    // TODO: reemplazar por dispatch a tu Store o llamada al backend
    console.log('Confirmar pedido', payload);
    // this.checkoutStore.confirm(payload)
  }
}

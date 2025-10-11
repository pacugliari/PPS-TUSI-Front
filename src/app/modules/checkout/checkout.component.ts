import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';
import { MatRadioModule }      from '@angular/material/radio';
import { MatButtonModule }     from '@angular/material/button';
import { MatDividerModule }    from '@angular/material/divider';

import { CheckoutStore } from './checkout.store';
import { Direccion } from './checkout.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  providers: [CheckoutStore],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <section id="checkout-page" class="bg-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-semibold">Finalizar compra</h1>

          <!-- Botón de volver -->
          <a
            routerLink="/cart"
            class="text-primary border border-primary rounded-full px-4 py-2 hover:bg-primary hover:text-white transition"
          >
            ← Volver
          </a>
        </div>

        <ng-container *ngIf="vm$ | async as vm">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Columna izquierda -->
            <div class="md:w-2/3 bg-white rounded-lg shadow-md p-4 space-y-6">
              <!-- Datos del cliente -->
              <div>
                <h2 class="text-xl font-semibold mb-3">Tus datos</h2>

                <div class="grid md:grid-cols-2 gap-4" *ngIf="vm.profile as profile; else skeletonProfile">
                  <mat-form-field appearance="outline">
                    <mat-label>Nombre completo</mat-label>
                    <input matInput [value]="profile.nombreCompleto" readonly />
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput [value]="profile.email" readonly />
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="md:col-span-2">
                    <mat-label>Teléfono</mat-label>
                    <input matInput [value]="profile.telefono" readonly />
                  </mat-form-field>
                </div>

                <ng-template #skeletonProfile>
                  <div class="grid md:grid-cols-2 gap-4 opacity-60">
                    <mat-form-field appearance="outline"><mat-label>Nombre completo</mat-label><input matInput readonly /></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>Email</mat-label><input matInput readonly /></mat-form-field>
                    <mat-form-field appearance="outline" class="md:col-span-2"><mat-label>Teléfono</mat-label><input matInput readonly /></mat-form-field>
                  </div>
                </ng-template>
              </div>

              <!-- Pago -->
              <div>
                <h2 class="text-xl font-semibold mb-3">Pago</h2>

                <mat-radio-group
                  [ngModel]="vm.metodoPago"
                  (ngModelChange)="store.setMetodoPago($event)"
                  class="flex flex-col gap-3">
                  <mat-radio-button value="EFECTIVO">Efectivo (solo retiro en sucursal)</mat-radio-button>
                  <mat-radio-button value="ONLINE">Pago online (tarjeta)</mat-radio-button>
                </mat-radio-group>

                @if (vm.metodoPago === 'EFECTIVO' && vm.metodoEnvio === 'DOMICILIO') {
                  <p class="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                    El pago en efectivo solo está disponible para <b>retiro en sucursal</b>.
                  </p>
                }

                @if (vm.metodoPago === 'ONLINE') {
                  <div class="mt-4 grid md:grid-cols-3 gap-4">
                    <mat-form-field appearance="outline" class="md:col-span-1">
                      <mat-label>Tarjeta</mat-label>
                      <mat-select [ngModel]="vm.tarjetaSeleccionada" (ngModelChange)="store.setTarjetaSeleccionada($event)">
                        <mat-option [value]="null" disabled>Seleccioná una tarjeta</mat-option>
                        <mat-option *ngFor="let t of tarjetasDisponibles" [value]="t">{{ t }}</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="md:col-span-1">
                      <mat-label>Número (últimos 4)</mat-label>
                      <input matInput maxlength="4" inputmode="numeric" pattern="[0-9]*"
                        [ngModel]="vm.ultimos4" (ngModelChange)="store.setUltimos4($event)" placeholder="1234" />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="md:col-span-1">
                      <mat-label>Código de validación</mat-label>
                      <input matInput maxlength="3" inputmode="numeric" pattern="[0-9]*"
                        [ngModel]="vm.codigoValidacion" (ngModelChange)="store.setCodigoValidacion($event)" placeholder="CVV" />
                    </mat-form-field>
                  </div>
                }
              </div>

              <!-- Envío -->
              @if (vm.metodoPago !== 'EFECTIVO') {
                <div>
                  <h2 class="text-xl font-semibold mb-3">Envío</h2>

                  <mat-radio-group
                    [ngModel]="vm.metodoEnvio"
                    (ngModelChange)="store.setMetodoEnvio($event)"
                    class="flex flex-col gap-3">
                    <mat-radio-button value="DOMICILIO">Envío a domicilio</mat-radio-button>
                    <mat-radio-button value="RETIRO">Retiro en sucursal</mat-radio-button>
                  </mat-radio-group>

                  @if (vm.metodoEnvio === 'DOMICILIO') {
                    <div class="mt-4">
                      <mat-form-field appearance="outline" class="w-full">
                        <mat-label>Dirección de entrega</mat-label>
                        <mat-select
                          [ngModel]="vm.selectedAddressId"
                          (ngModelChange)="store.setSelectedAddressId($event)">
                          @for (dir of vm.direcciones; track dir.id) {
                            <mat-option [value]="dir.id">
                              {{ (dir.etiqueta || 'Dirección') + ' — ' + dir.calle }}
                              {{ dir.zona?.ciudad ? ', ' + dir.zona?.ciudad : '' }}
                              {{ dir.zona?.provincia ? ', ' + dir.zona?.provincia : '' }}
                              {{ dir.cp ? ' (' + dir.cp + ')' : '' }}
                              {{ dir.zona?.costoEnvio != null ? ' — Envío: ' + (dir.zona?.costoEnvio | currency:'ARS':'symbol-narrow') : '' }}
                            </mat-option>
                          }
                        </mat-select>
                      </mat-form-field>

                      <p class="text-xs text-gray-500 mt-2">
                        Predeterminada: {{ etiquetaDireccion(vm.direcciones, vm.selectedAddressId) }}
                      </p>

                      <p *ngIf="!vm.direcciones?.length" class="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3 mt-2">
                        No tenés direcciones guardadas. Agregá una desde tu perfil para habilitar el envío a domicilio.
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
                <p>{{ vm.subtotal | currency : 'ARS' : 'symbol-narrow' }}</p>
              </div>

              <div class="flex justify-between mb-2">
                <p>Envío</p>
                <p>
                  @if (vm.metodoEnvio === 'RETIRO') {
                    {{ 0 | currency : 'ARS' : 'symbol-narrow' }}
                  } @else {
                    {{ vm.costoEnvioDomicilio | currency : 'ARS' : 'symbol-narrow' }}
                  }
                </p>
              </div>

              <div class="flex justify-between mb-2">
                <p>Descuento</p>
                <p>-{{ vm.descuento | currency : 'ARS' : 'symbol-narrow' }}</p>
              </div>

              <div class="flex justify-between mb-2">
                <p>IVA (21%)</p>
                <p>{{ vm.iva | currency : 'ARS' : 'symbol-narrow' }}</p>
              </div>

              <mat-divider class="my-3"></mat-divider>

              <div class="flex justify-between mb-4">
                <p class="font-semibold">Total con IVA</p>
                <p class="font-semibold">
                  {{ vm.totalConIva | currency : 'ARS' : 'symbol-narrow' }}
                </p>
              </div>

              <button
                mat-raised-button
                color="primary"
                class="w-full"
                [disabled]="!store.puedeConfirmar(vm.totalConIva)"
                (click)="store.confirmar(vm.totalConIva)">
                Confirmar pedido
              </button>

              @if (!store.validoEnvio()) {
                <p class="text-xs text-red-600 mt-3">Seleccioná un método de envío válido.</p>
              }
              @if (!store.validoPago()) {
                <p class="text-xs text-red-600 mt-1">Seleccioná y completá un método de pago válido.</p>
              }
            </div>
          </div>
        </ng-container>
      </div>
    </section>
  `,
})
export class CheckoutComponent {
  protected readonly store = inject(CheckoutStore);
  protected readonly vm$ = this.store.vm$;
  tarjetasDisponibles: string[] = ['Visa', 'Mastercard'];

  etiquetaDireccion(addresses: Direccion[] = [], id: number | null): string {
    if (!id) return '-';
    const d = addresses.find(x => x.id === id);
    if (!d) return '-';
    const tag = d.etiqueta ? `${d.etiqueta} — ` : '';
    return `${tag}${d.calle}${
      d.zona?.ciudad ? ', ' + d.zona.ciudad : ''
    }${d.zona?.provincia ? ', ' + d.zona.provincia : ''}${
      d.cp ? ' (' + d.cp + ')' : ''
    }`;
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { CartStore } from './cart.store';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  providers: [CartStore],
  template: `
    @if(vm$ | async; as vm){ @if(vm.isLoading){ <app-spinner /> }

    <section id="cart-page" class="bg-white py-10">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-semibold mb-6">Carrito de compras</h1>

        @if (vm.lines.length === 0) {
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <p class="text-gray-600 mb-4">Tu carrito está vacío.</p>
          <a
            routerLink="/shop"
            class="inline-block bg-primary text-white border border-primary hover:bg-transparent hover:text-primary rounded-full py-2 px-5"
          >
            Ir a la tienda
          </a>
        </div>
        } @else {
        <div class="flex flex-col md:flex-row gap-4">
          <div class="md:w-3/4">
            <div class="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead class="text-sm text-gray-500">
                    <tr>
                      <th class="text-left font-semibold py-2">Producto</th>
                      <th class="text-center font-semibold py-2">Precio</th>
                      <th class="text-center font-semibold py-2">Cantidad</th>
                      <th class="text-right font-semibold py-2">Total</th>
                      <th class="w-12"></th>
                    </tr>
                  </thead>

                  <tbody>
                    @for (line of vm.lines; track line.producto.idProducto) {
                    <tr class="border-b border-gray-100 last:border-0">
                      <td class="py-4 pr-2">
                        <div class="flex items-center gap-3">
                          <img
                            class="h-16 w-16 md:h-20 md:w-20 rounded object-cover bg-gray-50 ring-1 ring-gray-200"
                            [src]="
                              line.producto.imagen ||
                              '/assets/images/placeholder.png'
                            "
                            [alt]="line.producto.nombre"
                          />
                          <div class="min-w-0">
                            <p
                              class="text-sm md:text-base font-medium line-clamp-2"
                            >
                              {{ line.producto.nombre }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-2 py-4 text-center whitespace-nowrap">
                        <span class="text-sm md:text-base">
                          {{
                            line.producto.precio
                              | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                          }}
                        </span>
                      </td>

                      <td class="px-2 py-4 text-center">
                        <div class="inline-flex items-center">
                          <button
                            class="border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-8 h-8 flex items-center justify-center"
                            [disabled]="line.cantidad <= 1"
                            (click)="
                              store.dec(line.producto.idProducto, line.cantidad)
                            "
                            aria-label="Disminuir cantidad"
                            title="Disminuir"
                          >
                            −
                          </button>

                          <span
                            class="w-10 text-center select-none text-sm md:text-base"
                          >
                            {{ line.cantidad }}
                          </span>

                          <button
                            class="border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-8 h-8 flex items-center justify-center"
                            (click)="
                              store.inc(line.producto.idProducto, line.cantidad)
                            "
                            aria-label="Aumentar cantidad"
                            title="Aumentar"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td class="px-2 py-4 text-right whitespace-nowrap">
                        <span class="font-medium">
                          {{
                            line.total
                              | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                          }}
                        </span>
                      </td>

                      <td class="px-0 py-4 text-right">
                        <button
                          class="text-gray-400 hover:text-red-600 p-2"
                          (click)="store.remove(line.producto.idProducto)"
                          aria-label="Quitar producto"
                          title="Quitar"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                    }
                  </tbody>
                </table>

                <div
                  class="flex flex-col lg:flex-row justify-between items-center gap-3 mt-6"
                >
                  <!-- Si HAY cupón aplicado: mostrar chip + cancelar -->
                  @if (vm.coupon) {
                  <div class="flex items-center gap-3">
                    <span
                      class="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full"
                    >
                      Cupón: <b>{{ vm.coupon.code }}</b> ({{
                        vm.coupon.percent
                      }}%)
                    </span>
                    <button
                      class="bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded-full py-2 px-4"
                      (click)="store.clearCoupon()"
                    >
                      Cancelar cupón
                    </button>
                  </div>
                  } @else {
                  <!-- Si NO hay cupón: input para aplicar -->
                  <div class="flex items-center">
                    <input
                      #code
                      type="text"
                      placeholder="Código de cupón"
                      class="border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none"
                    />
                    <button
                      class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary rounded-r-full py-2 px-4"
                      [disabled]="vm.applyingCoupon"
                      (click)="store.applyCoupon(code.value)"
                    >
                      {{ vm.applyingCoupon ? 'Aplicando...' : 'Aplicar' }}
                    </button>
                  </div>
                  }

                  <div class="flex gap-2">
                    <button
                      class="bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded-full py-2 px-4"
                      (click)="store.clear()"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen -->
          <div class="md:w-1/4">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">Resumen</h2>

              <div class="flex justify-between mb-3">
                <p>Subtotal</p>
                <p>
                  {{
                    vm.totals.subtotal
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </p>
              </div>

              <div
                class="flex justify-between mb-3"
                *ngIf="vm.totals.discount > 0"
              >
                <p>Descuento</p>
                <p>
                  -{{
                    vm.totals.discount
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </p>
              </div>

              <div class="flex justify-between mb-3">
                <p>IVA (21%)</p>
                <p>
                  {{
                    vm.totals.total * 0.21
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </p>
              </div>

              <div
                class="flex justify-between items-center mb-2 border-t border-gray-100 pt-3"
              >
                <p class="font-semibold">Total</p>
                <p class="font-semibold">
                  {{
                    vm.totals.total * 1.21
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </p>
              </div>

              <a
                routerLink="/checkout"
                class="bg-primary text-white border hover:border-primary hover:bg-transparent hover:text-primary py-2 px-4 rounded-full mt-4 w-full text-center block"
              >
                Finalizar compra
              </a>
            </div>
          </div>
        </div>
        }
      </div>
    </section>
    }
  `,
})
export class CartComponent {
  protected readonly store = inject(CartStore);
  protected readonly vm$ = this.store.vm$;

  constructor() {
    this.store.loadData();
  }
}

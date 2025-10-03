import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalStore } from '../../global-store';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  template: `
    @if(vm$ | async; as vm){ @if(vm.isLoading){
    <app-spinner />
    }
    <section id="cart-page" class="bg-white py-10">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-semibold mb-6">Carrito de compras</h1>

        @if (store.cart$ | async; as cart) { @if (cart.length === 0) {
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
                    @for (item of cart; track item.idProducto) {
                    <tr class="border-b border-gray-100 last:border-0">
                      <td class="py-4 pr-2">
                        <div class="flex items-center gap-3">
                          <img
                            class="h-16 w-16 md:h-20 md:w-20 rounded object-cover bg-gray-50 ring-1 ring-gray-200"
                            [src]="
                              item.imagen || '/assets/images/placeholder.png'
                            "
                            [alt]="item.nombre"
                          />
                          <div class="min-w-0">
                            <p
                              class="text-sm md:text-base font-medium line-clamp-2"
                            >
                              {{ item.nombre }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td class="px-2 py-4 text-center whitespace-nowrap">
                        <span class="text-sm md:text-base">
                          {{
                            item.precio
                              | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                          }}
                        </span>
                      </td>

                      <td class="px-2 py-4 text-center">
                        <div class="inline-flex items-center">
                          <button
                            class="border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-8 h-8 flex items-center justify-center"
                            [disabled]="item.cantidad <= 1"
                            (click)="dec(item.idProducto, item.cantidad)"
                            aria-label="Disminuir cantidad"
                            title="Disminuir"
                          >
                            −
                          </button>

                          <span
                            class="w-10 text-center select-none text-sm md:text-base"
                          >
                            {{ item.cantidad }}
                          </span>

                          <button
                            class="border border-primary bg-primary text-white hover:bg-transparent hover:text-primary rounded-full w-8 h-8 flex items-center justify-center"
                            (click)="inc(item.idProducto, item.cantidad)"
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
                            item.precio * item.cantidad
                              | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                          }}
                        </span>
                      </td>

                      <td class="px-0 py-4 text-right">
                        <button
                          class="text-gray-400 hover:text-red-600 p-2"
                          (click)="store.removeFromCart(item.idProducto)"
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
                  <div class="flex items-center">
                    <input
                      type="text"
                      placeholder="Código de cupón"
                      class="border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none"
                    />
                    <button
                      class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary rounded-r-full py-2 px-4"
                    >
                      Aplicar
                    </button>
                  </div>

                  <div class="flex gap-2">
                    <button
                      class="bg-white text-red-600 border border-red-500 hover:bg-red-50 rounded-full py-2 px-4"
                      (click)="store.clearCart()"
                    >
                      Vaciar carrito
                    </button>
                    <!--<button
                          class="bg-primary text-white border border-primary hover:bg-transparent hover:text-primary rounded-full py-2 px-4"
                          (click)="noop()"
                          title="(Opcional) recalcular precios si hubiera descuentos dinámicos"
                        >
                          Actualizar carrito
                        </button>-->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="md:w-1/4">
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-lg font-semibold mb-4">Resumen</h2>

              @if (store.cartTotal$ | async; as subtotal) {
              <div class="flex justify-between mb-3">
                <p>Subtotal</p>
                <p>
                  {{ subtotal | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
                </p>
              </div>

              <div class="flex justify-between mb-3">
                <p>IVA (21%)</p>
                <p>
                  {{
                    subtotal * 0.21
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </p>
              </div>

              <div
                class="flex justify-between mb-4 pb-4 border-b border-gray-100"
              >
                <p>Envío</p>
                <p>{{ 0 | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}</p>
              </div>

              <div class="flex justify-between items-center mb-2">
                <p class="font-semibold">Total</p>
                <p class="font-semibold">
                  {{
                    subtotal * 1.21
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
              }
            </div>
          </div>
        </div>
        } }
      </div>
    </section>
    }
  `,
})
export class CartComponent {
  protected readonly store = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;

  inc(productId: number, current: number) {
    this.store.updateQuantity({ idProducto: productId, cantidad: current + 1 });
  }
  dec(productId: number, current: number) {
    this.store.updateQuantity({
      idProducto: productId,
      cantidad: Math.max(1, current - 1),
    });
  }
}

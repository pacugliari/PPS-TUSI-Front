import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

export interface CartProduct {
  idProducto: number;
  nombre: string;
  imagen: string | null;
  cantidad: number;
  precio: number;
}

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div
      class="absolute right-0 mt-1 w-80 bg-white shadow-lg p-4 rounded hidden group-hover:block"
    >
      @if (productos().length > 0) {
      <div class="space-y-4">
        @for (producto of productos(); track producto.idProducto) {
        <div
          class="flex items-center justify-between pb-4 border-b border-gray-line last:border-b-0"
          (click)="productoSeleccionado.emit(producto)"
        >
          <div class="flex items-center">
            <img
              [src]="producto.imagen || 'assets/images/products/default.png'"
              [alt]="producto.nombre"
              class="h-12 w-12 object-cover rounded mr-2"
            />
            <div>
              <p class="font-semibold">{{ producto.nombre }}</p>
              <p class="text-sm">Cantidad: {{ producto.cantidad }}</p>
            </div>
          </div>
          <p class="font-semibold">
            {{ producto.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
          </p>
        </div>
        }
      </div>
      <a
        routerLink="/cart"
        class="block text-center mt-4 border border-primary bg-primary hover:bg-transparent text-white hover:text-primary py-2 rounded-full font-semibold"
      >
        Ir al carrito
      </a>
      } @else {
      <p class="text-center text-sm text-gray-500">Tu carrito está vacío</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDropdownComponent {
  productos = input.required<CartProduct[]>();

  productoSeleccionado = output<CartProduct>();
}

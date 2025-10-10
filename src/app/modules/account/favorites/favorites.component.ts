import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FavoritesStore } from './favorites.store';

@Component({
  selector: 'app-favorites',
  standalone: true,
  providers: [FavoritesStore],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDividerModule],
  template: `
    @if (store.vm$ | async; as vm) {
    <header class="text-center py-4">
      <h2 class="text-xl font-semibold text-indigo-900">Favoritos</h2>
    </header>
    <mat-divider></mat-divider>

    <div class="p-4 md:p-6">
      @if (vm.products.length === 0) {
      <div class="text-slate-600">Todavía no agregaste favoritos.</div>
      } @else {
      <div class="space-y-4">
        @for (p of vm.products; track p.idProducto) {
        <div class="rounded-lg border border-slate-200 bg-white p-3 md:p-4">
          <div class="flex items-center gap-3 md:gap-4">
            <button
              class="text-red-600 hover:text-red-700 p-2"
              (click)="store.removeFavorite(p.idProducto)"
              aria-label="Quitar de favoritos"
              title="Quitar de favoritos"
            >
              <mat-icon>delete</mat-icon>
            </button>

            <img
              [src]="p.fotos[0] || '/assets/images/placeholder.png'"
              [alt]="p.nombre"
              class="w-16 h-16 md:w-20 md:h-20 rounded object-cover ring-1 ring-slate-200 bg-slate-50"
            />

            <div class="flex-1 min-w-0">
              <div class="text-sm md:text-base font-medium line-clamp-2">
                {{ p.nombre }}
              </div>
            </div>

            <div class="text-right">
              <div class="text-red-600 font-semibold">
                {{ p.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </div>
              <button
                mat-stroked-button
                color="primary"
                class="!mt-2"
                (click)="store.addToCart(p)"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
        }
      </div>

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          mat-stroked-button
          color="primary"
          (click)="store.addAllToCart(vm.products)"
        >
          Agregar todos al carrito
        </button>
      </div>
      }
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  readonly store = inject(FavoritesStore);
}

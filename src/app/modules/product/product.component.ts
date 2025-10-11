// features/product/product.component.ts
import { Component, effect, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';            // <-- NUEVO
import { ProductStore } from './product.store';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GlobalStore } from '../../global-store';                   // <-- NUEVO

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, MatTabsModule, MatIconModule], // <-- agrega MatIcon
  providers: [ProductStore],
  template: `
    <!-- Breadcrumbs -->
    <section id="breadcrumbs" class="pt-6 bg-gray-50" *ngIf="vm$ | async as vm">
      <div class="container mx-auto px-4">
        <ol class="list-reset flex text-sm">
          <li><a routerLink="/" class="font-semibold hover:text-primary">Home</a></li>
          <li><span class="mx-2">›</span></li>
          <li><a routerLink="/shop" class="font-semibold hover:text-primary">Shop</a></li>
          <li *ngIf="vm.product"><span class="mx-2">›</span></li>
          <li *ngIf="vm.product">
            <a routerLink="/shop" class="font-semibold hover:text-primary">{{ vm.product.categoria.nombre }}</a>
          </li>
          <li *ngIf="vm.product"><span class="mx-2">›</span></li>
          <li>{{ vm.product?.nombre || 'Producto' }}</li>
        </ol>
      </div>
    </section>

    <!-- Product info -->
    <section id="product-info" *ngIf="vm$ | async as vm">
      <div class="container mx-auto px-4">
        <div class="py-6" *ngIf="vm.product as p; else loading">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Gallery (achicada) -->
            <div class="w-full sm:w-1/2 lg:w-1/2 px-4 mb-8">
              <div class="grid gap-4">
                <div class="relative rounded-lg overflow-hidden ring-1 ring-gray-200">
                  <img
                    class="w-full object-cover rounded-lg cursor-pointer"
                    [src]="p.fotos[vm.selectedImageIdx] || 'assets/images/products/default.png'"
                    [alt]="p.nombre"
                  />
                  <!-- Corazón sobre la imagen (solo logueado) -->
                  <ng-container *ngIf="globalStore.user$ | async">
                    <button
                      type="button"
                      class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow grid place-items-center hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                      (click)="globalStore.toggleFavorite(p.idProducto)"
                      [attr.aria-pressed]="globalStore.isFavorite(p.idProducto)"
                      [attr.aria-label]="globalStore.isFavorite(p.idProducto) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                    >
                      <mat-icon
                        class="block leading-none text-[20px] [transform:translateY(4px)]"
                        [ngClass]="globalStore.isFavorite(p.idProducto) ? 'text-primary' : 'text-gray-400'"
                      >
                        {{ globalStore.isFavorite(p.idProducto) ? 'favorite' : 'favorite_border' }}
                      </mat-icon>
                    </button>
                  </ng-container>
                </div>

                <div class="grid grid-cols-5 gap-2">
                  <button
                    *ngFor="let img of p.fotos || []; index as i"
                    type="button"
                    class="rounded-lg overflow-hidden ring-1 ring-gray-200"
                    [ngClass]="{ 'ring-2 ring-primary': vm.selectedImageIdx === i }"
                    (click)="store.selectImage(i)"
                  >
                    <img class="h-16 w-full object-cover" [src]="img" [alt]="p.nombre + ' ' + (i + 1)" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Details -->
            <div class="w-full lg:w-7/12 flex flex-col ">
              <div class="pb-6 border-b border-gray-200">
                <div class="flex items-start justify-between gap-4 mb-3">
                  <h1 class="text-3xl font-bold">{{ p.nombre }}</h1>
                </div>

                <div class="flex items-center gap-2 mb-4 text-sm">
                  <ng-container *ngFor="let s of [1, 2, 3, 4, 5]; index as idx">
                    <span class="text-yellow-500" [class.opacity-30]="(p.ratingPromedio || 0) < idx + 0.5">★</span>
                  </ng-container>
                  <span class="font-medium">{{ p.ratingPromedio || 0 | number:'1.1-1' }}/5</span>
                  <span class="text-gray-500">({{ p.ratingCount || 0 }} reseñas)</span>
                </div>

                <div class="mb-4 text-sm text-gray-600">
                  Marca: <b>{{ p.marca.nombre }}</b> · Categoría: <b>{{ p.categoria.nombre }}</b> ·
                  Estado: <b>{{ p.stockEstado || (p.stock > 0 ? 'disponible' : 'sin stock') }}</b>
                </div>

                <div class="mb-5">
                  <ng-container *ngIf="p.precioAnterior; else simplePrice">
                    <div class="flex items-baseline gap-3">
                      <div class="text-2xl font-semibold">
                        {{ p.precio | currency:'ARS':'symbol-narrow':'1.2-2' }}
                      </div>
                      <div class="text-base line-through text-gray-400">
                        {{ p.precioAnterior | currency:'ARS':'symbol-narrow':'1.2-2' }}
                      </div>
                    </div>
                  </ng-container>
                  <ng-template #simplePrice>
                    <div class="text-2xl font-semibold">
                      {{ p.precio | currency:'ARS':'symbol-narrow':'1.2-2' }}
                    </div>
                  </ng-template>
                </div>

                <p class="mb-5 text-gray-700">{{ p.descripcion }}</p>

                <div class="flex items-center gap-3 mb-5">
                  <button class="bg-primary text-white rounded-full w-10 h-10" [disabled]="vm.qty <= 1" (click)="store.dec()">−</button>
                  <span class="w-10 text-center">{{ vm.qty }}</span>
                  <button class="bg-primary text-white rounded-full w-10 h-10" [disabled]="vm.qty >= (p.stock || 0)" (click)="store.inc()">+</button>
                </div>

                <button
                  class="bg-primary border border-primary text-white hover:bg-transparent hover:text-primary font-semibold py-2 px-5 rounded-full"
                  [disabled]="(p.stock || 0) <= 0"
                  (click)="store.addToCart()"
                >
                  Agregar al carrito
                </button>
              </div>

              <!-- Tabs -->
              <div class="mt-6">
                <mat-tab-group animationDuration="200ms">
                  <mat-tab label="Descripción">
                    <div class="pt-4 space-y-3">
                      <p class="text-gray-700">{{ p.descripcion }}</p>
                      <div class="text-sm text-gray-600">
                        <div>Marca: <b>{{ p.marca.nombre }}</b></div>
                        <div>Categoría: <b>{{ p.categoria.nombre }}</b></div>
                        <div>Subcategoría : <b>{{ p.subcategoria.nombre }}</b></div>
                        <div>Stock: <b>{{ p.stock }}</b> ({{ p.stockEstado || '—' }})</div>
                      </div>
                    </div>
                  </mat-tab>

                  <mat-tab label="Especificaciones">
                    <div class="pt-4">
                      <div class="grid sm:grid-cols-2 gap-x-6">
                        <div *ngFor="let prop of p.propiedades || []" class="py-2 border-b border-gray-100">
                          <span class="text-gray-600">{{ prop.label }}:</span>
                          <span class="font-medium ml-1">{{ prop.value }}</span>
                        </div>
                      </div>
                    </div>
                  </mat-tab>

                  <mat-tab [label]="'Reseñas (' + (p.ratingCount || 0) + ')'">
                    <div class="pt-4">
                      <ng-container *ngIf="(p.comentarios || []).length > 0; else noRev">
                        <div class="space-y-4">
                          <div *ngFor="let c of p.comentarios" class="border-t first:border-0 border-gray-100 pt-4">
                            <div class="flex items-center gap-2 text-sm">
                              <span class="font-medium">{{ c.usuarioEmail }}</span>
                              <span class="text-yellow-500">{{ '★★★★★'.slice(0, c.rating || 0) }}</span>
                              <span class="text-gray-400">{{ c.fecha | date:'mediumDate' }}</span>
                            </div>
                            <p class="mt-1 text-gray-700">{{ c.texto }}</p>
                          </div>
                        </div>
                      </ng-container>
                      <ng-template #noRev><p class="text-sm text-gray-500">Aún no hay reseñas.</p></ng-template>
                    </div>
                  </mat-tab>
                </mat-tab-group>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loading>
          <div class="py-16 text-center text-gray-500">Cargando producto...</div>
        </ng-template>
      </div>
    </section>

    <!-- Latest -->
    <section id="latest-products" class="py-10" *ngIf="vm$ | async as vm">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">Últimos productos</h2>

        <div class="flex flex-wrap -mx-4">
          <div *ngFor="let lp of vm.latest" class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <div class="relative mb-4">
                <a class="block" [routerLink]="['/product', lp.idProducto]">
                  <img
                    [src]="lp.foto || 'assets/images/products/default.png'"
                    [alt]="lp.nombre"
                    class="w-full object-cover rounded-lg cursor-pointer"
                  />
                </a>

                <!-- Corazón en cards (solo logueado) -->
                <ng-container *ngIf="globalStore.user$ | async">
                  <button
                    type="button"
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow grid place-items-center hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    (click)="$event.stopPropagation(); globalStore.toggleFavorite(lp.idProducto)"
                    [attr.aria-pressed]="globalStore.isFavorite(lp.idProducto)"
                    [attr.aria-label]="globalStore.isFavorite(lp.idProducto) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                  >
                    <mat-icon
                      class="block leading-none text-[20px] [transform:translateY(4px)]"
                      [ngClass]="globalStore.isFavorite(lp.idProducto) ? 'text-primary' : 'text-gray-400'"
                    >
                      {{ globalStore.isFavorite(lp.idProducto) ? 'favorite' : 'favorite_border' }}
                    </mat-icon>
                  </button>
                </ng-container>
              </div>

              <a class="text-lg font-semibold mb-2 hover:text-primary block" [routerLink]="['/product', lp.idProducto]">
                {{ lp.nombre }}
              </a>

              <p class="my-2">{{ lp.categoria }}</p>

              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">
                  {{ lp.precio | currency:'ARS':'symbol-narrow':'1.2-2' }}
                </span>
                <span *ngIf="lp.precioAnterior" class="text-sm line-through ml-2">
                  {{ lp.precioAnterior | currency:'ARS':'symbol-narrow':'1.2-2' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class ProductComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(ProductStore);
  protected readonly vm$ = this.store.vm$;
  protected readonly globalStore = inject(GlobalStore); // <-- NUEVO

  private readonly productId = toSignal(
    this.route.paramMap.pipe(map((pm) => Number(pm.get('id') ?? '0') || 1)),
    { initialValue: 1 }
  );

  constructor() {
    effect(() => {
      const id = this.productId();
      this.store.loadById(id);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    });

    this.store.loadLatest();
  }
}

import { Component, inject } from '@angular/core';
import { Store } from './shop.store';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { GlobalStore } from '../../global-store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, MatIconModule, SpinnerComponent, RouterLink],
  providers: [Store],
  template: `
    @if(vm$ | async; as vm){ @if(vm.isLoading){
    <app-spinner />
    }
    <section id="shop">
      <div class="container mx-auto">
        <!-- Barra superior de filtros/acciones -->
        <div
          class="flex flex-col md:flex-row justify-between items-center py-4"
        >
          <div class="flex items-center gap-3">
            <button
              class="bg-primary text-white hover:bg-transparent hover:text-primary border hover:border-primary py-2 px-4 rounded-full focus:outline-none"
            >
              Ver ofertas
            </button>
            <button
              class="bg-primary text-white hover:bg-transparent hover:text-primary border hover:border-primary py-2 px-4 rounded-full focus:outline-none"
            >
              Vista lista
            </button>
            <button
              class="bg-primary text-white hover:bg-transparent hover:text-primary border hover:border-primary py-2 px-4 rounded-full focus:outline-none"
            >
              Vista cuadrícula
            </button>
          </div>

          <div class="flex mt-5 md:mt-0">
            <div class="relative">
              <select
                class="block appearance-none w-full bg-white border hover:border-primary px-4 py-2 pr-10 rounded-full shadow leading-tight focus:outline-none focus:shadow-outline"
                aria-label="Ordenar productos"
              >
                <option>Más recientes</option>
                <option>Más populares</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>A–Z</option>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center px-2"
              >
                <img
                  id="arrow-down"
                  class="h-4 w-4"
                  src="/assets/images/filter-down-arrow.svg"
                  alt="abrir opciones"
                />
                <img
                  id="arrow-up"
                  class="h-4 w-4 hidden"
                  src="/assets/images/filter-up-arrow.svg"
                  alt="cerrar opciones"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Botón para mostrar filtros (mobile) -->
        <div class="block md:hidden text-center mb-4">
          <button
            id="products-toggle-filters"
            class="bg-primary text-white py-2 px-4 rounded-full focus:outline-none"
            (click)="open = !open"
          >
            {{ open ? 'Ocultar filtros' : 'Mostrar filtros' }}
          </button>
        </div>

        <div class="flex flex-col md:flex-row">
          <!-- Filtros -->
          <div
            id="filters"
            class="w-full md:w-1/4 p-4"
            [class.hidden]="!open && isMobile"
          >
            <!-- Categoría -->
            <div class="mb-6 pb-8 border-b border-gray-line">
              <h3 class="text-lg font-semibold mb-6">Categoría</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">Notebooks</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">PC de escritorio</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">Monitores</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">Periféricos</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">Componentes</span>
                </label>
              </div>
            </div>

            <!-- Marca -->
            <div class="mb-6 pb-8 border-b border-gray-line">
              <h3 class="text-lg font-semibold mb-6">Marca</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">Lenovo</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">HP</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">ASUS</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">Dell</span>
                </label>
              </div>
            </div>

            <!-- Memoria RAM -->
            <div class="mb-6 pb-8 border-b border-gray-line">
              <h3 class="text-lg font-semibold mb-6">Memoria RAM</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">8 GB</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">16 GB</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">32 GB</span>
                </label>
              </div>
            </div>

            <!-- Almacenamiento -->
            <div class="mb-6 pb-8 border-b border-gray-line">
              <h3 class="text-lg font-semibold mb-6">Almacenamiento</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">SSD 256 GB</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">SSD 512 GB</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">SSD 1 TB</span>
                </label>
              </div>
            </div>

            <!-- Calificación -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-6">Calificación</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">★★★★★</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">★★★★☆</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox custom-checkbox"
                  />
                  <span class="ml-2">★★★☆☆</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Listado de productos -->
          <div class="w-full md:w-3/4 p-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (p of vm.products; track $index) {
              <div class="bg-white p-4 rounded-lg shadow">
                <!-- Imagen + corazón -->
                <div class="relative mb-4">
                  <a class="block" [routerLink]="['/product', p.idProducto]">
                    <img
                      [src]="p.fotos[0] || 'assets/images/products/default.png'"
                      [alt]="p.nombre"
                      class="w-full object-cover rounded-lg cursor-pointer"
                    />
                  </a>

                  <!-- Botón favoritos -->
                  @if(globalStore.user$ | async){
                  <button
                    type="button"
                    class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow grid place-items-center hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                    (click)="
                      $event.stopPropagation();
                      globalStore.toggleFavorite(p.idProducto)
                    "
                    [attr.aria-pressed]="globalStore.isFavorite(p.idProducto)"
                    [attr.aria-label]="
                      globalStore.isFavorite(p.idProducto)
                        ? 'Quitar de favoritos'
                        : 'Agregar a favoritos'
                    "
                  >
                    <mat-icon
                      class="block leading-none text-[20px] [transform:translateY(4px)]"
                      [ngClass]="
                        globalStore.isFavorite(p.idProducto)
                          ? 'text-primary'
                          : 'text-gray-400'
                      "
                    >
                      {{
                        globalStore.isFavorite(p.idProducto)
                          ? 'favorite'
                          : 'favorite_border'
                      }}
                    </mat-icon>
                  </button>
                  }
                </div>

                <a
                  class="text-lg font-semibold mb-2 block hover:text-primary"
                  [routerLink]="['/product', p.idProducto]"
                >
                  {{ p.nombre }}
                </a>

                <p class="my-2 text-gray-600 line-clamp-2">
                  {{ p.descripcion }}
                </p>

                <div class="flex items-center mb-4">
                  <span class="text-lg font-bold text-primary">
                    {{
                      p.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                    }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2">
                  <a
                    class="border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-2 px-4 rounded-full text-center"
                    [routerLink]="['/product', p.idProducto]"
                  >
                    Ver detalle
                  </a>
                  <button
                    class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full"
                    (click)="globalStore.addToCart({ producto: p })"
                  >
                    Agregar
                  </button>
                </div>
              </div>
              }
            </div>

            <!-- Paginación -->
            <div class="flex flex-col items-center gap-3 mt-10">
              <div class="text-sm text-gray-600">
                Página {{ vm.page }} de {{ vm.totalPages }}
              </div>

              <nav aria-label="Paginación de productos">
                <ul
                  class="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-2 py-1.5 rounded-full"
                >
                  <!-- Anterior -->
                  <li>
                    <button
                      class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700
         hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      [disabled]="vm.page === 1"
                      (click)="store.prevPage()"
                      aria-label="Anterior"
                    >
                      <mat-icon>chevron_left</mat-icon>
                    </button>
                  </li>

                  <!-- Números -->
                  @for (p of vm.pages; track p) {
                  <li>
                    <button
                      class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border transition-all
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                      [ngClass]="
                        p === vm.page
                          ? 'bg-primary text-white border-transparent shadow-sm'
                          : 'bg-white text-gray-800 border-gray-300 hover:bg-primary/10 hover:text-primary'
                      "
                      (click)="store.setPage(p)"
                      [attr.aria-current]="p === vm.page ? 'page' : null"
                      [attr.aria-label]="'Página ' + p"
                    >
                      {{ p }}
                    </button>
                  </li>
                  }

                  <!-- Siguiente -->
                  <li>
                    <button
                      class="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700
         hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      [disabled]="vm.page === vm.totalPages"
                      (click)="store.nextPage()"
                      aria-label="Siguiente"
                    >
                      <mat-icon>chevron_right</mat-icon>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Descripción de categoría -->
    <section id="shop-category-description" class="py-8">
      <div class="container mx-auto">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Categoría: Notebooks</h2>
          <p class="mb-4">
            Explorá nuestra selección de notebooks para estudio, trabajo y
            gaming. Encontrá equipos con procesadores Intel o AMD, pantallas
            desde 14" hasta 16", y configuraciones de memoria y almacenamiento
            para cada necesidad.
          </p>
          <p>
            Todos los modelos incluyen garantía oficial y soporte. Aprovechá las
            ofertas y armá tu set con periféricos, monitores y mochilas para
            completar tu setup. ¡Comprá online y recibí en tu casa!
          </p>
        </div>
      </div>
    </section>
    }
  `,
})
export class ShopComponent {
  protected open = false;
  protected readonly store = inject(Store);
  protected readonly globalStore = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;

  constructor() {
    this.store.loadData();
  }

  get isMobile() {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Store } from './index.store';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { GlobalStore } from '../../global-store';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, RouterLink, MatIconModule],
  providers: [Store],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    .brands-swiper-slider .swiper-button-prev,
    .brands-swiper-slider .swiper-button-next {
      color: #ff0042 !important;
    }
  `,
  template: `
    @if (vm$ | async; as vm) { @if (vm.isLoading) {
    <app-spinner />
    } @if (vm.slides?.length! > 0) {
    <section id="product-slider" class="relative">
      <swiper-container
        #mainSwiper
        pagination="true"
        navigation-prev-el=".swiper-button-prev-main"
        navigation-next-el=".swiper-button-next-main"
        autoplay-delay="4000"
        autoplay-disable-on-interaction="false"
        class="[--swiper-navigation-color:#fff] [--swiper-pagination-color:#fff]"
        style="width:100%;height:70vh;display:block"
      >
        @for (slide of vm.slides; track slide.idCarruselPrincipal) {
        <swiper-slide>
          <div class="relative w-full h-full">
            <img
              [src]="
                slide.imagenUrl || 'assets/images/main-slider/place_holder.png'
              "
              class="w-full h-full object-cover"
              [alt]="slide.titulo"
              loading="eager"
            />
            <div
              class="absolute inset-0 flex items-end justify-start text-left p-6 md:p-12"
            >
              <div class="max-w-xl pb-10 md:pb-16">
                <h2
                  class="text-3xl md:text-7xl font-bold text-white mb-3 md:mb-4"
                >
                  {{ slide.titulo }}
                </h2>

                <p
                  class="mb-4 text-white md:text-2xl"
                  [innerHTML]="slide.descripcion"
                ></p>

                <a
                  [href]="slide.link"
                  class="bg-primary hover:bg-transparent text-white
                             hover:text-white border border-transparent
                             hover:border-white font-semibold px-4 py-2 rounded-full inline-block"
                >
                  Ver más
                </a>
              </div>
            </div>
          </div>
        </swiper-slide>
        }

        <!-- Botones -->
        <div slot="container-end">
          <div class="swiper-button-prev-main swiper-button-prev"></div>
          <div class="swiper-button-next-main swiper-button-next"></div>
        </div>
      </swiper-container>
    </section>
    }

    <!-- ========================================= -->
    <!-- PRODUCTOS POPULARES -->
    <!-- ========================================= -->
    <section id="popular-products" class="mt-10">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">Productos populares</h2>

        <div class="flex flex-wrap -mx-4">
          @for (product of vm.popularProducts; track product.idProducto) {
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <div class="relative mb-4">
                <a
                  class="block"
                  [routerLink]="['/product', product.idProducto]"
                >
                  <img
                    [src]="
                      product.fotos[0] || 'assets/images/products/default.png'
                    "
                    class="w-full object-cover mb-4 rounded-lg cursor-pointer"
                  />
                </a>

                @if (globalStore.user$ | async) {
                <button
                  type="button"
                  class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90
                               backdrop-blur-sm shadow grid place-items-center hover:bg-white"
                  (click)="globalStore.toggleFavorite(product.idProducto)"
                >
                  <mat-icon
                    class="text-[20px]"
                    [ngClass]="{
                      'text-primary': globalStore.isFavorite(
                        product.idProducto
                      ),
                      'text-gray-400': !globalStore.isFavorite(
                        product.idProducto
                      )
                    }"
                  >
                    {{
                      globalStore.isFavorite(product.idProducto)
                        ? 'favorite'
                        : 'favorite_border'
                    }}
                  </mat-icon>
                </button>
                }
              </div>

              <a
                class="text-lg font-semibold mb-2 hover:text-primary block"
                [routerLink]="['/product', product.idProducto]"
              >
                {{ product.nombre }}
              </a>

              <p class="my-2">{{ product.categoria.nombre }}</p>

              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">
                  {{
                    product.precio
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </span>

                @if (product.precioAnterior && product.precio <
                product.precioAnterior) {
                <span class="text-sm line-through ml-2">
                  {{
                    product.precioAnterior
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </span>
                }
              </div>

              <button
                class="bg-primary border border-transparent hover:bg-transparent
                           hover:border-primary text-white hover:text-primary
                           font-semibold py-2 px-4 rounded-full w-full"
                (click)="globalStore.addToCart({ producto: product })"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
          }
        </div>
      </div>
    </section>

    <!-- ========================================= -->
    <!-- ÚLTIMOS INGRESOS -->
    <!-- ========================================= -->
    <section id="latest-products" class="py-10">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">Últimos ingresos</h2>

        <div class="flex flex-wrap -mx-4">
          @for (product of vm.latestProducts; track product.idProducto) {
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <div class="relative mb-4">
                <a
                  class="block"
                  [routerLink]="['/product', product.idProducto]"
                >
                  <img
                    [src]="
                      product.fotos[0] || 'assets/images/products/default.png'
                    "
                    class="w-full object-cover mb-4 rounded-lg cursor-pointer"
                  />
                </a>

                @if (globalStore.user$ | async) {
                <button
                  type="button"
                  class="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90
                               backdrop-blur-sm shadow grid place-items-center hover:bg-white"
                  (click)="globalStore.toggleFavorite(product.idProducto)"
                >
                  <mat-icon
                    [ngClass]="{
                      'text-primary': globalStore.isFavorite(
                        product.idProducto
                      ),
                      'text-gray-400': !globalStore.isFavorite(
                        product.idProducto
                      )
                    }"
                  >
                    {{
                      globalStore.isFavorite(product.idProducto)
                        ? 'favorite'
                        : 'favorite_border'
                    }}
                  </mat-icon>
                </button>
                }
              </div>

              <a
                class="text-lg font-semibold mb-2 hover:text-primary block"
                [routerLink]="['/product', product.idProducto]"
              >
                {{ product.nombre }}
              </a>

              <p class="my-2">{{ product.categoria.nombre }}</p>

              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">
                  {{
                    product.precio
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </span>

                @if (product.precioAnterior && product.precio <
                product.precioAnterior) {
                <span class="text-sm line-through ml-2">
                  {{
                    product.precioAnterior
                      | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                  }}
                </span>
                }
              </div>

              <button
                class="bg-primary border border-transparent hover:bg-transparent
                           hover:border-primary text-white hover:text-primary
                           font-semibold py-2 px-4 rounded-full w-full"
                (click)="globalStore.addToCart({ producto: product })"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
          }
        </div>
      </div>
    </section>

    @if (vm.brands?.length! > 0) {
    <section id="brands" class="bg-white py-16 px-4 relative">
      <div class="container mx-auto max-w-screen-xl px-4">
        <div class="text-center mb-12 lg:mb-20">
          <h2 class="text-5xl font-bold mb-4">
            Descubrí <span class="text-primary">Nuestras Marcas</span>
          </h2>
          <p class="my-7">Trabajamos con las marcas líderes del mercado</p>
        </div>

        <swiper-container
          class="brands-swiper-slider"
          space-between="24"
          free-mode="true"
          pagination="true"
          navigation-prev-el=".swiper-button-prev-brands"
          navigation-next-el=".swiper-button-next-brands"
          slides-per-group="1"
          breakpoints='{
              "0":    { "slidesPerView": 2 },
              "640":  { "slidesPerView": 3 },
              "1024": { "slidesPerView": 5 }
            }'
          autoplay-delay="2500"
          autoplay-disable-on-interaction="false"
          style="width:100%; display:block"
        >
          @for (brand of vm.brands; track brand.idCarruselMarcas) {
          <swiper-slide>
            <div
              class="w-[120px] sm:w-[140px] lg:w-[160px]
             mx-auto flex flex-col items-center justify-center"
            >
              <div
                class="h-[80px] sm:h-[90px] lg:h-[100px]
               flex items-center justify-center"
              >
                <img
                  [src]="
                    brand.logoUrl || 'assets/images/brands/place_holder.png'
                  "
                  [alt]="brand.nombre"
                  class="max-h-full max-w-full object-contain"
                />
              </div>

              <span class="mt-2 text-xs sm:text-sm text-gray-700 text-center">
                {{ brand.nombre }}
              </span>
            </div>
          </swiper-slide>
          }

          <div slot="container-end">
            <div class="swiper-button-prev-brands swiper-button-prev"></div>
            <div class="swiper-button-next-brands swiper-button-next"></div>
          </div>
        </swiper-container>
      </div>
    </section>
    } }
  `,
})
export class IndexComponent {
  @ViewChild('mainSwiper', { static: false }) mainSwiper!: ElementRef;
  protected readonly store = inject(Store);
  protected readonly globalStore = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;
  readonly vm = toSignal(this.store.vm$);
  readonly slides = toSignal(this.store.slides$);

  constructor() {
    effect(() => {
      const slides = this.slides();
      if (!slides || slides.length < 2) return;

      const swiperEl = this.mainSwiper?.nativeElement;
      if (!swiperEl) return;

      queueMicrotask(() => swiperEl.swiper?.update());
    });

    this.store.loadData();
  }
}

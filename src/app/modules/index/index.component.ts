import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-layout',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
   .brands-swiper-slider .swiper-button-prev, .brands-swiper-slider .swiper-button-next {
    color: #ff0042 !important;
   }
  `,
  template: `
    <!-- Slider -->
    <section id="product-slider" class="relative">
      <swiper-container
        loop="true"
        pagination="true"
        navigation-prev-el=".swiper-button-prev"
        navigation-next-el=".swiper-button-next"
        autoplay-delay="4000"
        autoplay-disable-on-interaction="false"
        class="[--swiper-navigation-color:#fff] [--swiper-pagination-color:#fff]"
        style="width:100%;height:70vh;display:block"
      >
        <!-- Slide 1 -->
        <swiper-slide>
          <div class="relative w-full h-full">
            <img src="assets/images/main-slider/2.png" alt="Slide 1" class="w-full h-full object-cover" loading="eager" />
            <div class="swiper-slide-content absolute inset-0 flex items-end justify-start text-left p-6 md:p-12">
              <div class="max-w-xl pb-10 md:pb-16">
                <h2 class="text-3xl md:text-7xl font-bold text-white mb-3 md:mb-4">
                  Notebooks para todo
                </h2>
                <p class="mb-4 text-white md:text-2xl">
                  Rendimiento, batería y portabilidad. Elegí tu próxima <br/> notebook para estudio, trabajo o gaming.
                </p>
                <a href="/shop" class="bg-primary hover:bg-transparent text-white hover:text-white border border-transparent hover:border-white font-semibold px-4 py-2 rounded-full inline-block">
                  Ver notebooks
                </a>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 2 -->
        <swiper-slide>
          <div class="relative w-full h-full">
            <img src="assets/images/main-slider/5.png" alt="Slide 2" class="w-full h-full object-cover" loading="lazy" />
            <div class="swiper-slide-content absolute inset-0 flex items-end justify-start text-left p-6 md:p-12">
              <div class="max-w-xl pb-10 md:pb-16">
                <h2 class="text-3xl md:text-7xl font-bold text-white mb-3 md:mb-4">
                  PCs armadas y a medida
                </h2>
                <p class="mb-4 text-white md:text-2xl">
                  Equipos listos para usar o configurados por vos. <br/> Potencia para trabajar, crear y jugar.
                </p>
                <a href="/shop" class="bg-white hover:bg-transparent text-black hover:text-white font-semibold px-4 py-2 rounded-full inline-block border border-transparent hover:border-white">
                  Ver PCs
                </a>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Slide 3 -->
        <swiper-slide>
          <div class="relative w-full h-full">
            <img src="assets/images/main-slider/4.png" alt="Slide 3" class="w-full h-full object-cover" loading="lazy" />
            <div class="swiper-slide-content absolute inset-0 flex items-end justify-start text-left p-6 md:p-12">
              <div class="max-w-xl pb-10 md:pb-16">
                <h2 class="text-3xl md:text-7xl font-bold text-white mb-3 md:mb-4">
                  Gaming sin límites
                </h2>
                <p class="mb-4 text-white md:text-2xl">
                  Monitores, teclados, auriculares y más. <br/> Todo para subir de nivel.
                </p>
                <a href="/shop" class="bg-primary hover:bg-transparent text-white hover:text-white border border-transparent hover:border-white font-semibold px-4 py-2 rounded-full inline-block">
                  Ver Gaming
                </a>
              </div>
            </div>
          </div>
        </swiper-slide>

        <!-- Botones -->
        <div slot="container-end">
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      </swiper-container>
    </section>

    <!-- Banners de categorías -->
    <section id="product-banners">
      <div class="container mx-auto py-10">
        <div class="flex flex-wrap -mx-4">
          <!-- Category 1 -->
          <div class="w-full sm:w-1/3 px-4 mb-8">
            <div class="category-banner relative overflow-hidden rounded-lg shadow-lg group">
              <img src="/assets/images/cat-image1.png" alt="Categoría Notebooks" class="w-full h-auto" />
              <div class="absolute inset-0 bg-gray-light bg-opacity-50"></div>
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                <h2 class="text-2xl md:text-3xl font-bold mb-4">Notebooks</h2>
                <a href="/shop" class="bg-primary hover:bg-transparent border border-transparent hover:border-white text-white hover:text-white font-semibold px-4 py-2 rounded-full inline-block">
                  Ver modelos
                </a>
              </div>
            </div>
          </div>

          <!-- Category 2 -->
          <div class="w-full sm:w-1/3 px-4 mb-8">
            <div class="category-banner relative overflow-hidden rounded-lg shadow-lg group">
              <img src="/assets/images/cat-image4.png" alt="Categoría Monitores" class="w-full h-auto" />
              <div class="absolute inset-0 bg-gray-light bg-opacity-50"></div>
              <div class="category-text absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 transition duration-300">
                <h2 class="text-2xl md:text-3xl font-bold mb-4">Monitores</h2>
                <a href="/shop" class="bg-primary hover:bg-transparent border border-transparent hover:border-white text-white hover:text-white font-semibold px-4 py-2 rounded-full inline-block">
                  Ver monitores
                </a>
              </div>
            </div>
          </div>

          <!-- Category 3 -->
          <div class="w-full sm:w-1/3 px-4 mb-8">
            <div class="category-banner relative overflow-hidden rounded-lg shadow-lg group">
              <img src="/assets/images/cat-image5.png" alt="Categoría Periféricos" class="w-full h-auto" />
              <div class="absolute inset-0 bg-gray-light bg-opacity-50"></div>
              <div class="category-text absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 transition duration-300">
                <h2 class="text-2xl md:text-3xl font-bold mb-4">Periféricos</h2>
                <a href="/shop" class="bg-primary hover:bg-transparent border border-transparent hover:border-white text-white hover:text-white font-semibold px-4 py-2 rounded-full inline-block">
                  Ver periféricos
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Productos populares -->
    <section id="popular-products">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">Productos populares</h2>
        <div class="flex flex-wrap -mx-4">
          <!-- Product 1 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/1.jpg" alt="Producto 1" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">Notebook 14" ultraliviana</a>
              <p class="my-2">Notebooks</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">$799.999</span>
                <span class="text-sm line-through ml-2">$899.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product 2 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/2.jpg" alt="Producto 2" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">PC Desktop Office</a>
              <p class="my-2">PCs</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-gray-900">$599.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product 3 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/3.jpg" alt="Producto 3" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">Monitor 24" FHD 75Hz</a>
              <p class="my-2">Monitores</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-gray-900">$199.999</span>
                <span class="text-sm line-through ml-2">$229.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product 4 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/4.jpg" alt="Producto 4" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold">Auriculares Gaming RGB</a>
              <p class="my-2">Gaming / Audio</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">$39.999</span>
                <span class="text-sm line-through ml-2">$49.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Últimos ingresos -->
    <section id="latest-products" class="py-10">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-8">Últimos ingresos</h2>
        <div class="flex flex-wrap -mx-4">
          <!-- Product 1 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/5.jpg" alt="Producto 1" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">Teclado mecánico TKL</a>
              <p class="my-2">Periféricos</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">$29.999</span>
                <span class="text-sm line-through ml-2">$34.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product 2 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/6.jpg" alt="Producto 2" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">Mouse inalámbrico</a>
              <p class="my-2">Periféricos</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-gray-900">$12.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product 3 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/7.jpg" alt="Producto 3" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">Silla Gamer reclinable</a>
              <p class="my-2">Gaming</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-gray-900">$99.999</span>
                <span class="text-sm line-through ml-2">$119.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>

          <!-- Product 4 -->
          <div class="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
            <div class="bg-white p-3 rounded-lg shadow-lg">
              <img src="assets/images/products/8.jpg" alt="Producto 4" class="w-full object-cover mb-4 rounded-lg" />
              <a href="#" class="text-lg font-semibold mb-2">SSD NVMe 1TB</a>
              <p class="my-2">Almacenamiento</p>
              <div class="flex items-center mb-4">
                <span class="text-lg font-bold text-primary">$79.999</span>
                <span class="text-sm line-through ml-2">$89.999</span>
              </div>
              <button class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marcas -->
    <section id="brands" class="bg-white py-16 px-4 relative">
      <div class="container mx-auto max-w-screen-xl px-4">
        <div class="text-center mb-12 lg:mb-20">
          <h2 class="text-5xl font-bold mb-4">
            Descubrí <span class="text-primary">Nuestras Marcas</span>
          </h2>
          <p class="my-7">Trabajamos con las marcas líderes del mercado</p>
        </div>

        <swiper-container
          class="brands-swiper-slider [--swiper-navigation-color:#ff0042]"
          space-between="24"
          free-mode="true"
          pagination="true"
          navigation-prev-el=".swiper-button-prev"
          navigation-next-el=".swiper-button-next"
          loop="true"
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
          <!-- Slides de marcas (dejan las imágenes tal cual) -->
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/gigatech.png" alt="HTML" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/terabyte.png" alt="JavaScript" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/bytecom.png" alt="Laravel" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/quantic.png" alt="PHP" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/quatix.png" alt="React" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/solytic.png" alt="Tailwind" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="w-[120px] sm:w-[140px] lg:w-[160px] h-[80px] sm:h-[90px] lg:h-[100px] mx-auto flex items-center justify-center">
              <img src="/assets/images/brands/labora.png" alt="TypeScript" class="max-h-full max-w-full object-contain" />
            </div>
          </swiper-slide>

          <div slot="container-end">
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </swiper-container>
      </div>
    </section>

    <!-- Banner -->
    <section id="banner" class="relative my-16">
      <div class="container mx-auto px-4 py-20 rounded-lg relative bg-cover bg-center" style="background-image: url('assets/images/banner1.png');">
        <div class="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
        <div class="relative flex flex-col items-center justify-center h-full text-center text-white py-20">
          <h2 class="text-4xl font-bold mb-4">Tecnología al mejor precio</h2>
          <div class="flex space-x-4">
            <a href="#" class="bg-primary hover:bg-transparent text-white hover:text-primary border border-transparent hover:border-primary font-semibold px-4 py-2 rounded-full inline-block">
              Ofertas
            </a>
            <a href="#" class="bg-primary hover:bg-transparent text-white hover:text-primary border border-transparent hover:border-primary font-semibold px-4 py-2 rounded-full inline-block">
              Nuevos ingresos
            </a>
            <a href="#" class="bg-primary hover:bg-transparent text-white hover:text-primary border border-transparent hover:border-primary font-semibold px-4 py-2 rounded-full inline-block">
              Ver catálogo
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog
    <section class="py-16">
      <div class="text-center mb-12 lg:mb-20">
        <h2 class="text-5xl font-bold mb-4">
          Novedades <span class="text-primary">del Blog</span>
        </h2>
        <p class="my-7">
          Tips, configuraciones y guías para elegir tu próxima compu y accesorios.
        </p>
      </div>
      <div class="relative items-center w-full px-5 py-12 mx-auto md:px-12 lg:px-24 max-w-7xl">
        <div class="grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-3">
          <div class="flex flex-col p-6 bg-white rounded-xl shadow-lg">
            <img class="object-cover object-center w-full mb-8 rounded-xl" src="/assets/images/fashion-trends.jpg" alt="blog" />
            <h2 class="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">Guías de compra</h2>
            <h1 class="mb-4 text-2xl font-semibold leading-none tracking-tighter text-gray-dark lg:text-3xl">
              ¿Notebook o PC de escritorio?
            </h1>
            <p class="flex-grow text-base font-medium leading-relaxed text-gray-txt">
              Te contamos qué conviene según tu uso: estudio, trabajo creativo o gaming. Pros y contras de cada opción.
            </p>
            <div class="mt-8">
              <a href="#" class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Leer más
              </a>
            </div>
          </div>

          <div class="flex flex-col p-6 bg-white rounded-xl shadow-lg">
            <img class="object-cover object-center w-full mb-8 rounded-xl" src="/assets/images/stylisng-tips.jpg" alt="blog" />
            <h2 class="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">Periféricos</h2>
            <h1 class="mb-4 text-2xl font-semibold leading-none tracking-tighter text-gray-dark lg:text-3xl">
              Cómo elegir tu teclado y mouse
            </h1>
            <p class="flex-grow text-base font-medium leading-relaxed text-gray-txt">
              Mecanismos, tamaños, sensores y ergonomía. Elegí el combo ideal para productividad o gaming.
            </p>
            <div class="mt-8">
              <a href="#" class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Leer más
              </a>
            </div>
          </div>

          <div class="flex flex-col p-6 bg-white rounded-xl shadow-lg">
            <img class="object-cover object-center w-full mb-8 rounded-xl" src="/assets/images/customer-stories.jpg" alt="blog" />
            <h2 class="mb-2 text-xs font-semibold tracking-widest text-primary uppercase">Monitores</h2>
            <h1 class="mb-4 text-2xl font-semibold leading-none tracking-tighter text-gray-dark lg:text-3xl">
              60Hz vs 144Hz: ¿se nota la diferencia?
            </h1>
            <p class="flex-grow text-base font-medium leading-relaxed text-gray-txt">
              Te explicamos cuándo conviene subir la tasa de refresco y qué tener en cuenta al elegir tu monitor.
            </p>
            <div class="mt-8">
              <a href="#" class="bg-primary border border-transparent hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full w-full">
                Leer más
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>-->

    <!-- Suscripción
    <section id="subscribe" class="py-6 lg:py-24 bg-white border-t border-gray-line">
      <div class="container mx-auto">
        <div class="flex flex-col items-center rounded-lg p-4 sm:p-0 ">
          <div class="mb-8">
            <h2 class="text-center text-xl font-bold sm:text-2xl lg:text-left lg:text-3xl">
              Sumate al newsletter y <span class="text-primary">obtené $50 de descuento</span> en tu primera compra
            </h2>
          </div>
          <div class="flex flex-col items-center w-96 ">
            <form class="flex w-full gap-2">
              <input
                placeholder="Ingresá tu e-mail"
                class="w-full flex-1 rounded-full px-3 py-2 border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary"
              />
              <button class="bg-primary border border-primary hover:bg-transparent hover:border-primary text-white hover:text-primary font-semibold py-2 px-4 rounded-full">
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>-->
  `,
})
export class IndexComponent {
  protected openMen = false;
  protected openWomen = false;
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  template: `
    <!-- 404 -->
    <section
      id="404-page"
      class="bg-white py-16 flex items-center justify-center min-h-screen"
    >
      <div class="mx-auto max-w-screen-lg px-4 md:px-8">
        <div class="grid gap-8 sm:grid-cols-2">
          <!-- Texto -->
          <div
            class="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32"
          >
            <h1 class="text-4xl font-bold text-primary mb-5">
              404 - Página no encontrada
            </h1>
            <p class="text-gray-txt mb-5">
              La página que estás buscando pudo haber sido eliminada, renombrada
              o no está disponible temporalmente.
            </p>
            <a
              href="/"
              class="bg-primary hover:bg-transparent border border-transparent hover:border-primary text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block"
              >Volver al inicio</a
            >
          </div>

          <!-- Imagen -->
          <div
            class="relative h-80 overflow-hidden rounded-lg bg-gray-100 shadow-lg p-2"
          >
            <img
              src="assets/images/404.png"
              alt="Página no encontrada"
              class="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class NotFoundComponent {}

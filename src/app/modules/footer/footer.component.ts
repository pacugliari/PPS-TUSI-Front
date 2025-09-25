import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Footer -->
    <footer class="border-t border-gray-line">
      <!-- Top part -->
      <div class="container mx-auto px-4 py-10">
        <div class="flex flex-wrap -mx-4">
          <!-- Menú 1 -->
          <div class="w-full sm:w-1/6 px-4 mb-8">
            <h3 class="text-lg font-semibold mb-4">Tienda</h3>
            <ul>
              <li><a routerLink="/shop" class="hover:text-primary">Productos</a></li>
              <li><a routerLink="/product" class="hover:text-primary">Computadoras</a></li>
              <li><a routerLink="/shop" class="hover:text-primary">Notebooks</a></li>
              <li><a routerLink="/product" class="hover:text-primary">Periféricos</a></li>
              <li><a routerLink="/product" class="hover:text-primary">Accesorios</a></li>
            </ul>
          </div>

          <!-- Menú 2 -->
          <div class="w-full sm:w-1/6 px-4 mb-8">
            <h3 class="text-lg font-semibold mb-4">Páginas</h3>
            <ul>
              <li><a routerLink="/shop" class="hover:text-primary">Catálogo</a></li>
              <li><a routerLink="/product" class="hover:text-primary">Detalle de Producto</a></li>
              <li><a routerLink="/checkout" class="hover:text-primary">Finalizar Compra</a></li>
              <li><a routerLink="/**" class="hover:text-primary">Error 404</a></li>
            </ul>
          </div>

          <!-- Menú 3 -->
          <div class="w-full sm:w-1/6 px-4 mb-8">
            <h3 class="text-lg font-semibold mb-4">Cuenta</h3>
            <ul>
              <li><a routerLink="/cart" class="hover:text-primary">Carrito</a></li>
              <li><a routerLink="/register" class="hover:text-primary">Registrarse</a></li>
              <li><a routerLink="/register" class="hover:text-primary">Iniciar Sesión</a></li>
            </ul>
          </div>

          <!-- Redes Sociales -->
          <div class="w-full sm:w-1/6 px-4 mb-8">
            <h3 class="text-lg font-semibold mb-4">Síguenos</h3>
            <ul>
              <li class="flex items-center mb-2">
                <img src="/assets/images/social_icons/facebook.svg" alt="Facebook" class="w-4 h-4 mr-2" />
                <a href="#" class="hover:text-primary">Facebook</a>
              </li>
              <li class="flex items-center mb-2">
                <img src="/assets/images/social_icons/twitter.svg" alt="Twitter" class="w-4 h-4 mr-2" />
                <a href="#" class="hover:text-primary">Twitter</a>
              </li>
              <li class="flex items-center mb-2">
                <img src="/assets/images/social_icons/instagram.svg" alt="Instagram" class="w-4 h-4 mr-2" />
                <a href="#" class="hover:text-primary">Instagram</a>
              </li>
              <li class="flex items-center mb-2">
                <img src="/assets/images/social_icons/youtube.svg" alt="YouTube" class="w-4 h-4 mr-2" />
                <a href="#" class="hover:text-primary">YouTube</a>
              </li>
            </ul>
          </div>

          <!-- Información de Contacto -->
          <div class="w-full sm:w-2/6 px-4 mb-8">
            <h3 class="text-lg font-semibold mb-4">Contáctanos</h3>
            <p>
              <img src="assets/images/template-logo.png" alt="Logo" class="h-[60px] mb-4" />
            </p>
            <p>Avenida Siempre Viva 742, Buenos Aires, Argentina</p>
            <p class="text-xl font-bold my-4">Tel: (011) 456-7890</p>
            <a href="mailto:info&#64;pcs-hs.com" class="underline">Email: info&#64;pcs-hs.com</a>
          </div>
        </div>
      </div>

      <!-- Bottom part -->
      <div class="py-6 border-t border-gray-line">
        <div class="container mx-auto px-4 flex flex-wrap justify-between items-center">
          <!-- Copyright -->
          <div class="w-full lg:w-3/4 text-center lg:text-left mb-4 lg:mb-0">
            <p class="mb-2 font-bold">&copy; 2024 PCS-HS. Todos los derechos reservados.</p>
            <ul class="flex justify-center lg:justify-start space-x-4 mb-4 lg:mb-0">
              <li><a href="#" class="hover:text-primary">Política de Privacidad</a></li>
              <li><a href="#" class="hover:text-primary">Términos y Condiciones</a></li>
              <li><a href="#" class="hover:text-primary">Preguntas Frecuentes</a></li>
            </ul>
            <p class="text-sm mt-4">
              PCS-HS es tu casa de computación de confianza: notebooks, PCs armadas, accesorios, periféricos y más.
            </p>
          </div>

          <!-- Métodos de Pago -->
          <div class="w-full lg:w-1/4 text-center lg:text-right">
            <img src="/assets/images/social_icons/paypal.svg" alt="PayPal" class="inline-block h-8 mr-2" />
            <img src="/assets/images/social_icons/stripe.svg" alt="Stripe" class="inline-block h-8 mr-2" />
            <img src="/assets/images/social_icons/visa.svg" alt="Visa" class="inline-block h-8" />
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

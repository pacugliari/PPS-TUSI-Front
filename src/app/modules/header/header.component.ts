import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { GlobalStore } from '../../global-store';
import { RolType } from '../../shared/models/rol.model';
import { CartDropdownComponent } from './cart-dropdown/cart-dropdown.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, CartDropdownComponent],
  template: `
    @if(vm$ | async; as vm){
    <!-- Header -->
    <header class="bg-gray-dark sticky top-0 z-50">
      <div class="container mx-auto flex justify-between items-center py-4">
        <!-- Left section: Logo -->
        <a routerLink="/" class="flex items-center">
          <div>
            <img
              src="./assets/images/template-white-logo.png"
              alt="Logo"
              class="h-14 w-auto mr-4"
            />
          </div>
        </a>

        <!-- Hamburger menu (for mobile) -->
        <div class="flex lg:hidden">
          <button id="hamburger"
                  class="text-white focus:outline-none"
                  (click)="toggleMobileMenu()"
                  aria-controls="mobile-menu-placeholder"
                  [attr.aria-expanded]="mobileOpen">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        <!-- Center section: Menu (desktop) -->
        <nav class="hidden lg:flex md:flex-grow justify-center">
          <ul class="flex justify-center space-x-4 text-white">
            <li>
              <a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Notebooks</a>
            </li>
            <li>
              <a routerLink="/shop" class="hover:text-secondary font-bold block py-2">PCs</a>
            </li>
            <li>
              <a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Monitores</a>
            </li>
            <li>
              <a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Periféricos</a>
            </li>
            <li>
              <a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Gaming</a>
            </li>
          </ul>
        </nav>

        <!-- Right section: Buttons (for desktop) -->
        <div class="hidden lg:flex items-center space-x-4 relative">
          @if(!vm.user){
            <a routerLink="/register"
               class="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block">
              Ingresar
            </a>
          } @else {
            <button routerLink="/account"
                    class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 min-w-[140px]">
              <mat-icon fontIcon="person"></mat-icon>
              <span>{{ vm.user.perfil?.nombre || vm.user.role.nombre }}</span>
            </button>
          }
          @if(![rolTypes.OPERARIO,rolTypes.ADMINISTRADOR].includes(vm.user?.role?.tipo!)){
            <div class="relative inline-block group cart-wrapper">
              <a routerLink="/cart" class="relative inline-flex">
                <img
                  src="assets/images/cart-shopping.svg"
                  alt="Carrito"
                  class="h-6 w-6 transition-transform group-hover:scale-110"
                />
                @if (store.cartCount$ | async; as count) { @if (count > 0) {
                  <span
                    class="pointer-events-none absolute -top-2 -right-2 min-w-[20px] h-5 px-1
                           rounded-full bg-primary text-white text-[11px] leading-5
                           text-center font-semibold shadow ring-2 ring-white
                           animate-[pop_120ms_ease-out]"
                    [attr.aria-label]="'Productos en carrito: ' + count">
                    {{ count }}
                  </span>
                } }
              </a>

              <span class="absolute right-0 top-full w-8 h-2 bg-transparent" aria-hidden="true"></span>

              <app-cart-dropdown
                class="absolute right-0 top-[calc(100%+0.25rem)] z-50 min-w-[280px]
                       text-black rounded shadow-lg p-2
                       opacity-0 pointer-events-none translate-y-1 -translate-x-1
                       transition ease-out duration-150
                       group-hover:opacity-100 group-hover:pointer-events-auto
                       group-hover:translate-y-0 group-hover:translate-x-0
                       group-focus-within:opacity-100 group-focus-within:pointer-events-auto
                       group-focus-within:translate-y-0 group-focus-within:translate-x-0"
                [productos]="vm.cart || []"
              />
            </div>

            <a id="search-icon"
               href="javascript:void(0);"
               class="text-white hover:text-secondary group">
              <img
                src="assets/images/search-icon.svg"
                alt="Search"
                class="h-6 w-6 transition-transform transform group-hover:scale-120"
              />
            </a>

            <!-- Search field (desktop, oculto por ahora) -->
            <div id="search-field"
                 class="hidden absolute top-full right-0 mt-2 w-full bg-white shadow-lg p-2 rounded">
              <input type="text" class="w-full p-2 border border-gray-300 rounded" placeholder="Search for products..." />
            </div>
          }
        </div>
      </div>
    </header>

    <!-- Mobile menu -->
    <nav id="mobile-menu-placeholder"
         class="mobile-menu lg:hidden flex flex-col items-center space-y-8 h-screen"
         [class.hidden]="!mobileOpen">
      <ul class="w-full">
        <li><a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Notebooks</a></li>
        <li><a routerLink="/shop" class="hover:text-secondary font-bold block py-2">PCs</a></li>
        <li><a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Monitores</a></li>
        <li><a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Periféricos</a></li>
        <li><a routerLink="/shop" class="hover:text-secondary font-bold block py-2">Gaming</a></li>
      </ul>

      <div class="flex flex-col mt-6 space-y-2 items-center">
        @if(!vm.user){
          <a routerLink="/register"
             class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]">
            Ingresar
          </a>
        } @else {
          <button routerLink="/account"
                  class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 min-w-[140px]">
            <mat-icon fontIcon="person"></mat-icon>
            <span>{{ vm.user.perfil?.nombre || vm.user.role.nombre }}</span>
          </button>
        }

        <a routerLink="/cart"
           class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]">
          Cart -&nbsp;<span>5</span>&nbsp;items
        </a>
      </div>

      <!-- Search field (mobile) -->
      <div class="top-full right-0 mt-2 w-full bg-white shadow-lg p-2 rounded">
        <input type="text" class="w-full p-2 border border-gray-300 rounded" placeholder="Search for products..." />
      </div>
    </nav>
    }
  `,
})
export class HeaderComponent {
  protected openMen = false;
  protected openWomen = false;
  protected mobileOpen = false; // <-- toggle del menú mobile

  protected rolTypes = RolType;
  protected readonly store = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;

  constructor(private router: Router) {
    // Opcional: cerrar el menú al navegar
    this.router.events.subscribe(() => {
      if (this.mobileOpen) this.mobileOpen = false;
    });
  }

  toggleMobileMenu() {
    this.mobileOpen = !this.mobileOpen;
  }
}

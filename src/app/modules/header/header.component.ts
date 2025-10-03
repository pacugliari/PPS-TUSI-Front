import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStore } from '../../global-store';
import { RolType } from '../../shared/rol.model';
import { MatIconModule } from '@angular/material/icon';
import { CartDropdownComponent } from './cart-dropdown/cart-dropdown.component';

@Component({
  selector: 'app-header',
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
          <button id="hamburger" class="text-white focus:outline-none">
            <svg
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Center section: Menu -->

        <nav class="hidden lg:flex md:flex-grow justify-center">
          <ul class="flex justify-center space-x-4 text-white">
            <!--<li>
              <a routerLink="/" class="hover:text-secondary font-semibold"
                >Home</a
              >
            </li>

            <li class="relative group">
              <button
                type="button"
                class="hover:text-secondary font-semibold flex items-center"
              >
                Men
                <i
                  class="fas fa-chevron-down ml-1 text-xs transition-transform group-hover:rotate-180"
                ></i>
              </button>

              <ul
                class="absolute left-0 top-full z-50 bg-white text-black rounded shadow-lg space-y-2 p-2
               invisible opacity-0 translate-y-1 transition ease-out duration-150
               group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
              >
                <li>
                  <a
                    routerLink="/shop"
                    class="block min-w-[10rem] px-4 py-2 hover:bg-primary hover:text-white rounded"
                    >Men Item 1</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/shop"
                    class="block min-w-[10rem] px-4 py-2 hover:bg-primary hover:text-white rounded"
                    >Men Item 2</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/shop"
                    class="block min-w-[10rem] px-4 py-2 hover:bg-primary hover:text-white rounded"
                    >Men Item 3</a
                  >
                </li>
              </ul>
            </li>

            <li class="relative group">
              <button
                type="button"
                class="hover:text-secondary font-semibold flex items-center"
              >
                Women
                <i
                  class="fas fa-chevron-down ml-1 text-xs transition-transform group-hover:rotate-180"
                ></i>
              </button>

              <ul
                class="absolute left-0 top-full z-50 bg-white text-black rounded shadow-lg space-y-2 p-2
               invisible opacity-0 translate-y-1 transition ease-out duration-150
               group-hover:visible group-hover:opacity-100 group-hover:translate-y-0"
              >
                <li>
                  <a
                    routerLink="/shop"
                    class="block min-w-[10rem] px-4 py-2 hover:bg-primary hover:text-white rounded"
                    >Women Item 1</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/shop"
                    class="block min-w-[10rem] px-4 py-2 hover:bg-primary hover:text-white rounded"
                    >Women Item 2</a
                  >
                </li>
                <li>
                  <a
                    routerLink="/shop"
                    class="block min-w-[10rem] px-4 py-2 hover:bg-primary hover:text-white rounded"
                    >Women Item 3</a
                  >
                </li>
              </ul>
            </li>-->

            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block py-2"
                >Notebooks</a
              >
            </li>
            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block py-2"
                >PCs</a
              >
            </li>
            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block py-2"
                >Monitores</a
              >
            </li>
            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block py-2"
                >Periféricos</a
              >
            </li>
            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block py-2"
                >Gaming</a
              >
            </li>
          </ul>
        </nav>

        <!-- Right section: Buttons (for desktop) -->
        <div class="hidden lg:flex items-center space-x-4 relative">
          @if(!vm.user){
          <a
            routerLink="/register"
            class="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block"
            >Ingresar</a
          >
          }@else {
          <button
            routerLink="/account"
            class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 min-w-[140px]"
          >
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
                [attr.aria-label]="'Productos en carrito: ' + count"
              >
                {{ count }}
              </span>
              } }
            </a>

            <span
              class="absolute right-0 top-full w-8 h-2 bg-transparent"
              aria-hidden="true"
            ></span>

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

          <a
            id="search-icon"
            href="javascript:void(0);"
            class="text-white hover:text-secondary group"
          >
            <img
              src="assets/images/search-icon.svg"
              alt="Search"
              class="h-6 w-6 transition-transform transform group-hover:scale-120"
            />
          </a>
          <!-- Search field -->
          <div
            id="search-field"
            class="hidden absolute top-full right-0 mt-2 w-full bg-white shadow-lg p-2 rounded"
          >
            <input
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              placeholder="Search for products..."
            />
          </div>
          }
        </div>
      </div>
    </header>

    <!-- Mobile menu -->
    <nav
      id="mobile-menu-placeholder"
      class="mobile-menu hidden flex flex-col items-center space-y-8 lg:hidden"
    >
      <ul class="w-full">
        <!--<li>
          <a routerLink="/" class="hover:text-secondary font-bold block py-2"
            >Home</a
          >
        </li>-->

        <!-- Men Dropdown
        <li class="relative group" x-data="{ open: false }">
          <a
            (click)="openMen = !openMen; $event.preventDefault()"
            class="hover:text-secondary font-bold block py-2 flex justify-center items-center cursor-pointer"
          >
            <span>Men</span>
            <span (click)="openMen = !openMen">
              <i
                [ngClass]="
                  openMen
                    ? 'fas fa-chevron-up text-xs ml-2'
                    : 'fas fa-chevron-down text-xs ml-2'
                "
              ></i>
            </span>
          </a>
          <ul
            class="mobile-dropdown-menu"
            x-show="open"
            x-transition
            class="space-y-2"
          >
            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block pt-2 pb-3"
                >Shop Men</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-bold block py-2"
                >Men item 1</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-bold block py-2"
                >Men item 2</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-bold block py-2"
                >Men item 3</a
              >
            </li>
          </ul>
        </li>-->

        <!-- Women Dropdown
        <li class="relative group" x-data="{ open: false }">
          <a
            (click)="openWomen = !openWomen; $event.preventDefault()"
            class="hover:text-secondary font-bold block py-2 flex justify-center items-center cursor-pointer"
          >
            <span>Women</span>
            <span (click)="openWomen = !openWomen">
              <i
                [ngClass]="
                  openWomen
                    ? 'fas fa-chevron-up text-xs ml-2'
                    : 'fas fa-chevron-down text-xs ml-2'
                "
              ></i>
            </span>
          </a>
          <ul
            class="mobile-dropdown-menu"
            x-show="open"
            x-transition
            class="pl-4 space-y-2"
          >
            <li>
              <a
                routerLink="/shop"
                class="hover:text-secondary font-bold block py-2"
                >Shop Women</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-bold block py-2"
                >Women item 1</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-bold block py-2"
                >Women item 2</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-bold block py-2"
                >Women item 3</a
              >
            </li>
          </ul>
        </li> -->

        <li>
          <a
            routerLink="/shop"
            class="hover:text-secondary font-bold block py-2"
            >Notebooks</a
          >
        </li>
        <li>
          <a
            routerLink="/shop"
            class="hover:text-secondary font-bold block py-2"
            >PCs</a
          >
        </li>
        <li>
          <a
            routerLink="/shop"
            class="hover:text-secondary font-bold block py-2"
            >Monitores</a
          >
        </li>
        <li>
          <a
            routerLink="/shop"
            class="hover:text-secondary font-bold block py-2"
            >Periféricos</a
          >
        </li>
        <li>
          <a
            routerLink="/shop"
            class="hover:text-secondary font-bold block py-2"
            >Gaming</a
          >
        </li>
      </ul>
      <div class="flex flex-col mt-6 space-y-2 items-center">
        @if(!vm.user){
        <a
          routerLink="/register"
          class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]"
          >Ingresar</a
        >
        }@else {
        <button
          routerLink="/account"
          class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-flex items-center gap-2 min-w-[140px]"
        >
          <mat-icon fontIcon="person"></mat-icon>
          <span>{{ vm.user.perfil?.nombre || vm.user.role.nombre }}</span>
        </button>
        }
        <a
          routerLink="/register"
          class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]"
          >Cart -&nbsp;<span>5</span>&nbsp;items</a
        >
      </div>
      <!-- Search field -->
      <div
        class="  top-full right-0 mt-2 w-full bg-white shadow-lg p-2 rounded"
      >
        <input
          type="text"
          class="w-full p-2 border border-gray-300 rounded"
          placeholder="Search for products..."
        />
      </div>
    </nav>
    }
  `,
})
export class HeaderComponent {
  protected openMen: boolean = false;
  protected openWomen: boolean = false;
  protected rolTypes = RolType;

  protected readonly store = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalStore } from '../../global-store';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
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
            <li>
              <a routerLink="/" class="hover:text-secondary font-semibold"
                >Home</a
              >
            </li>

            <!-- Men -->
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

            <!-- Women -->
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
            </li>

            <li>
              <a routerLink="/shop" class="hover:text-secondary font-semibold"
                >Shop</a
              >
            </li>
            <li>
              <a
                routerLink="/product"
                class="hover:text-secondary font-semibold"
                >Product</a
              >
            </li>
            <li>
              <a routerLink="/404" class="hover:text-secondary font-semibold"
                >404 page</a
              >
            </li>
            <li>
              <a
                routerLink="/checkout"
                class="hover:text-secondary font-semibold"
                >Checkout</a
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
            >Register</a
          >
          <a
            routerLink="/register"
            class="bg-primary border border-primary hover:bg-transparent text-white hover:text-primary font-semibold px-4 py-2 rounded-full inline-block"
            >Login</a
          >
          }@else {
          <a
            (click)="store.logout()"
            class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]"
            >Logout</a
          >
          }
          <div class="relative group cart-wrapper">
            <a routerLink="/cart">
              <img
                src="assets/images/cart-shopping.svg"
                alt="Cart"
                class="h-6 w-6 group-hover:scale-120"
              />
            </a>
            <!-- Cart dropdown -->
            <div
              class="absolute right-0 mt-1 w-80 bg-white shadow-lg p-4 rounded hidden group-hover:block"
            >
              <div class="space-y-4">
                <!-- product item -->
                <div
                  class="flex items-center justify-between pb-4 border-b border-gray-line"
                >
                  <div class="flex items-center">
                    <img
                      src="/assets/images/single-product/1.jpg"
                      alt="Product"
                      class="h-12 w-12 object-cover rounded mr-2"
                    />
                    <div>
                      <p class="font-semibold">Summer black dress</p>
                      <p class="text-sm">Quantity: 1</p>
                    </div>
                  </div>
                  <p class="font-semibold">$25.00</p>
                </div>
                <!-- product item -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <img
                      src="/assets/images/single-product/2.jpg"
                      alt="Product"
                      class="h-12 w-12 object-cover rounded mr-2"
                    />
                    <div>
                      <p class="font-semibold">Black suit</p>
                      <p class="text-sm">Quantity: 1</p>
                    </div>
                  </div>
                  <p class="font-semibold">$125.00</p>
                </div>
              </div>
              <a
                routerLink="/cart"
                class="block text-center mt-4 border border-primary bg-primary hover:bg-transparent text-white hover:text-primary py-2 rounded-full font-semibold"
                >Go to Cart</a
              >
            </div>
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
        </div>
      </div>
    </header>

    <!-- Mobile menu -->
    <nav
      id="mobile-menu-placeholder"
      class="mobile-menu hidden flex flex-col items-center space-y-8 lg:hidden"
    >
      <ul class="w-full">
        <li>
          <a routerLink="/" class="hover:text-secondary font-bold block py-2"
            >Home</a
          >
        </li>

        <!-- Men Dropdown -->
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
        </li>

        <!-- Women Dropdown -->
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
        </li>

        <li>
          <a
            routerLink="/shop"
            class="hover:text-secondary font-bold block py-2"
            >Shop</a
          >
        </li>
        <li>
          <a
            routerLink="/product"
            class="hover:text-secondary font-bold block py-2"
            >Product</a
          >
        </li>
        <li>
          <a routerLink="/**" class="hover:text-secondary font-bold block py-2"
            >404 page</a
          >
        </li>
        <li>
          <a
            routerLink="/checkout"
            class="hover:text-secondary font-bold block py-2"
            >Checkout</a
          >
        </li>
      </ul>
      <div class="flex flex-col mt-6 space-y-2 items-center">
        @if(!vm.user){
        <a
          routerLink="/register"
          class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]"
          >Register</a
        >
        <a
          routerLink="/register"
          class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]"
          >Login</a
        >
        }@else {
        <a
          (click)="store.logout()"
          class="bg-primary hover:bg-transparent text-white hover:text-primary border border-primary font-semibold px-4 py-2 rounded-full inline-block flex items-center justify-center min-w-[110px]"
          >Logout</a
        >
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

  protected readonly store = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;
}

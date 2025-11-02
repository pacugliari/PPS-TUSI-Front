import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { GlobalStore } from '../../global-store';
import { RolType } from '../../shared/models/rol.model';

import { AddressesComponent } from './addresses/addresses.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { PedidosComponent } from './purchases/purchases.component';
import { CardsComponent } from './cards/cards.component';
import { CouponsComponent } from './ coupons/ coupons.component';
import { ZonesComponent } from './zones/zones.component';
import { BanksComponent } from './banks/banks.component';
import { BankPromosComponent } from './bank-promos/bank-promos.component';
import { BrandsComponent } from './brands/brands.component';
import { CategoriesComponent } from './categories/categories.component';
import { FeaturesComponent } from './features/features.component';
import { SubCategoriesComponent } from './subcategories/subcategories.component';
import { ProductsComponent } from './products/products.component';
import { ActivatedRoute } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';

type MenuKey =
  | 'datos'
  | 'compras'
  | 'favoritos'
  | 'direcciones'
  | 'tarjetas'
  | 'cupones'
  | 'zonas'
  | 'bancos'
  | 'bancos_promociones'
  | 'marcas'
  | 'categorias'
  | 'caracteristicas'
  | 'subcategorias'
  | 'productos'
  | 'pedidos';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    NgClass,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    AddressesComponent,
    FavoritesComponent,
    ProfileComponent,
    PedidosComponent,
    CardsComponent,
    CouponsComponent,
    ZonesComponent,
    BanksComponent,
    BankPromosComponent,
    BrandsComponent,
    CategoriesComponent,
    FeaturesComponent,
    SubCategoriesComponent,
    ProductsComponent,
    OrdersComponent,
  ],
  template: `
    @if (vm$ | async; as vm) {
    <div class="grid grid-cols-12 gap-6 p-3">
      <!-- SIDEBAR -->
      <aside class="col-span-12 md:col-span-3">
        <nav
          class="rounded-md border border-slate-200 overflow-hidden bg-white"
        >
          <mat-nav-list>
            @switch (vm.user?.role?.tipo) { @case (rolTypes.OPERARIO) { } @case
            (rolTypes.USUARIO) {
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'datos'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('datos')"
            >
              <mat-icon matListItemIcon class="mr-3">person</mat-icon>
              <div matListItemTitle>Mis datos</div>
            </a>

            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'compras'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('compras')"
            >
              <mat-icon matListItemIcon class="mr-3">receipt_long</mat-icon>
              <div matListItemTitle>Mis compras</div>
            </a>

            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'favoritos'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('favoritos')"
            >
              <mat-icon matListItemIcon class="mr-3">favorite</mat-icon>
              <div matListItemTitle>Favoritos</div>
            </a>

            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'direcciones'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('direcciones')"
            >
              <mat-icon matListItemIcon class="mr-3">place</mat-icon>
              <div matListItemTitle>Mis direcciones</div>
            </a>

            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'tarjetas'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('tarjetas')"
            >
              <mat-icon matListItemIcon class="mr-3">credit_card</mat-icon>
              <div matListItemTitle>Tarjetas</div>
            </a>
            } @case (rolTypes.ADMINISTRADOR) {
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'cupones'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('cupones')"
            >
              <mat-icon matListItemIcon class="mr-3">local_offer</mat-icon>
              <div matListItemTitle>Cupones</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'zonas'
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-blue-50'
              "
              (click)="setActive('zonas')"
            >
              <mat-icon matListItemIcon class="mr-3">map</mat-icon>
              <div matListItemTitle>Zonas</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'bancos'
                  ? 'bg-indigo-50 text-indigo-900'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('bancos')"
            >
              <mat-icon matListItemIcon class="mr-3">account_balance</mat-icon>
              <div matListItemTitle>Bancos</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'bancos_promociones'
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('bancos_promociones')"
            >
              <mat-icon matListItemIcon class="mr-3">credit_card</mat-icon>
              <div matListItemTitle>Promos bancarias</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'marcas'
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('marcas')"
            >
              <mat-icon matListItemIcon class="mr-3">inventory_2</mat-icon>
              <div matListItemTitle>Marcas</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'categorias'
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('categorias')"
            >
              <mat-icon matListItemIcon class="mr-3">category</mat-icon>
              <div matListItemTitle>Categorías</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'caracteristicas'
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('caracteristicas')"
            >
              <mat-icon matListItemIcon class="mr-3">tune</mat-icon>
              <div matListItemTitle>Características</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'subcategorias'
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('subcategorias')"
            >
              <mat-icon matListItemIcon class="mr-3">subtitles</mat-icon>
              <div matListItemTitle>Subcategorías</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'productos'
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-50'
              "
              (click)="setActive('productos')"
            >
              <mat-icon matListItemIcon class="mr-3">inventory_2</mat-icon>
              <div matListItemTitle>Productos</div>
            </a>
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'pedidos'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('pedidos')"
            >
              <mat-icon matListItemIcon class="mr-3">receipt_long</mat-icon>
              <div matListItemTitle>Pedidos</div>
            </a>

            } @case (rolTypes.DELIVERY){
            <a
              mat-list-item
              class="!py-3"
              [ngClass]="
                active() === 'pedidos'
                  ? 'bg-green-500 text-white'
                  : 'hover:bg-green-50'
              "
              (click)="setActive('pedidos')"
            >
              <mat-icon matListItemIcon class="mr-3">receipt_long</mat-icon>
              <div matListItemTitle>Pedidos</div>
            </a>
            } }

            <a
              mat-list-item
              class="!py-3 text-red-600 hover:bg-red-50 cursor-pointer"
              (click)="store.logout()"
            >
              <mat-icon matListItemIcon class="mr-3">logout</mat-icon>
              <div matListItemTitle>Cerrar sesión</div>
            </a>
          </mat-nav-list>
        </nav>
      </aside>

      <!-- CONTENT -->
      <section class="col-span-12 md:col-span-9">
        <div class="rounded-md border border-slate-200 bg-white">
          @switch (active()) { @case ('datos') {
          <app-profile />
          } @case ('compras') {
          <app-purchases />
          } @case ('favoritos') {
          <app-favorites />
          } @case ('direcciones') {
          <app-addresses />
          } @case ('tarjetas') {
          <app-cards />
          } @case ('cupones') {
          <app-coupons />
          } @case ('zonas') {
          <app-zones />
          }@case ('bancos') {
          <app-banks />
          }@case ('bancos_promociones') {
          <app-bank-promos />
          }@case ('marcas') {
          <app-brands />
          }@case ('categorias') {
          <app-categories />
          }@case ('caracteristicas') {
          <app-features />
          }@case ('subcategorias') {
          <app-subcategories />
          }@case ('productos') {
          <app-products />
          }@case ('pedidos') {
          <app-orders />
          } @default {
          <div class="p-6 text-slate-600">Seleccioná una opción</div>
          } }
        </div>
      </section>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  protected rolTypes = RolType;
  protected readonly store = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;
  protected readonly route = inject(ActivatedRoute);

  active = signal<MenuKey | null>(null);

  constructor() {
    effect(() => {
      const tab = this.route.snapshot.queryParamMap.get('tab');
      if (
        tab &&
        ['compras', 'datos', 'favoritos', 'direcciones', 'tarjetas'].includes(
          tab
        )
      ) {
        this.active.set(tab as MenuKey);
      }
    });
  }

  setActive(k: MenuKey) {
    this.active.set(k);
  }
}

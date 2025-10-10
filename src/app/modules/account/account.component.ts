import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { GlobalStore } from '../../global-store';
import { RolType } from '../../shared/rol.model';
import { AddressesComponent } from './addresses/addresses.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { PedidosComponent } from "./purchases/purchases.component";

type MenuKey = 'datos' | 'compras' | 'favoritos' | 'direcciones';

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
    PedidosComponent
],
  template: `
    @if (vm$ | async) {
    <div class="grid grid-cols-12 gap-6 p-3">
      <!-- SIDEBAR -->
      <aside class="col-span-12 md:col-span-3">
        <nav class="rounded-md border border-slate-200 overflow-hidden bg-white">
          <mat-nav-list>
            <a mat-list-item class="!py-3"
               [ngClass]="active() === 'datos' ? 'bg-green-500 text-white' : 'hover:bg-green-50'"
               (click)="setActive('datos')">
              <mat-icon matListItemIcon class="mr-3">person</mat-icon>
              <div matListItemTitle>Mis datos</div>
            </a>

            <a mat-list-item class="!py-3"
               [ngClass]="active() === 'compras' ? 'bg-green-500 text-white' : 'hover:bg-green-50'"
               (click)="setActive('compras')">
              <mat-icon matListItemIcon class="mr-3">receipt_long</mat-icon>
              <div matListItemTitle>Mis compras</div>
            </a>

            <a mat-list-item class="!py-3"
               [ngClass]="active() === 'favoritos' ? 'bg-green-500 text-white' : 'hover:bg-green-50'"
               (click)="setActive('favoritos')">
              <mat-icon matListItemIcon class="mr-3">favorite</mat-icon>
              <div matListItemTitle>Favoritos</div>
            </a>

            <a mat-list-item class="!py-3"
               [ngClass]="active() === 'direcciones' ? 'bg-green-500 text-white' : 'hover:bg-green-50'"
               (click)="setActive('direcciones')">
              <mat-icon matListItemIcon class="mr-3">place</mat-icon>
              <div matListItemTitle>Mis direcciones</div>
            </a>

            <a mat-list-item class="!py-3 text-red-600 hover:bg-red-50 cursor-pointer"
               (click)="store.logout()">
              <mat-icon matListItemIcon class="mr-3">logout</mat-icon>
              <div matListItemTitle>Cerrar sesión</div>
            </a>
          </mat-nav-list>
        </nav>
      </aside>

      <!-- CONTENT -->
      <section class="col-span-12 md:col-span-9">
        <div class="rounded-md border border-slate-200 bg-white">
          @switch (active()) {
            @case ('datos') {
              <app-profile />
            }
            @case ('compras') {
              <app-purchases />
            }
            @case ('favoritos') {
              <app-favorites />
            }
            @case ('direcciones') {
              <app-addresses />
            }
            @default {
              <div class="p-6 text-slate-600">Seleccioná una opción</div>
            }
          }
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

  active = signal<MenuKey>('datos');

  setActive(k: MenuKey) {
    this.active.set(k);
  }
}

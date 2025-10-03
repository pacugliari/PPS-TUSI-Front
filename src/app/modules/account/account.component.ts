import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalStore } from '../../global-store';
import { RolType } from '../../shared/rol.model';
import { Producto } from '../../shared/api/producto.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { catchError, map, of, switchMap } from 'rxjs';
import { SharedApiService } from '../../shared/api/api.service';

type MenuKey = 'datos' | 'compras' | 'favoritos' | 'direcciones';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
    <div class="grid grid-cols-12 gap-6 p-3">
      <!-- SIDEBAR -->
      <aside class="col-span-12 md:col-span-3">
        <nav
          class="rounded-md border border-slate-200 overflow-hidden bg-white"
        >
          <mat-nav-list>
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
          <header class="text-center py-4">
            <h2 class="text-xl font-semibold text-indigo-900">
              {{ active() === 'favoritos' ? 'Favoritos' : 'Datos Personales' }}
            </h2>
          </header>
          <mat-divider></mat-divider>

          <!-- DATOS -->
          <div class="p-5" *ngIf="active() === 'datos'">
            <!-- (form) igual que lo tenías -->
            <!-- ... -->
          </div>

          <!-- COMPRAS -->
          <div class="p-6 text-slate-600" *ngIf="active() === 'compras'">
            No hay compras para mostrar.
          </div>

          <!-- FAVORITOS -->
          <div class="p-4 md:p-6" *ngIf="active() === 'favoritos'">
            @if (favoriteProducts$ | async; as favs) { @if (favs.length === 0) {
            <div class="text-slate-600">Todavía no agregaste favoritos.</div>
            } @else {
            <!-- Lista -->
            <div class="space-y-4">
              @for (p of favs; track p.idProducto) {
              <div
                class="rounded-lg border border-slate-200 bg-white p-3 md:p-4"
              >
                <div class="flex items-center gap-3 md:gap-4">
                  <!-- Eliminar -->
                  <button
                    class="text-red-600 hover:text-red-700 p-2"
                    (click)="removeFav(p.idProducto)"
                    aria-label="Quitar de favoritos"
                    title="Quitar de favoritos"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>

                  <!-- Imagen -->
                  <img
                    [src]="p.fotos[0] || '/assets/images/placeholder.png'"
                    [alt]="p.nombre"
                    class="w-16 h-16 md:w-20 md:h-20 rounded object-cover ring-1 ring-slate-200 bg-slate-50"
                  />

                  <!-- Nombre -->
                  <div class="flex-1 min-w-0">
                    <div class="text-sm md:text-base font-medium line-clamp-2">
                      {{ p.nombre }}
                    </div>
                  </div>

                  <!-- Precio -->
                  <div class="text-right">
                    <div class="text-red-600 font-semibold">
                      {{
                        p.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2'
                      }}
                    </div>
                    <button
                      mat-stroked-button
                      color="primary"
                      class="!mt-2"
                      (click)="addToCart(p)"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
              }
            </div>

            <!-- Acciones globales -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                mat-stroked-button
                color="primary"
                (click)="addAllToCart(favs)"
              >
                Agregar todos al carrito
              </button>
            </div>
            } }
          </div>

          <!-- DIRECCIONES -->
          <div class="p-6 text-slate-600" *ngIf="active() === 'direcciones'">
            Sin direcciones cargadas.
          </div>
        </div>
      </section>
    </div>
    }
  `,
})
export class AccountComponent {
  protected rolTypes = RolType;
  protected readonly store = inject(GlobalStore);
  protected readonly vm$ = this.store.vm$;

  private fb = inject(FormBuilder);
  private api = inject(SharedApiService);

  active = signal<MenuKey>('datos');

  form: FormGroup = this.fb.group({
    nroCliente: ['54511'],
    nombre: ['Cugliari, Pablo', [Validators.required]],
    email: ['pacugliari@hotmail.com', [Validators.required, Validators.email]],
    telefono: ['011 3123-5232', [Validators.required]],
    tipoDoc: ['DNI', Validators.required],
    dni: ['11223344', Validators.required],
  });

  //REFACTOR
  readonly favoriteProducts$ = this.store.favorites$.pipe(
    switchMap((ids) => {
      if (!ids?.length) return of<Producto[]>([]);

      const idSet = new Set(ids);
      const order = new Map<number, number>();
      ids.forEach((id, i) => order.set(id, i));

      return this.api.getProducts().pipe(
        map((res) => (res?.payload ?? []) as Producto[]),
        map((all) => all.filter((p) => idSet.has(p.idProducto))),
        map((list) =>
          [...list].sort(
            (a, b) =>
              (order.get(a.idProducto) ?? 0) - (order.get(b.idProducto) ?? 0)
          )
        ),
        catchError(() => of<Producto[]>([]))
      );
    })
  );

  setActive(k: MenuKey) {
    this.active.set(k);
  }

  onSubmit() {
    //TODO
    if (this.form.invalid) return;
    console.log('payload', this.form.getRawValue());
  }

  removeFav(id: number) {
    this.store.removeFavorite(id);
  }
  addToCart(p: Producto) {
    this.store.addToCart({ producto: p, cantidad: 1 });
  }
  addAllToCart(list: Producto[]) {
    list.forEach((p) => this.store.addToCart({ producto: p, cantidad: 1 }));
  }
}

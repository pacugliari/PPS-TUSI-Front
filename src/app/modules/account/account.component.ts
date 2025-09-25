import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { GlobalStore } from '../../global-store';
import { RolType } from '../../shared/rol.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

type MenuKey = 'datos' | 'compras' | 'favoritos' | 'direcciones';

@Component({
  selector: 'app-account',
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
  template: `
    @if(vm$ | async; as vm){
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
              Datos Personales
            </h2>
          </header>
          <mat-divider></mat-divider>

          <div class="p-5" *ngIf="active() === 'datos'">
            <form
              [formGroup]="form"
              (ngSubmit)="onSubmit()"
              class="grid grid-cols-12 gap-4"
            >
              <!-- Numero de cliente -->
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-4"
              >
                <mat-label>Número de Cliente</mat-label>
                <input matInput formControlName="nroCliente" readonly />
              </mat-form-field>

              <!-- Apellido y Nombre -->
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-8"
              >
                <mat-label>Apellido y Nombre</mat-label>
                <input matInput formControlName="nombre" required />
              </mat-form-field>

              <!-- Email -->
              <mat-form-field appearance="outline" class="col-span-12">
                <mat-label>Correo electrónico</mat-label>
                <input matInput type="email" formControlName="email" required />
                <mat-error *ngIf="form.get('email')?.hasError('email')"
                  >Formato inválido</mat-error
                >
              </mat-form-field>

              <!-- Teléfono -->
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-4"
              >
                <mat-label>Número Telefónico</mat-label>
                <input matInput formControlName="telefono" required />
              </mat-form-field>

              <!-- Tipo doc -->
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-4"
              >
                <mat-label>Tipo de documento</mat-label>
                <mat-select formControlName="tipoDoc" required>
                  <mat-option value="DNI">DNI</mat-option>
                  <mat-option value="CUIT">CUIT</mat-option>
                  <mat-option value="LE">LE</mat-option>
                  <mat-option value="LC">LC</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- DNI -->
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-4"
              >
                <mat-label>DNI</mat-label>
                <input matInput formControlName="dni" required />
              </mat-form-field>

              <!--
              Divider Datos de facturación
              <div class="col-span-12">
                <span
                  class="inline-block px-2 py-1 bg-indigo-50 text-indigo-900 font-semibold rounded"
                >
                  Datos de Facturación
                </span>
              </div>

              Clase Fiscal
              <mat-form-field appearance="outline" class="col-span-12">
                <mat-label>Clase Fiscal</mat-label>
                <mat-select formControlName="claseFiscal" required>
                  <mat-option value="Consumidor Final"
                    >Consumidor Final</mat-option
                  >
                  <mat-option value="Responsable Inscripto"
                    >Responsable Inscripto</mat-option
                  >
                  <mat-option value="Monotributista">Monotributista</mat-option>
                </mat-select>
              </mat-form-field>

              Provincia
              <mat-form-field appearance="outline" class="col-span-12">
                <mat-label>Provincia</mat-label>
                <input matInput formControlName="provincia" />
              </mat-form-field>

              Dirección
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-8"
              >
                <mat-label>Dirección</mat-label>
                <input matInput formControlName="direccion" required />
              </mat-form-field>

              CP
              <mat-form-field
                appearance="outline"
                class="col-span-12 md:col-span-4"
              >
                <mat-label>CP</mat-label>
                <input matInput formControlName="cp" required />
              </mat-form-field>

              Localidad
              <mat-form-field appearance="outline" class="col-span-12">
                <mat-label>Localidad</mat-label>
                <input matInput formControlName="localidad" required />
              </mat-form-field>-->

              <!-- Submit -->
              <div class="col-span-12">
                <button
                  mat-raised-button
                  color="primary"
                  class="w-full !bg-indigo-900 hover:!bg-indigo-800"
                  [disabled]="form.invalid"
                >
                  Actualizar Datos
                </button>
              </div>
            </form>
          </div>

          <!-- Otras secciones simples -->
          <div class="p-6 text-slate-600" *ngIf="active() === 'compras'">
            No hay compras para mostrar.
          </div>
          <div class="p-6 text-slate-600" *ngIf="active() === 'favoritos'">
            Todavía no agregaste favoritos.
          </div>
          <div class="p-6 text-slate-600" *ngIf="active() === 'direcciones'">
            Sin direcciones cargadas.
          </div>
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

  private fb = inject(FormBuilder);

  active = signal<MenuKey>('datos');

  form: FormGroup = this.fb.group({
    nroCliente: ['54511'],
    nombre: ['Cugliari, Pablo', [Validators.required]],
    email: ['pacugliari@hotmail.com', [Validators.required, Validators.email]],
    telefono: ['011 3123-5232', [Validators.required]],
    tipoDoc: ['DNI', Validators.required],
    dni: ['11223344', Validators.required],
    //claseFiscal: ['Consumidor Final', Validators.required],
    //provincia: ['Buenos Aires'],
    //direccion: ['Triunvirato 4305', Validators.required],
    //cp: ['1879', Validators.required],
    //localidad: ['Quilmes Oeste', Validators.required],
  });

  setActive(k: MenuKey) {
    this.active.set(k);
  }

  onSubmit() {
    if (this.form.invalid) return;
    // acá harías tu submit al backend
    console.log('payload', this.form.getRawValue());
  }
}

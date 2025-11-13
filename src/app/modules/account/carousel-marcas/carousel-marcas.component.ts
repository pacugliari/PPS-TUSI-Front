import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { CarouselMarcasStore } from './carousel-marcas.store';

@Component({
  selector: 'app-carousel-marcas',
  standalone: true,
  providers: [CarouselMarcasStore],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    SpinnerComponent,
  ],
  template: `
    @if (store.vm$ | async; as vm) {
      @if (vm.isLoading) { <app-spinner /> }

      <section class="rounded-md border border-slate-200 bg-white">

        <!-- HEADER -->
        <header class="text-center py-4">
          <h2 class="text-xl font-semibold text-indigo-900">
            Carrusel de Marcas
          </h2>
        </header>

        <mat-divider></mat-divider>

        <!-- CONTENT -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <button
              mat-raised-button
              color="primary"
              (click)="store.openCreate()"
              class="!bg-indigo-900 hover:!bg-indigo-800"
            >
              <mat-icon class="mr-1">add</mat-icon>
              Agregar marca
            </button>
          </div>

          <div
            class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
          >
            <table
              mat-table
              [dataSource]="vm.marcas"
              class="w-full min-w-[650px]"
            >
              <!-- Logo -->
              <ng-container matColumnDef="logo">
                <th mat-header-cell *matHeaderCellDef>Logo</th>
                <td mat-cell *matCellDef="let m">
                  <img
                    [src]="m.logoUrl"
                    class="h-16 w-auto object-contain rounded border m-2"
                  />
                </td>
              </ng-container>

              <!-- Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let m">{{ m.nombre }}</td>
              </ng-container>

              <!-- Orden -->
              <ng-container matColumnDef="orden">
                <th mat-header-cell *matHeaderCellDef>Orden</th>
                <td mat-cell *matCellDef="let m">{{ m.orden }}</td>
              </ng-container>

              <!-- Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef class="text-right">
                  Acciones
                </th>
                <td mat-cell *matCellDef="let m" class="text-right">
                  <button
                    mat-icon-button
                    (click)="store.openEdit(m)"
                    aria-label="Editar"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button
                    mat-icon-button
                    color="warn"
                    (click)="store.remove(m.idCarruselMarcas)"
                    aria-label="Eliminar"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="cols"></tr>
              <tr mat-row *matRowDef="let row; columns: cols"></tr>
            </table>

            @if (vm.marcas.length === 0 && !vm.isLoading) {
              <div class="p-4 text-gray-600">
                No hay marcas cargadas.
              </div>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class CarouselMarcasComponent {
  readonly store = inject(CarouselMarcasStore);
  cols = ['logo', 'nombre', 'orden', 'acciones'];
}

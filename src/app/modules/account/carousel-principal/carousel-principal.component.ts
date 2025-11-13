import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { CarouselPrincipalStore } from './carousel-principal.store';

@Component({
  selector: 'app-carousel-principal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    SpinnerComponent,
  ],
  providers: [CarouselPrincipalStore],
  template: `
    @if (store.vm$ | async; as vm) {
      @if (vm.isLoading) { <app-spinner /> }

      <section class="rounded-md border border-slate-200 bg-white">
        <header class="text-center py-4">
          <h2 class="text-xl font-semibold text-indigo-900">
            Carrusel Principal
          </h2>
        </header>

        <mat-divider></mat-divider>

        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <button
              mat-raised-button
              color="primary"
              (click)="store.openCreate()"
              class="!bg-indigo-900 hover:!bg-indigo-800"
            >
              <mat-icon class="mr-1">add</mat-icon>
              Agregar slide
            </button>
          </div>

          <div
            class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
          >
            <table
              mat-table
              [dataSource]="vm.slides"
              class="w-full min-w-[900px]"
            >

              <!-- Imagen -->
              <ng-container matColumnDef="imagen">
                <th mat-header-cell *matHeaderCellDef>Imagen</th>
                <td mat-cell *matCellDef="let s">
                  <img
                    [src]="s.imagenUrl"
                    class="h-16 w-auto object-cover rounded border m-2"
                  />
                </td>
              </ng-container>

              <!-- Título -->
              <ng-container matColumnDef="titulo">
                <th mat-header-cell *matHeaderCellDef>Título</th>
                <td mat-cell *matCellDef="let s">{{ s.titulo }}</td>
              </ng-container>

              <!-- Descripción (truncada) -->
              <ng-container matColumnDef="descripcion">
                <th mat-header-cell *matHeaderCellDef>Descripción</th>
                <td mat-cell *matCellDef="let s">
                  <span class="line-clamp-1">
                    {{ s.descripcion }}
                  </span>
                </td>
              </ng-container>

              <!-- Link -->
              <ng-container matColumnDef="link">
                <th mat-header-cell *matHeaderCellDef>Link</th>
                <td mat-cell *matCellDef="let s">
                  <span class="text-blue-600">{{ s.link }}</span>
                </td>
              </ng-container>

              <!-- Orden -->
              <ng-container matColumnDef="orden">
                <th mat-header-cell *matHeaderCellDef>Orden</th>
                <td mat-cell *matCellDef="let s">{{ s.orden }}</td>
              </ng-container>

              <!-- Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef class="text-right">
                  Acciones
                </th>
                <td mat-cell *matCellDef="let s" class="text-right">
                  <button
                    mat-icon-button
                    (click)="store.openEdit(s)"
                    aria-label="Editar"
                  >
                    <mat-icon>edit</mat-icon>
                  </button>

                  <button
                    mat-icon-button
                    color="warn"
                    (click)="store.remove(s.idCarruselPrincipal)"
                    aria-label="Eliminar"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="cols"></tr>
              <tr mat-row *matRowDef="let row; columns: cols"></tr>
            </table>

            @if (vm.slides.length === 0 && !vm.isLoading) {
              <div class="p-4 text-gray-600">No hay slides cargados.</div>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class CarouselPrincipalComponent {
  readonly store = inject(CarouselPrincipalStore);

  cols = ['imagen', 'titulo', 'descripcion', 'link', 'orden', 'acciones'];
}

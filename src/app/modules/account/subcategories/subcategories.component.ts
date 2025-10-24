import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { SubCategoriesStore } from './subcategories.store';

@Component({
  selector: 'app-subcategories',
  standalone: true,
  providers: [SubCategoriesStore],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    SpinnerComponent,
  ],
  template: `
    @if (store.vm$ | async; as vm) { @if (vm.isLoading) { <app-spinner /> }

    <section class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Subcategorías</h2>
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
            <mat-icon class="mr-1">add</mat-icon> Agregar subcategoría
          </button>
        </div>

        <div
          class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
        >
          <table
            mat-table
            [dataSource]="vm.subcats"
            class="w-full min-w-[760px]"
          >
            <ng-container matColumnDef="categoria">
              <th mat-header-cell *matHeaderCellDef>Categoría</th>
              <td mat-cell *matCellDef="let s">
                {{ s.categoriaNombre || s.idCategoria }}
              </td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let s">{{ s.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let s">{{ s.descripcion }}</td>
            </ng-container>

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
                  (click)="store.remove(s.idSubCategoria)"
                  aria-label="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>

          @if (!vm.isLoading && vm.subcats.length === 0) {
          <div class="p-4 text-gray-600">No hay subcategorías cargadas.</div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class SubCategoriesComponent {
  protected readonly store = inject(SubCategoriesStore);
  cols = ['categoria', 'nombre', 'descripcion', 'acciones'];
}

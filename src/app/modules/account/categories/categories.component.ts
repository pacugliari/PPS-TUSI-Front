import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { CategoriesStore } from './categories.store';

@Component({
  selector: 'app-categories',
  standalone: true,
  providers: [CategoriesStore],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule, MatDividerModule, SpinnerComponent],
  template: `
    @if (store.vm$ | async; as vm) { @if (vm.isLoading) { <app-spinner/> }

    <section class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Categorías</h2>
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
            <mat-icon class="mr-1">add</mat-icon> Agregar categoría
          </button>
        </div>

        <div class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto">
          <table mat-table [dataSource]="vm.categories" class="w-full min-w-[680px]">
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let c">{{ c.nombre }}</td>
            </ng-container>

            <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef>Descripción</th>
              <td mat-cell *matCellDef="let c">{{ c.descripcion }}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
              <td mat-cell *matCellDef="let c" class="text-right">
                <button mat-icon-button (click)="store.openEdit(c)" aria-label="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="store.remove(c.idCategoria)" aria-label="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>

          @if (!vm.isLoading && vm.categories.length === 0) {
            <div class="p-4 text-gray-600">No hay categorías registradas.</div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class CategoriesComponent {
  protected readonly store = inject(CategoriesStore);
  cols = ['nombre', 'descripcion', 'acciones'];
}

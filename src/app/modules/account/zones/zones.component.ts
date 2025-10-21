import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { ZonesStore } from './zones.store';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-zones',
  standalone: true,
  providers: [ZonesStore],
  imports: [
    CommonModule,
    CurrencyPipe,
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
        <h2 class="text-xl font-semibold text-indigo-900">Zonas</h2>
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
            <mat-icon class="mr-1">add</mat-icon> Agregar zona
          </button>
        </div>

        <div
          class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
        >
          <table mat-table [dataSource]="vm.zones" class="w-full min-w-[800px]">
            <!-- Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let z">{{ z.nombre }}</td>
            </ng-container>

            <!-- Ciudad -->
            <ng-container matColumnDef="ciudad">
              <th mat-header-cell *matHeaderCellDef>Ciudad</th>
              <td mat-cell *matCellDef="let z">{{ z.ciudad }}</td>
            </ng-container>

            <!-- Provincia -->
            <ng-container matColumnDef="provincia">
              <th mat-header-cell *matHeaderCellDef>Provincia</th>
              <td mat-cell *matCellDef="let z">{{ z.provincia }}</td>
            </ng-container>

            <!-- Costo envío -->
            <ng-container matColumnDef="costoEnvio">
              <th mat-header-cell *matHeaderCellDef>Costo envío</th>
              <td mat-cell *matCellDef="let z">
                {{ z.costoEnvio | currency : 'ARS' : 'symbol' : '1.0-0' }}
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-right">
                Acciones
              </th>
              <td mat-cell *matCellDef="let z" class="text-right">
                <button
                  mat-icon-button
                  (click)="store.openEdit(z)"
                  aria-label="Editar"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="store.remove(z.idZona)"
                  aria-label="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>

          @if (vm.zones.length === 0 && !vm.isLoading) {
          <div class="p-4 text-gray-600">No hay zonas cargadas.</div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class ZonesComponent {
  protected readonly store = inject(ZonesStore);
  cols = ['nombre', 'ciudad', 'provincia', 'costoEnvio', 'acciones'];
}

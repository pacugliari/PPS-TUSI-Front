import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { BanksStore } from './banks.store';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-banks',
  standalone: true,
  providers: [BanksStore],
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
        <h2 class="text-xl font-semibold text-indigo-900">Bancos</h2>
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
            <mat-icon class="mr-1">add</mat-icon> Agregar banco
          </button>
        </div>

        <div
          class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
        >
          <table mat-table [dataSource]="vm.banks" class="w-full min-w-[560px]">
            <!-- Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let b">{{ b.nombre }}</td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-right">
                Acciones
              </th>
              <td mat-cell *matCellDef="let b" class="text-right">
                <button
                  mat-icon-button
                  (click)="store.openEdit(b)"
                  aria-label="Editar"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="store.remove(b.idBanco)"
                  aria-label="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>

          @if (vm.banks.length === 0 && !vm.isLoading) {
          <div class="p-4 text-gray-600">No hay bancos cargados.</div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class BanksComponent {
  protected readonly store = inject(BanksStore);
  cols = ['nombre', 'acciones'];
}

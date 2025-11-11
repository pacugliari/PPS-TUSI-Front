import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReturnsStore } from './returns-user.store';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-returns-user',
  standalone: true,
  providers: [ReturnsStore],
  imports: [
    CommonModule,
    MatTableModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    SpinnerComponent,
  ],
  template: `
    @if (vm$ | async; as vm) {
    <!-- Spinner de carga -->
    @if (vm.isLoading) {
    <app-spinner />
    }

    <!-- Contenedor principal -->
    <div class="rounded-md border border-slate-200 bg-white">
      <!-- Encabezado -->
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Mis devoluciones</h2>
      </header>

      <div class="space-y-2 px-4 mb-2">
        <div
          class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md text-sm"
        >
          <strong>Importante:</strong> Si tu devolución es <b>aprobada</b>,
          deberás concurrir a la sucursal con el producto. El reintegro se
          realiza siempre en <b>efectivo</b>, sin importar el método de pago
          original.
        </div>

        <div
          class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm"
        >
          <strong>Atención:</strong> Si tu devolución es <b>rechazada</b>, por
          favor comunicate con nuestro equipo de atención al cliente para
          recibir más información sobre el motivo del rechazo.
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Contenido -->
      <div class="p-6">
        <!-- Tabla de devoluciones -->
        @if (vm.devoluciones.length > 0) {
        <table mat-table [dataSource]="vm.devoluciones" class="w-full">
          <!-- Columna: Producto -->
          <ng-container matColumnDef="producto">
            <th mat-header-cell *matHeaderCellDef>Producto</th>
            <td mat-cell *matCellDef="let r">{{ r.producto }}</td>
          </ng-container>

          <!-- Columna: Motivo -->
          <ng-container matColumnDef="motivo">
            <th mat-header-cell *matHeaderCellDef>Motivo</th>
            <td mat-cell *matCellDef="let r">{{ r.motivo }}</td>
          </ng-container>

          <!-- Columna: Comentario -->
          <ng-container matColumnDef="comentario">
            <th mat-header-cell *matHeaderCellDef>Comentario</th>
            <td mat-cell *matCellDef="let r">
              <span
                [ngClass]="{
                  'text-slate-500 italic': !r.comentario
                }"
              >
                {{ r.comentario || 'Sin comentarios' }}
              </span>
            </td>
          </ng-container>

          <!-- Columna: Estado -->
          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let r">
              <span
                [ngClass]="{
                  'text-yellow-600': r.estado === 'revision',
                  'text-green-600': r.estado === 'aprobado',
                  'text-red-600': r.estado === 'rechazado',
                  'text-blue-600': r.estado === 'devuelto'
                }"
                class="font-medium"
              >
                {{ r.estado | titlecase }}
              </span>
            </td>
          </ng-container>

          <!-- Columna: Fecha -->
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef>Fecha</th>
            <td mat-cell *matCellDef="let r">{{ r.fecha | date : 'short' }}</td>
          </ng-container>

          <!-- Renderizado de filas -->
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols"></tr>
        </table>
        } @else {
        <!-- Mensaje vacío -->
        <div class="text-center text-slate-600 mt-6">
          No hay devoluciones registradas.
        </div>
        }
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnsComponent {
  readonly store = inject(ReturnsStore);
  readonly vm$ = this.store.vm$;

  readonly cols = ['producto', 'motivo', 'comentario', 'estado', 'fecha'];

  ngOnInit() {
    this.store.loadDevoluciones();
  }
}

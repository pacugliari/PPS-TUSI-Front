import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReturnsAdminStore } from './returns-admin.store';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-returns-admin',
  standalone: true,
  providers: [ReturnsAdminStore],
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

    <div class="rounded-md border border-slate-200 bg-white">
      <!-- Encabezado -->
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">
          Gestión de devoluciones
        </h2>
      </header>
      <mat-divider></mat-divider>

      <!-- Contenido -->
      <div class="p-6">
        @if (vm.devoluciones.length > 0) {
        <table mat-table [dataSource]="vm.devoluciones" class="w-full">
          <!-- Columna: Usuario -->
          <ng-container matColumnDef="usuario">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let r">{{ r.usuario || '—' }}</td>
          </ng-container>

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

          <!-- Columna: Acciones -->
          <ng-container matColumnDef="acciones">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let r" class="space-x-2">
              <button
                mat-stroked-button
                color="primary"
                (click)="store.aprobar(r.idDevolucion)"
                [hidden]="vm.isLoading || r.estado !== 'revision'"
              >
                Aprobar
              </button>

              <button
                mat-stroked-button
                color="warn"
                (click)="store.rechazar(r.idDevolucion)"
                [hidden]="vm.isLoading || r.estado !== 'revision'"
              >
                Rechazar
              </button>

              <button
                mat-stroked-button
                color="accent"
                (click)="store.confirmar(r.idDevolucion)"
                [hidden]="vm.isLoading || r.estado !== 'aprobado'"
              >
                Confirmar devolución
              </button>
            </td>
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
export class ReturnsAdminComponent {
  readonly store = inject(ReturnsAdminStore);
  readonly vm$ = this.store.vm$;

  readonly cols = [
    'usuario',
    'producto',
    'motivo',
    'comentario',
    'estado',
    'acciones',
  ];

  ngOnInit() {
    this.store.loadDevoluciones();
  }
}

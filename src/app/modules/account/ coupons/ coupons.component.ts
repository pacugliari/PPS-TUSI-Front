import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { CouponsStore } from './coupons.store';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { Coupon } from './coupons.model';
import { parseDateOnly } from './coupons.util';

@Component({
  selector: 'app-coupons',
  standalone: true,
  providers: [CouponsStore],
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
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
        <h2 class="text-xl font-semibold text-indigo-900">Cupones</h2>
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
            <mat-icon class="mr-1">add</mat-icon> Agregar cupón
          </button>
        </div>

        <div
          class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
        >
          <table
            mat-table
            [dataSource]="vm.coupons"
            class="w-full min-w-[880px]"
          >
            <!-- Código -->
            <ng-container matColumnDef="codigo">
              <th mat-header-cell *matHeaderCellDef>Código</th>
              <td mat-cell *matCellDef="let c">{{ c.codigo }}</td>
            </ng-container>

            <!-- Usuario -->
            <ng-container matColumnDef="usuario">
              <th mat-header-cell *matHeaderCellDef>Usuario</th>
              <td mat-cell *matCellDef="let c">
                <div class="leading-tight">
                  <div class="font-medium">
                    {{
                      c.usuario?.perfil?.nombre ||
                        c.usuario?.email ||
                        'Usuario ' + c.idUsuario
                    }}
                  </div>
                  @if (c.usuario?.email) {
                  <div class="text-xs text-gray-600">{{ c.usuario.email }}</div>
                  }
                </div>
              </td>
            </ng-container>

            <!-- porcentaje -->
            <ng-container matColumnDef="porcentaje">
              <th mat-header-cell *matHeaderCellDef>Porcentaje</th>
              <td mat-cell *matCellDef="let c">
                {{ c.porcentaje | number : '1.0-2' }}%
              </td>
            </ng-container>

            <!-- Vigencia -->
            <ng-container matColumnDef="vigencia">
              <th mat-header-cell *matHeaderCellDef>Vigencia</th>
              <td mat-cell *matCellDef="let c">
                <div class="flex items-center gap-2">
                  <span>
                    {{ c.fechaDesde | date : 'yyyy-MM-dd' }} —
                    {{ c.fechaHasta | date : 'yyyy-MM-dd' }}
                  </span>
                  <mat-icon
                    *ngIf="isVigente(c)"
                    class="text-green-600"
                    fontIcon="check_circle"
                  ></mat-icon>
                  <mat-icon
                    *ngIf="!isVigente(c)"
                    class="text-red-600"
                    fontIcon="cancel"
                  ></mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-right">
                Acciones
              </th>
              <td mat-cell *matCellDef="let c" class="text-right">
                <button
                  mat-icon-button
                  (click)="store.openEdit(c)"
                  aria-label="Editar"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="store.remove(c.idCupon)"
                  aria-label="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>

          @if (vm.coupons.length === 0 && !vm.isLoading) {
          <div class="p-4 text-gray-600">No hay cupones cargados.</div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class CouponsComponent {
  protected readonly store = inject(CouponsStore);
  cols = ['codigo', 'usuario', 'porcentaje', 'vigencia', 'acciones'];

  isVigente(c: Coupon): boolean {
    const hoy = new Date();
    const hoyDateOnly = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate()
    );

    const desde = parseDateOnly(c.fechaDesde);
    const hasta = parseDateOnly(c.fechaHasta);

    return hoyDateOnly >= desde && hoyDateOnly <= hasta;
  }
}

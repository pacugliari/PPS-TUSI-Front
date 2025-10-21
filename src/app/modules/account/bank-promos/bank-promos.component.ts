import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { BankPromosStore } from './bank-promos.store';
import { BankPromo } from './bank-promos.model';
import { parseDateOnly } from './bank-promos.util';

@Component({
  selector: 'app-bank-promos',
  standalone: true,
  providers: [BankPromosStore],
  imports: [
    CommonModule,
    DatePipe,
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
        <h2 class="text-xl font-semibold text-indigo-900">
          Promociones Bancarias
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
            <mat-icon class="mr-1">add</mat-icon> Agregar promoción
          </button>
        </div>

        <div
          class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto"
        >
          <table
            mat-table
            [dataSource]="vm.promos"
            class="w-full min-w-[980px]"
          >
            <!-- Banco -->
            <ng-container matColumnDef="banco">
              <th mat-header-cell *matHeaderCellDef>Banco</th>
              <td mat-cell *matCellDef="let p">
                {{ p.bancoNombre || '#' + p.idBanco }}
              </td>
            </ng-container>

            <!-- Nombre -->
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let p">{{ p.nombre }}</td>
            </ng-container>

            <!-- Vigencia -->
            <ng-container matColumnDef="vigencia">
              <th mat-header-cell *matHeaderCellDef>Vigencia</th>
              <td mat-cell *matCellDef="let p">
                <div class="flex items-center gap-2">
                  <span>
                    {{ p.fechaDesde | date : 'yyyy-MM-dd' }} —
                    {{ p.fechaHasta | date : 'yyyy-MM-dd' }}
                  </span>
                  <mat-icon
                    *ngIf="isVigente(p)"
                    class="text-green-600"
                    fontIcon="check_circle"
                  ></mat-icon>
                  <mat-icon
                    *ngIf="!isVigente(p)"
                    class="text-red-600"
                    fontIcon="cancel"
                  ></mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- porcentaje -->
            <ng-container matColumnDef="porcentaje">
              <th mat-header-cell *matHeaderCellDef>Descuento</th>
              <td mat-cell *matCellDef="let c">
                {{ c.porcentaje | number : '1.0-2' }}%
              </td>
            </ng-container>

            <!-- Días -->
            <ng-container matColumnDef="dias">
              <th mat-header-cell *matHeaderCellDef>Días</th>
              <td mat-cell *matCellDef="let p">
                {{ p.dias?.length ? p.dias.join(', ') : 'Todos' }}
              </td>
            </ng-container>

            <!-- Acciones -->
            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-right">
                Acciones
              </th>
              <td mat-cell *matCellDef="let p" class="text-right">
                <button
                  mat-icon-button
                  (click)="store.openEdit(p)"
                  aria-label="Editar"
                >
                  <mat-icon>edit</mat-icon>
                </button>
                <button
                  mat-icon-button
                  color="warn"
                  (click)="store.remove(p.idPromocionBancaria)"
                  aria-label="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>

          @if (vm.promos.length === 0 && !vm.isLoading) {
          <div class="p-4 text-gray-600">No hay promociones cargadas.</div>
          }
        </div>
      </div>
    </section>
    }
  `,
})
export class BankPromosComponent {
  protected readonly store = inject(BankPromosStore);
  cols = ['banco', 'nombre', 'vigencia', 'porcentaje', 'dias', 'acciones'];

  ngOnInit() {
    this.store.load();
    this.store.loadOptions();
  }

  isVigente(p: BankPromo): boolean {
    const hoy = new Date();
    const hoyDate = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const desde = parseDateOnly(p.fechaDesde);
    const hasta = parseDateOnly(p.fechaHasta);
    return hoyDate >= desde && hoyDate <= hasta;
  }
}

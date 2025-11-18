import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { PurchaseOrdersStore } from './purchase-orders.store';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-purchase-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    SpinnerComponent,
  ],
  providers: [PurchaseOrdersStore],
  template: `
    @if (store.vm$ | async; as vm) { @if (vm.isLoading) {
    <app-spinner />
    }

    <section class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Órdenes de compra</h2>
      </header>

      <mat-divider></mat-divider>

      <div class="p-6">
        <div class="flex justify-end mb-4">
          <button
            mat-raised-button
            color="primary"
            class="!bg-indigo-900 hover:!bg-indigo-800"
            (click)="generateOrder()"
          >
            <mat-icon class="mr-1">add_shopping_cart</mat-icon>
            Generar orden de compra
          </button>
        </div>

        <div class="rounded-lg border border-slate-300 p-4 bg-slate-50">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left border-b border-slate-300">
                <th class="py-2 px-3">ID</th>
                <th class="py-2 px-3">Fecha</th>
                <th class="py-2 px-3">Estado</th>
                <th class="py-2 px-3 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              @for (o of vm.orders; track o.idOrdenCompra) {
              <tr class="border-b border-slate-200">
                <td class="py-3 px-3">{{ o.idOrdenCompra }}</td>

                <td class="py-3 px-3">
                  {{ o.fecha | date : 'dd/MM/yyyy HH:mm' }}
                </td>

                <td class="py-3 px-3">
                  {{
                    o.estado === 'pendiente' ? '⏳ Pendiente' : '✔️ Entregado'
                  }}
                </td>

                <td class="py-3 px-3 text-right flex justify-end gap-3">
                  @if (o.estado === 'pendiente') {
                  <button
                    mat-icon-button
                    color="primary"
                    (click)="markDelivered(o.idOrdenCompra)"
                  >
                    <mat-icon>check_circle</mat-icon>
                  </button>
                  }

                  <button
                    mat-icon-button
                    (click)="openDetails(o.idOrdenCompra)"
                  >
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrdersComponent {
  protected readonly store = inject(PurchaseOrdersStore);

  openDetails(idOrdenCompra: number): void {
    this.store.openDetails(idOrdenCompra);
  }

  generateOrder(): void {
    this.store.generateOrder();
  }

  markDelivered(idOrdenCompra: number): void {
    this.store.openDeliveredDialog(idOrdenCompra);
  }
}

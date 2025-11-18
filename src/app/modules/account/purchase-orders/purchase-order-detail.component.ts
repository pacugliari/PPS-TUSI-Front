import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseOrderDetail } from './purchase-orders.model';

@Component({
  selector: 'app-purchase-order-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2
      mat-dialog-title
      class="text-xl font-semibold text-indigo-900 border-b border-slate-200 pb-2"
    >
      Orden de compra #{{ data.idOrdenCompra }}
    </h2>

    <div class="p-4">
      @if (data.items.length === 0) {
      <div class="p-4 text-slate-500 text-center">
        <mat-icon class="text-5xl mb-2 text-slate-400">inventory_2</mat-icon>
        <p>No hay productos en esta orden de compra.</p>
      </div>
      } @else {
      <div
        class="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white"
      >
        <table class="min-w-full text-sm border-collapse">
          <thead class="bg-indigo-50 text-indigo-900">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">Producto</th>
              <th class="px-4 py-3 text-right font-semibold">Precio</th>
              <th class="px-4 py-3 text-center font-semibold">Cantidad</th>
              <th class="px-4 py-3 text-right font-semibold">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            @for (it of data.items; track it.idItemOrdenCompra; let i = $index)
            {
            <tr
              class="transition-colors duration-150 hover:bg-indigo-50"
              [ngClass]="{ 'bg-slate-50': i % 2 === 1 }"
            >
              <td class="px-4 py-3">{{ it.nombre }}</td>

              <td class="px-4 py-3 text-right text-slate-700">
                {{ it.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>

              <td class="px-4 py-3 text-center">
                {{ it.cantidad }}
              </td>

              <td class="px-4 py-3 text-right font-medium text-indigo-700">
                {{ it.subtotal | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>
            </tr>
            }
          </tbody>

          <tfoot class="text-slate-800">
            <tr>
              <td colspan="4" class="py-1"></td>
            </tr>

            <tr
              class="bg-indigo-50 font-semibold text-indigo-900 border-t border-slate-300"
            >
              <td colspan="3" class="px-4 py-3 text-right">Total</td>
              <td class="px-4 py-3 text-right">
                {{ data.total | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      }
    </div>

    <div mat-dialog-actions align="end" class="mt-4">
      <button mat-stroked-button color="primary" (click)="close()">
        <mat-icon class="mr-1">close</mat-icon>
        Cerrar
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseOrderDetailComponent {
  data = inject<PurchaseOrderDetail>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(
    MatDialogRef<PurchaseOrderDetailComponent>
  );

  close(): void {
    this.dialogRef.close();
  }
}

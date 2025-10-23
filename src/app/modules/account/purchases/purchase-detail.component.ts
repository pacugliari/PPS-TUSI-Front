import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PedidoDetail } from './purchases.model';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Detalle del pedido #{{ data.idPedido }}</h2>

    <div mat-dialog-content>
      @if (data.items.length === 0) {
      <p class="text-slate-600">No hay detalle para este pedido.</p>
      } @else {
      <table class="min-w-full border border-slate-200 text-sm">
        <thead class="bg-slate-800 text-black">
          <tr>
            <th class="px-4 py-2 text-left">Artículo</th>
            <th class="px-4 py-2 text-right">Precio</th>
            <th class="px-4 py-2 text-center">Cantidad</th>
            <th class="px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          @for (it of data.items; track it.articulo; let i = $index) {
          <tr class="{{ i % 2 === 0 ? 'bg-white' : 'bg-slate-50' }}">
            <td class="px-4 py-2">{{ it.articulo }}</td>
            <td class="px-4 py-2 text-right">
              {{ it.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
            </td>
            <td class="px-4 py-2 text-center">{{ it.cantidad }}</td>
            <td class="px-4 py-2 text-right">
              {{ it.subtotal | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
            </td>
          </tr>
          }
        </tbody>
        <tfoot>
          <tr class="bg-slate-100 font-semibold">
            <td class="px-4 py-2 text-right" colspan="3">Total</td>
            <td class="px-4 py-2 text-right">
              {{ data.total | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
            </td>
          </tr>
        </tfoot>
      </table>
      }
    </div>

    <div mat-dialog-actions align="end">
      <button mat-stroked-button (click)="close()">Cerrar</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseDetailComponent {
  data = inject<PedidoDetail>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<PurchaseDetailComponent>);

  close() {
    this.dialogRef.close();
  }
}

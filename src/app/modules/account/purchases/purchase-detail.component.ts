import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PedidoDetail } from './purchases.model';
import { ProductRatingDialogComponent } from './product-rating-dialog.component';
import { take } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <h2
      mat-dialog-title
      class="text-xl font-semibold text-indigo-900 border-b border-slate-200 pb-2 "
    >
      Detalle del pedido #{{ data.idPedido }}
    </h2>

    <div class="p-4">
      @if (data.items.length === 0) {
      <div class="p-4 text-slate-500 text-center">
        <mat-icon class="text-5xl mb-2 text-slate-400">inventory_2</mat-icon>
        <p>No hay detalle para este pedido.</p>
      </div>
      } @else {
      <div
        class="overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white"
      >
        <table class="min-w-full text-sm border-collapse">
          <thead class="bg-indigo-50 text-indigo-900">
            <tr>
              <th class="px-4 py-3 text-left font-semibold">Artículo</th>
              <th class="px-4 py-3 text-right font-semibold">Precio</th>
              <th class="px-4 py-3 text-center font-semibold">Cantidad</th>
              <th class="px-4 py-3 text-right font-semibold">Subtotal</th>
              <th class="px-4 py-3 text-center font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            @for (it of data.items; track it.articulo; let i = $index) {
            <tr
              class="transition-colors duration-150 hover:bg-indigo-50"
              [ngClass]="{ 'bg-slate-50': i % 2 === 1 }"
            >
              <td class="px-4 py-3">{{ it.articulo }}</td>
              <td class="px-4 py-3 text-right text-slate-700">
                {{ it.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>
              <td class="px-4 py-3 text-center">{{ it.cantidad }}</td>
              <td class="px-4 py-3 text-right font-medium text-indigo-700">
                {{ it.subtotal | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>
              <td class="px-4 py-3 text-center flex justify-center gap-2">
                <!-- Calificar -->
                <span
                  [matTooltip]="
                    it.calificado
                      ? 'Ya calificaste este producto'
                      : 'Agregar comentario'
                  "
                  matTooltipPosition="above"
                >
                  <button
                    [disabled]="it.calificado"
                    mat-icon-button
                    color="primary"
                    (click)="openRatingModal(it)"
                    [attr.aria-label]="
                      it.calificado
                        ? 'Ya calificaste este producto'
                        : 'Agregar comentario'
                    "
                  >
                    <mat-icon>rate_review</mat-icon>
                  </button>
                </span>

                <!-- Ver producto -->
                <button
                  mat-icon-button
                  color="accent"
                  (click)="goToProduct(it.idProducto)"
                  aria-label="Ver producto"
                  matTooltip="Ver producto"
                  matTooltipPosition="above"
                >
                  <mat-icon>open_in_new</mat-icon>
                </button>
              </td>
            </tr>
            }
          </tbody>

          <tfoot>
            <tr class="bg-indigo-50 font-semibold text-indigo-900">
              <td colspan="3" class="px-4 py-3 text-right">Total</td>
              <td class="px-4 py-3 text-right">
                {{ data.total | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      }
    </div>

    <div mat-dialog-actions align="end" class="mt-4">
      <button mat-stroked-button color="primary" (click)="close()">
        <mat-icon class="mr-1">close</mat-icon> Cerrar
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseDetailComponent {
  data = inject<PedidoDetail>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PurchaseDetailComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  close() {
    this.dialogRef.close();
  }

  openRatingModal(item: any) {
    const ref = this.dialog.open(ProductRatingDialogComponent, {
      width: '50vw',
      height: 'auto',
      maxWidth: 'none',
      data: {
        articulo: item.articulo,
        idProducto: item.idProducto ?? null,
        idPedido: this.data.idPedido,
      },
    });

    this.dialogRef.addPanelClass('invisible');
    ref
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        this.dialogRef.removePanelClass('invisible');
        this.dialogRef.close(result);
      });
  }

  goToProduct(idProducto: number) {
    this.dialogRef.close();
    this.router.navigate(['/product', idProducto]);
  }
}

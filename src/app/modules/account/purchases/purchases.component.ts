import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { PurchasesStore } from './purchases.store';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  providers: [PurchasesStore],
  template: `
    <header class="text-center py-4">
      <h2 class="text-xl font-semibold text-indigo-900">Mis Compras</h2>
    </header>
    <mat-divider></mat-divider>

    @if (vm$ | async; as vm) {
      <div class="p-6">
        @if (vm.pedidos.length === 0) {
          <div class="text-slate-600">No tenés pedidos registrados.</div>
        } @else {
          <div class="space-y-3">
            @for (p of vm.pedidos; track p.idPedido) {
              <div class="border rounded p-4 bg-white flex justify-between items-center">
                <div>
                  <div class="font-semibold">Pedido #{{ p.idPedido }}</div>
                  <div class="text-sm text-slate-600">{{ p.estado | titlecase }}</div>
                  <div class="text-sm">{{ p.fechaView }}</div>
                </div>

                <div class="flex items-center gap-2">
                  <div class="text-right mr-2">
                    <div class="font-semibold text-red-600">
                      {{ p.total | currency:'ARS':'symbol-narrow':'1.2-2' }}
                    </div>
                  </div>

                  <button mat-stroked-button (click)="verDetalle(p.idPedido)">
                    Ver detalle
                  </button>

                  <button
                    mat-stroked-button
                    color="primary"
                    (click)="descargarFactura(p.idPedido)"
                    [disabled]="vm.downloading"
                  >
                    {{ vm.downloading ? 'Descargando…' : 'Descargar factura' }}
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosComponent {
  private store = inject(PurchasesStore);
  readonly vm$ = this.store.vm$;

  constructor() {
    this.store.loadPedidos();
  }

  verDetalle(id: number) {
    this.store.openDetail(id);
  }

  descargarFactura(id: number) {
    this.store.downloadInvoice(id);
  }
}

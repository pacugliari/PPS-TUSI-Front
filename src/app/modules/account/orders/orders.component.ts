// orders.component.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { OrdersStore } from './orders.store';
import { GlobalStore } from '../../../global-store';
import { RolType } from '../../../shared/models/rol.model';
import { PedidoEstado } from './orders.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDividerModule],
  providers: [OrdersStore],
  template: `
    <header class="text-center py-4">
      <h2 class="text-xl font-semibold text-indigo-900">Pedidos</h2>
    </header>
    <mat-divider></mat-divider>

    @if (vm$ | async; as vm) {
    <div class="p-6 space-y-3">
      @if (vm.pedidos.length === 0) {
      <div class="text-slate-600">No hay pedidos registrados.</div>
      } @else { @for (p of vm.pedidos; track p.idPedido) {
      <section
        class="bg-white border rounded-lg hover:border-indigo-300 hover:shadow-sm transition"
      >
        <div
          class="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-center p-4"
        >
          <!-- Info pedido + cliente -->
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-indigo-900 truncate">
                Pedido #{{ p.idPedido }}
              </h3>
              <span
                class="text-xs rounded-full px-2 py-0.5 border"
                [ngClass]="{
                  'bg-emerald-50 text-emerald-700 border-emerald-200':
                    p.estado === 'pagado',
                  'bg-amber-50 text-amber-700 border-amber-200':
                    p.estado === 'pendiente' || p.estado === 'reservado',
                  'bg-slate-50 text-slate-700 border-slate-200':
                    p.estado === 'enviado' || p.estado === 'entregado',
                  'bg-rose-50 text-rose-700 border-rose-200':
                    p.estado === 'cancelado' || p.estado === 'devuelto'
                }"
              >
                {{ p.estado | titlecase }}
              </span>
              <span class="text-xs text-slate-500">— {{ p.fechaView }}</span>
            </div>

            @if (p.cliente) {
            <div class="mt-2 text-xs text-slate-600 leading-5">
              <div>
                <span class="font-medium">Cliente:</span>
                {{ p.cliente.nombre || '—' }}
              </div>
              <div class="truncate">
                <span class="font-medium">Email:</span> {{ p.cliente.email }}
              </div>
              @if (p.cliente.telefono) {
              <div>
                <span class="font-medium">Tel:</span> {{ p.cliente.telefono }}
              </div>
              }
            </div>
            }
          </div>

          <!-- Monto + forma de pago -->
          <div class="text-right md:text-left">
            <div
              class="text-lg md:text-xl font-semibold text-slate-900 tabular-nums"
            >
              {{ p.total | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
            </div>
            <div class="mt-1 text-xs inline-flex items-center gap-2">
              <span
                class="rounded-full px-2 py-0.5 border text-slate-700 bg-slate-50 border-slate-200"
              >
                {{ p.formaPago | titlecase }}
              </span>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex md:justify-end gap-2">
            @if (user$ | async; as user) { @let rolUser = user?.role?.tipo!; @if
            ([rolTypes.ADMINISTRADOR].includes(rolUser) ) {
            @if(canShip(p.estado)){
            <button
              mat-stroked-button
              color="accent"
              class="whitespace-nowrap"
              (click)="enviar(p.idPedido)"
            >
              Enviado
            </button>
            } @if(canCancel(p.estado)){
            <button
              mat-stroked-button
              color="warn"
              class="whitespace-nowrap"
              (click)="cancelar(p.idPedido)"
            >
              Cancelar
            </button>
            } @if(canDelivered(p.estado)){
            <button
              mat-stroked-button
              color="primary"
              class="whitespace-nowrap"
              (click)="entregado(p.idPedido)"
            >
              Entregado
            </button>
            }
            <button
              mat-stroked-button
              color="primary"
              class="whitespace-nowrap"
              (click)="verDetalle(p.idPedido)"
            >
              Ver detalle
            </button>
            } @if ([rolTypes.DELIVERY].includes(rolUser) ) {
            <button
              mat-stroked-button
              color="primary"
              class="whitespace-nowrap"
              (click)="entregado(p.idPedido)"
            >
              Entregado
            </button>
            }}
          </div>
        </div>
      </section>
      } }
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  private readonly store = inject(OrdersStore);
  private readonly globalStore = inject(GlobalStore);
  readonly vm$ = this.store.vm$;
  readonly user$ = this.globalStore.user$;
  protected rolTypes = RolType;

  constructor() {
    this.store.loadPedidos();
  }

  verDetalle(id: number) {
    this.store.openDetail(id);
  }

  cancelar(id: number) {
    this.store.cancelarPedido(id);
  }

  enviar(id: number) {
    this.store.marcarEnviado(id);
  }

  entregado(id: number) {
    this.store.marcarEntregado(id);
  }

  canCancel(estado: PedidoEstado | null | undefined): boolean {
    const s = String(estado || '').toLowerCase();
    return s === 'reservado' || s === 'pagado';
  }

  canShip(estado: PedidoEstado | null | undefined): boolean {
    return String(estado || '').toLowerCase() === 'pagado';
  }

  canDelivered(estado: PedidoEstado | null | undefined): boolean {
    return String(estado || '').toLowerCase() === 'reservado';
  }
}

import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {
  ReactiveFormsModule,
  FormArray,
  FormBuilder,
  AbstractControl,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ProductToReplenish, CreateOrderDto } from './purchase-orders.model';

@Component({
  selector: 'app-purchase-order-generate-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">
      Generar Orden de Compra
    </h2>

    <div mat-dialog-content class="p-4 overflow-auto">
      <table class="w-full text-sm min-w-[950px]">
        <thead class="border-b bg-slate-100 font-semibold">
          <tr>
            <th class="py-2 px-2 text-left">Producto</th>
            <th class="py-2 px-2 text-center">Stock</th>
            <th class="py-2 px-2 text-center">Disponible</th>
            <th class="py-2 px-2 text-center">Reservado</th>
            <th class="py-2 px-2 text-center">Comprometido</th>
            <th class="py-2 px-2 text-center">Mínimo</th>
            <th class="py-2 px-2 text-center">Máximo</th>
            <th class="py-2 px-2 text-center">Sugerido</th>
            <th class="py-2 px-2 text-center">A pedir</th>
          </tr>
        </thead>

        <tbody>
          @for (ctrl of items.controls; track ctrl.value.idProducto) {
          <tr class="border-b" [formGroup]="ctrl">
            <td class="py-2 px-2">{{ ctrl.value.nombre }}</td>
            <td class="py-2 px-2 text-center">{{ ctrl.value.stockActual }}</td>
            <td class="py-2 px-2 text-center">
              {{ ctrl.value.disponibilidad }}
            </td>
            <td class="py-2 px-2 text-center">{{ ctrl.value.reservado }}</td>
            <td class="py-2 px-2 text-center">{{ ctrl.value.comprometido }}</td>
            <td class="py-2 px-2 text-center">{{ ctrl.value.stockMinimo }}</td>
            <td class="py-2 px-2 text-center">{{ ctrl.value.stockMaximo }}</td>

            <td class="py-2 px-2 text-center font-semibold text-indigo-700">
              {{ ctrl.value.cantidadAReponer }}
            </td>

            <td class="py-2 px-2 text-center">
              <input
                matInput
                type="number"
                min="0"
                [formControl]="getCantidad(ctrl)"
                class="w-20 text-center"
              />
            </td>
          </tr>
          }
        </tbody>
      </table>
    </div>

    <div mat-dialog-actions class="flex justify-end gap-3 p-4">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="submit()">
        Generar orden
      </button>
    </div>
  `,
})
export class PurchaseOrderGenerateDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    items: this.fb.array<FormGroup>([]),
  });

  protected readonly items = this.form.get('items') as FormArray<FormGroup>;

  constructor(
    private dialogRef: MatDialogRef<PurchaseOrderGenerateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductToReplenish[]
  ) {
    data.forEach((p) => {
      this.items.push(
        this.fb.group({
          idProducto: p.idProducto,
          nombre: p.nombre,
          stockActual: p.stockActual,
          stockMinimo: p.stockMinimo,
          stockMaximo: p.stockMaximo,
          reservado: p.reservado,
          comprometido: p.comprometido,
          disponibilidad: p.disponibilidad,
          cantidadAReponer: p.cantidadAReponer,
          cantidad: p.cantidadAReponer,
        })
      );
    });
  }

  getCantidad(ctrl: AbstractControl): FormControl {
    return ctrl.get('cantidad') as FormControl;
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const payload: CreateOrderDto = {
      items: this.items.value.map(
        (i: { idProducto: number; cantidad: number }) => ({
          idProducto: i.idProducto,
          cantidad: Number(i.cantidad),
        })
      ),
    };

    this.dialogRef.close(payload);
  }
}

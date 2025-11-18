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
  FormGroup,
  Validators,
} from '@angular/forms';

export interface DeliveredItemData {
  idItemOrdenCompra: number;
  nombre: string;
  cantidad: number;
}

export interface DeliveredPayload {
  items: {
    idItemOrdenCompra: number;
    cantidadRecibida: number;
  }[];
}

@Component({
  selector: 'app-purchase-order-delivered-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">Registrar entrega</h2>

    <div mat-dialog-content class="p-4 overflow-auto">
      <table class="w-full text-sm min-w-[700px]">
        <thead class="border-b bg-slate-100 font-semibold">
          <tr>
            <th class="py-2 px-2 text-left">Producto</th>
            <th class="py-2 px-2 text-center">Cantidad pedida</th>
            <th class="py-2 px-2 text-center">Recibido</th>
          </tr>
        </thead>

        <tbody>
          @for (ctrl of items.controls; track ctrl.value.idItemOrdenCompra) {
          <tr class="border-b" [formGroup]="ctrl">
            <td class="py-2 px-2">{{ ctrl.value.nombre }}</td>
            <td class="py-2 px-2 text-center">{{ ctrl.value.cantidad }}</td>
            <td class="py-2 px-2 text-center">
              <input
                matInput
                type="number"
                min="0"
                [max]="ctrl.value.cantidad"
                class="w-28 text-center"
                formControlName="cantidadRecibida"
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
        Confirmar entrega
      </button>
    </div>
  `,
})
export class PurchaseOrderDeliveredDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    items: this.fb.array<FormGroup>([]),
  });

  items = this.form.get('items') as FormArray<FormGroup>;

  constructor(
    private dialogRef: MatDialogRef<PurchaseOrderDeliveredDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveredItemData[]
  ) {
    this.data.forEach((i) =>
      this.items.push(
        this.fb.group({
          idItemOrdenCompra: [i.idItemOrdenCompra],
          nombre: [i.nombre],
          cantidad: [i.cantidad],
          cantidadRecibida: [
            i.cantidad,
            [Validators.required, Validators.min(0)],
          ],
        })
      )
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const payload: DeliveredPayload = {
      items: this.items.value.map((i) => ({
        idItemOrdenCompra: i.idItemOrdenCompra,
        cantidadRecibida: Number(i.cantidadRecibida),
      })),
    };

    this.dialogRef.close(payload);
  }
}

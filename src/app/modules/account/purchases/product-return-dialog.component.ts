import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-return-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-xl font-semibold text-indigo-900 border-b pb-2">
      Devolver producto
    </h2>

    <div class="p-4 flex flex-col gap-4">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Motivo de devolución</mat-label>
        <mat-select [(ngModel)]="motivo" required>
          <mat-option value="producto_defectuoso">Producto defectuoso</mat-option>
          <mat-option value="producto_incorrecto">Producto incorrecto</mat-option>
          <mat-option value="producto_incompleto">Producto incompleto</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Comentario</mat-label>
        <textarea
          matInput
          [(ngModel)]="comentario"
          rows="3"
          placeholder="Agregá detalles opcionales..."
        ></textarea>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end" class="mt-4">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        (click)="confirm()"
        [disabled]="!motivo"
      >
        Confirmar devolución
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReturnDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ProductReturnDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  motivo = '';
  comentario = '';

  close() {
    this.dialogRef.close();
  }

  confirm() {
    this.dialogRef.close({
      motivo: this.motivo,
      comentario: this.comentario,
      idProducto: this.data.idProducto,
      idPedido: this.data.idPedido,
    });
  }
}

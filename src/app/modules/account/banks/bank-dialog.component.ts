import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Bank, BankUpsertDto } from './banks.model';

type DialogData = { mode: 'create' | 'edit'; bank?: Bank };

@Component({
  selector: 'app-bank-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">
      {{ data.mode === 'create' ? 'Agregar banco' : 'Editar banco' }}
    </h2>

    <div mat-dialog-content class="grid grid-cols-1 gap-4 pt-2">
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Nombre</mat-label>
        <input matInput [formControl]="form.controls.nombre" maxlength="100" />
        <mat-error *ngIf="form.controls.nombre.hasError('required')">
          El nombre es obligatorio
        </mat-error>
      </mat-form-field>
    </div>

    <div mat-dialog-actions class="flex justify-end gap-3 pt-4">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="form.invalid"
        (click)="submit()"
      >
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </div>
  `,
})
export class BankDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor(
    private ref: MatDialogRef<BankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.bank) {
      const b = data.bank;
      this.form.setValue({ nombre: b.nombre });
    }
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue() as BankUpsertDto);
  }
}

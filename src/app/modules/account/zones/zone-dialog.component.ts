import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Zone, ZoneUpsertDto } from './zones.model';

type DialogData = {
  mode: 'create' | 'edit';
  zone?: Zone;
};

@Component({
  selector: 'app-zone-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">
      {{ data.mode === 'create' ? 'Agregar zona' : 'Editar zona' }}
    </h2>

    <div mat-dialog-content class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <mat-form-field appearance="outline" class="md:col-span-2 w-full  p-2">
        <mat-label>Nombre</mat-label>
        <input matInput [formControl]="form.controls.nombre" maxlength="80" />
        <mat-error *ngIf="form.controls.nombre.hasError('required')">
          El nombre es obligatorio
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full  p-2">
        <mat-label>Ciudad</mat-label>
        <input matInput [formControl]="form.controls.ciudad" maxlength="80" />
        <mat-error *ngIf="form.controls.ciudad.hasError('required')">
          La ciudad es obligatoria
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full  p-2">
        <mat-label>Provincia</mat-label>
        <input matInput [formControl]="form.controls.provincia" maxlength="80" />
        <mat-error *ngIf="form.controls.provincia.hasError('required')">
          La provincia es obligatoria
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full  p-2">
        <mat-label>Costo de envío</mat-label>
        <input
          matInput
          type="number"
          inputmode="decimal"
          min="0"
          step="1"
          [formControl]="form.controls.costoEnvio"
        />
        <span matSuffix>$</span>
        <mat-error *ngIf="form.controls.costoEnvio.hasError('required')">
          El costo es obligatorio
        </mat-error>
        <mat-error *ngIf="form.controls.costoEnvio.hasError('min')">
          Debe ser mayor o igual a 0
        </mat-error>
      </mat-form-field>
    </div>

    <div mat-dialog-actions class="flex justify-end gap-3 pt-4">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="submit()">
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </div>
  `,
})
export class ZoneDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    ciudad: ['', [Validators.required, Validators.maxLength(80)]],
    provincia: ['', [Validators.required, Validators.maxLength(80)]],
    costoEnvio: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(
    private ref: MatDialogRef<ZoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.zone) {
      const z = data.zone;
      this.form.setValue({
        nombre: z.nombre,
        ciudad: z.ciudad,
        provincia: z.provincia,
        costoEnvio: z.costoEnvio,
      });
    }
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue() as ZoneUpsertDto;
    this.ref.close(v);
  }
}

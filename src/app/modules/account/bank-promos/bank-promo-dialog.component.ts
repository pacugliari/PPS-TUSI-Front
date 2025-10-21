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
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BankPromo, BankPromoUpsertDto, SimpleBank } from './bank-promos.model';
import { parseDateOnly } from './bank-promos.util';

type DialogData = {
  mode: 'create' | 'edit';
  promo?: BankPromo;
  bancos: SimpleBank[];
};

const WEEK_DAYS = [
  'lunes','martes','miercoles','jueves','viernes','sabado','domingo',
];

@Component({
  selector: 'app-bank-promo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">
      {{ data.mode === 'create' ? 'Agregar promoción bancaria' : 'Editar promoción bancaria' }}
    </h2>

    <div mat-dialog-content class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <!-- Banco -->
      <mat-form-field appearance="outline" class="md:col-span-2 w-full p-2">
        <mat-label>Banco</mat-label>
        <mat-select [formControl]="form.controls.idBanco" required>
          <mat-option [value]="null" disabled>Seleccioná</mat-option>
          @for (b of data.bancos; track b.idBanco) {
            <mat-option [value]="b.idBanco">{{ b.nombre }}</mat-option>
          }
        </mat-select>
        <mat-error *ngIf="form.controls.idBanco.hasError('required')">
          El banco es obligatorio
        </mat-error>
      </mat-form-field>

      <!-- Nombre -->
      <mat-form-field appearance="outline" class="md:col-span-2 w-full p-2">
        <mat-label>Nombre de la promo</mat-label>
        <input matInput [formControl]="form.controls.nombre" maxlength="120" />
        <mat-error *ngIf="form.controls.nombre.hasError('required')">
          El nombre es obligatorio
        </mat-error>
      </mat-form-field>

      <!-- Desde -->
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Desde</mat-label>
        <input matInput [matDatepicker]="dp1" [formControl]="form.controls.fechaDesde" />
        <mat-datepicker-toggle matSuffix [for]="dp1"></mat-datepicker-toggle>
        <mat-datepicker #dp1></mat-datepicker>
        <mat-error *ngIf="form.controls.fechaDesde.hasError('required')">
          La fecha desde es obligatoria
        </mat-error>
      </mat-form-field>

      <!-- Hasta -->
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Hasta</mat-label>
        <input
          matInput
          [matDatepicker]="dp2"
          [min]="form.controls.fechaDesde.value || null"
          [formControl]="form.controls.fechaHasta"
        />
        <mat-datepicker-toggle matSuffix [for]="dp2"></mat-datepicker-toggle>
        <mat-datepicker #dp2></mat-datepicker>
        <mat-error *ngIf="form.controls.fechaHasta.hasError('required')">
          La fecha hasta es obligatoria
        </mat-error>
      </mat-form-field>

      <!-- Porcentaje -->
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Porcentaje</mat-label>
        <input
          matInput
          type="number"
          inputmode="decimal"
          min="0"
          max="100"
          step="0.01"
          placeholder="0 - 100"
          [formControl]="form.controls.porcentaje"
        />
        <span matSuffix>%</span>
        <mat-error *ngIf="form.controls.porcentaje.hasError('required')">
          El porcentaje es obligatorio
        </mat-error>
        <mat-error *ngIf="form.controls.porcentaje.hasError('min') || form.controls.porcentaje.hasError('max')">
          Debe estar entre 0 y 100
        </mat-error>
      </mat-form-field>

      <!-- Días -->
      <mat-form-field appearance="outline" class="md:col-span-2 w-full p-2">
        <mat-label>Días aplicables</mat-label>
        <mat-select [formControl]="form.controls.dias" multiple>
          @for (d of weekDays; track d) {
            <mat-option [value]="d">{{ d | titlecase }}</mat-option>
          }
        </mat-select>
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
export class BankPromoDialogComponent {
  private readonly fb = inject(FormBuilder);
  weekDays = WEEK_DAYS;

  form = this.fb.group({
    idBanco: [null as number | null, Validators.required],
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    fechaDesde: [new Date(), Validators.required],
    fechaHasta: [new Date(), Validators.required],
    porcentaje: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    dias: [[] as string[]],
  });

  constructor(
    private ref: MatDialogRef<BankPromoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.promo) {
      const p = data.promo;
      this.form.setValue({
        idBanco: p.idBanco,
        nombre: p.nombre,
        fechaDesde: parseDateOnly(p.fechaDesde),
        fechaHasta: parseDateOnly(p.fechaHasta),
        porcentaje: (p as any).porcentaje ?? 0,
        dias: p.dias ?? [],
      });
    }
  }

  close() { this.ref.close(); }

  private toISO(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const dto: BankPromoUpsertDto = {
      idBanco: Number(v.idBanco),
      nombre: String(v.nombre ?? '').trim(),
      fechaDesde: this.toISO(v.fechaDesde as Date),
      fechaHasta: this.toISO(v.fechaHasta as Date),
      porcentaje: Number(v.porcentaje ?? 0),
      dias: Array.isArray(v.dias) ? v.dias : [],
    } as any;
    this.ref.close(dto);
  }
}

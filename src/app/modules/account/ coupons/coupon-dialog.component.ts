import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Coupon, User, CouponUpsertDto } from './coupons.model';
import { parseDateOnly } from './coupons.util';

type DialogData = {
  mode: 'create' | 'edit';
  coupon?: Coupon;
  users: User[];
};

@Component({
  selector: 'app-coupon-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">
      {{ data.mode === 'create' ? 'Agregar cupón' : 'Editar cupón' }}
    </h2>

    <!-- Más aire: gap-x-6 gap-y-4 -->
    <div
      mat-dialog-content
      class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2"
    >
      <!-- Usuario (fila completa) -->
      <mat-form-field appearance="outline" class="md:col-span-2 w-full p-2">
        <mat-label>Usuario</mat-label>
        <mat-select [formControl]="form.controls.idUsuario" required>
          <mat-option [value]="null" disabled>Seleccioná</mat-option>
          @for (u of data.users; track u.idUsuario) {
          <mat-option [value]="u.idUsuario">
            {{ u.nombre }}<span *ngIf="u.email"> — {{ u.email }}</span>
          </mat-option>
          }
        </mat-select>
        <mat-error *ngIf="form.controls.idUsuario.hasError('required')">
          El usuario es obligatorio
        </mat-error>
      </mat-form-field>

      <!-- Código (fila completa) -->w
      <mat-form-field appearance="outline" class="md:col-span-2 w-full p-2">
        <mat-label>Código</mat-label>
        <input
          matInput
          cdkFocusInitial
          placeholder="BLACKFRIDAY25"
          [formControl]="form.controls.codigo"
          maxlength="50"
        />
        <mat-error *ngIf="form.controls.codigo.hasError('required')">
          El código es obligatorio
        </mat-error>
      </mat-form-field>

      <!-- Porcentaje -->
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Porcentaje de descuento</mat-label>
        <input
          matInput
          type="number"
          inputmode="decimal"
          min="0"
          max="100"
          step="1"
          placeholder="0 - 100"
          [formControl]="form.controls.porcentaje"
        />
        <span matSuffix>%</span>
        <mat-error *ngIf="form.controls.porcentaje.hasError('required')">
          El porcentaje es obligatorio
        </mat-error>
        <mat-error
          *ngIf="
            form.controls.porcentaje.hasError('min') ||
            form.controls.porcentaje.hasError('max')
          "
        >
          El valor debe estar entre 0 y 100
        </mat-error>
      </mat-form-field>

      <!-- Desde -->
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Desde</mat-label>
        <input
          matInput
          [matDatepicker]="dp1"
          [formControl]="form.controls.fechaDesde"
        />
        <mat-datepicker-toggle matSuffix [for]="dp1"></mat-datepicker-toggle>
        <mat-datepicker #dp1></mat-datepicker>
        <mat-error *ngIf="form.controls.fechaDesde.hasError('required')"
          >Fecha obligatoria.</mat-error
        >
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
        <mat-error *ngIf="form.controls.fechaHasta.hasError('required')"
          >Fecha obligatoria.</mat-error
        >
      </mat-form-field>

      <!-- Error de rango -->
      <div class="md:col-span-2 -mt-2" *ngIf="form.hasError('dateRange')">
        <p class="text-sm text-red-600">
          La fecha <b>Hasta</b> debe ser igual o posterior a <b>Desde</b>.
        </p>
      </div>
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
export class CouponDialogComponent {
  private readonly fb = inject(FormBuilder);


  constructor(
    private ref: MatDialogRef<CouponDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.coupon) {
      const c = data.coupon;
      this.form.setValue({
        idUsuario: c.idUsuario,
        codigo: c.codigo,
        porcentaje: c.porcentaje ?? 0,
        fechaDesde: parseDateOnly(c.fechaDesde),
        fechaHasta: parseDateOnly(c.fechaHasta),
      });
    }
  }

  private static dateRangeValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const desde = group.get('fechaDesde')?.value as Date | null;
    const hasta = group.get('fechaHasta')?.value as Date | null;
    if (!desde || !hasta) return null;
    return hasta >= desde ? null : { dateRange: true };
  }

  form = this.fb.group(
    {
      idUsuario: [null as number | null, Validators.required],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      porcentaje: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      fechaDesde: [new Date(), Validators.required],
      fechaHasta: [new Date(), Validators.required],
    },
    { validators: CouponDialogComponent.dateRangeValidator }
  );

  close() {
    this.ref.close();
  }

  private toISO(d: Date): string {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      .toISOString()
      .slice(0, 10);
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const dto: CouponUpsertDto = {
      idUsuario: Number(v.idUsuario),
      codigo: String(v.codigo ?? '').trim(),
      porcentaje: Number(v.porcentaje ?? 0),
      fechaDesde: this.toISO(v.fechaDesde as Date),
      fechaHasta: this.toISO(v.fechaHasta as Date),
    } as any;
    this.ref.close(dto);
  }
}

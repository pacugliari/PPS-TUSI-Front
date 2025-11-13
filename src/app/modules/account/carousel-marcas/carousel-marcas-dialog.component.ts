import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CarouselMarca, CarouselMarcaUpsertDto } from './carousel-marcas.model';

type DialogData = {
  mode: 'create' | 'edit';
  marca?: CarouselMarca;
};

@Component({
  selector: 'app-carousel-marcas-dialog',
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
      {{
        data.mode === 'create' ? 'Agregar marca al carrusel' : 'Editar marca'
      }}
    </h2>

    <div class="pt-2 p-5">
      <form [formGroup]="form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
          <mat-error *ngIf="form.controls.nombre.hasError('required')">
            El nombre es obligatorio
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Logo URL</mat-label>
          <input matInput formControlName="logoUrl" />
          <mat-error *ngIf="form.controls.logoUrl.hasError('required')">
            El logo es obligatorio
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full md:col-span-2">
          <mat-label>Orden</mat-label>
          <input matInput type="number" formControlName="orden" />
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions class="flex justify-end gap-3 pt-4 pb-2 px-1">
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
export class CarouselMarcasDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    nombre: ['', [Validators.required]],
    logoUrl: ['', [Validators.required]],
    orden: [undefined as undefined | number],
  });

  constructor(
    private ref: MatDialogRef<CarouselMarcasDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.marca) {
      this.form.patchValue(data.marca);
    }
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue() as CarouselMarcaUpsertDto);
  }
}

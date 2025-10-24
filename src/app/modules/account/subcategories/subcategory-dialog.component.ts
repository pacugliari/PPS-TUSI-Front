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
import {
  SubCategory,
  SubCategoryUpsertDto,
  SimpleCategory,
} from './subcategories.model';

type DialogData = {
  mode: 'create' | 'edit';
  subcat?: SubCategory;
  categorias: SimpleCategory[];
};

@Component({
  selector: 'app-subcategory-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title class="text-lg font-semibold">
      {{
        data.mode === 'create' ? 'Agregar subcategoría' : 'Editar subcategoría'
      }}
    </h2>

    <div mat-dialog-content class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <mat-form-field appearance="outline" class="md:col-span-2 w-full">
        <mat-label>Categoría</mat-label>
        <mat-select [formControl]="form.controls.idCategoria" required>
          <mat-option [value]="null" disabled>Seleccioná</mat-option>
          @for (c of data.categorias; track c.idCategoria) {
          <mat-option [value]="c.idCategoria">{{ c.nombre }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="md:col-span-2 w-full">
        <mat-label>Nombre</mat-label>
        <input matInput [formControl]="form.controls.nombre" maxlength="100" />
        <mat-error *ngIf="form.controls.nombre.hasError('required')"
          >El nombre es obligatorio</mat-error
        >
      </mat-form-field>

      <mat-form-field appearance="outline" class="md:col-span-2 w-full">
        <mat-label>Descripción</mat-label>
        <input
          matInput
          [formControl]="form.controls.descripcion"
          maxlength="200"
        />
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
export class SubCategoryDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    idCategoria: [null as number | null, Validators.required],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(200)]],
  });

  constructor(
    private ref: MatDialogRef<SubCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.subcat) {
      const s = data.subcat;
      this.form.setValue({
        idCategoria: s.idCategoria,
        nombre: s.nombre,
        descripcion: s.descripcion ?? '',
      });
    }
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const dto: SubCategoryUpsertDto = {
      idCategoria: Number(v.idCategoria),
      nombre: String(v.nombre).trim(),
      descripcion: String(v.descripcion ?? '').trim(),
    };
    this.ref.close(dto);
  }
}

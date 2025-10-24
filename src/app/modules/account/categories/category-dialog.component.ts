import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category, CategoryUpsertDto } from './categories.model';

type DialogData = { mode: 'create' | 'edit'; category?: Category };

@Component({
  selector: 'app-category-dialog',
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
      {{ data.mode === 'create' ? 'Agregar categoría' : 'Editar categoría' }}
    </h2>

    <div mat-dialog-content class="flex flex-col gap-4 pt-2">
      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Nombre</mat-label>
        <input matInput [formControl]="form.controls.nombre" maxlength="100" />
        <mat-error *ngIf="form.controls.nombre.hasError('required')">
          El nombre es obligatorio
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full p-2">
        <mat-label>Descripción</mat-label>
        <input matInput [formControl]="form.controls.descripcion" maxlength="200" />
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
export class CategoryDialogComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(200)]],
  });

  constructor(
    private ref: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.category) {
      const c = data.category;
      this.form.setValue({
        nombre: c.nombre,
        descripcion: c.descripcion ?? '',
      });
    }
  }

  close() { this.ref.close(); }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const dto: CategoryUpsertDto = {
      nombre: String(v.nombre).trim(),
      descripcion: String(v.descripcion ?? '').trim(),
    };
    this.ref.close(dto);
  }
}

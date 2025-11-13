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
      {{ data.mode === 'create' ? 'Agregar marca' : 'Editar marca' }}
    </h2>

    <div class="pt-2 p-5">
      <form [formGroup]="form" class="grid grid-cols-1 gap-4">

        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>

        <!-- PREVIEW -->
        <div class="flex justify-center">
          <img
            [src]="previewUrl"
            class="h-32 w-auto object-contain border rounded p-2"
          />
        </div>

        <!-- FILE -->
        <input type="file" accept="image/*" (change)="onFileSelected($event)" />

        <mat-form-field appearance="outline">
          <mat-label>Orden</mat-label>
          <input type="number" matInput formControlName="orden" />
        </mat-form-field>

      </form>
    </div>

    <div mat-dialog-actions class="flex justify-end gap-3 pt-4 pb-2 px-1">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="submit()">
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </div>
  `,
})
export class CarouselMarcasDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<CarouselMarcasDialogComponent>);

  selectedFile: File | null = null;
  previewUrl: string = 'assets/images/brands/place_holder.png';

  form = this.fb.group({
    nombre: ['', Validators.required],
    orden: [null as number | null],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.mode === 'edit' && data.marca) {
      this.form.patchValue({
        nombre: data.marca.nombre,
        orden: data.marca.orden,
      });

      this.previewUrl = data.marca.logoUrl || 'assets/images/brands/place_holder.png';
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) return;

    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);

    input.value = '';
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const dto: CarouselMarcaUpsertDto = {
      nombre: raw.nombre!,
      orden: raw.orden ?? null,
      file: this.selectedFile,
    };

    this.ref.close(dto);
  }
}

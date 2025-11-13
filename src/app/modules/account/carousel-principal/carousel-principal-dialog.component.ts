import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  CarouselPrincipal,
  CarouselPrincipalUpsertDto,
} from './carousel-principal.model';
import { routes } from '../../../app.routes';
import { selectableRoutes } from './carousel-principal.util';

interface CarouselPrincipalDialogData {
  mode: 'create' | 'edit';
  slide?: CarouselPrincipal;
}

@Component({
  selector: 'app-carousel-principal-dialog',
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
      {{ data.mode === 'create' ? 'Agregar slide' : 'Editar slide' }}
    </h2>

    <div class="pt-2 p-5">
      <form [formGroup]="form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- URL SOLO LECTURA -->
        <mat-form-field appearance="outline" class="w-full md:col-span-2">
          <mat-label>Imagen actual</mat-label>
          <input matInput formControlName="imagenUrl" readonly />
        </mat-form-field>

        <!-- ARCHIVO -->
        <input
          type="file"
          accept="image/*"
          class="md:col-span-2"
          (change)="onFileSelected($event)"
        />

        <!-- PREVIEW -->
        @if (previewUrl) {
        <div class="md:col-span-2">
          <img
            [src]="previewUrl"
            class="w-full max-h-64 object-contain border rounded-md"
          />
        </div>
        }

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Ruta del botón</mat-label>
          <mat-select formControlName="link">
            <mat-option *ngFor="let r of routes" [value]="r.path">
              {{ r.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full md:col-span-2">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="3" formControlName="descripcion"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Orden</mat-label>
          <input type="number" matInput formControlName="orden" />
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
export class CarouselPrincipalDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(MatDialogRef<CarouselPrincipalDialogComponent>);

  protected readonly routes = selectableRoutes;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  form = this.fb.group({
    imagenUrl: [{ value: '', disabled: true }],
    titulo: [''],
    descripcion: [''],
    link: [''],
    orden: [null as number | null],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: CarouselPrincipalDialogData
  ) {
    if (data.mode === 'edit' && data.slide) {
      this.form.patchValue({
        imagenUrl: data.slide.imagenUrl,
        titulo: data.slide.titulo,
        descripcion: data.slide.descripcion,
        link: data.slide.link,
        orden: data.slide.orden,
      });

      this.previewUrl =
        data.slide.imagenUrl || 'assets/images/main-slider/place_holder.png';
    } else {
      this.previewUrl = 'assets/images/main-slider/place_holder.png';
    }
  }

  onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.previewUrl =
        this.data.mode === 'edit'
          ? this.data.slide?.imagenUrl ||
            'assets/images/main-slider/place_holder.png'
          : 'assets/images/main-slider/place_holder.png';

      return;
    }

    this.selectedFile = file;

    if (this.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = URL.createObjectURL(file);

    this.form.patchValue({ imagenUrl: '' });

    input.value = '';
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const dto: CarouselPrincipalUpsertDto & { file?: File | null } = {
      titulo: raw.titulo ?? null,
      descripcion: raw.descripcion ?? null,
      link: raw.link ?? null,
      orden: raw.orden ?? null,
      imagenUrl: this.selectedFile ? null : this.data.slide?.imagenUrl ?? null,
      file: this.selectedFile,
    };

    this.ref.close(dto);
  }
}

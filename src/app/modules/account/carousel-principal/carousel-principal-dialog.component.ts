import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CarouselPrincipal,
  CarouselPrincipalUpsertDto,
} from './carousel-principal.model';
import { routes } from '../../../app.routes';
import { MatSelectModule } from '@angular/material/select';

interface CarouselPrincipalDialogData {
  mode: 'create' | 'edit';
  slide?: CarouselPrincipal;
}

const selectableRoutes = routes
  .filter(
    (r) =>
      r.path !== '**' && // No incluir not-found
      !r.path?.includes(':') // No incluir rutas con parámetros
  )
  .map((r) => ({
    path: '/' + r.path, // Asegura formato "/shop"
    title: r.title ?? r.path, // Usa title si existe
  }));

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
        <!-- Imagen -->
        <mat-form-field appearance="outline" class="w-full md:col-span-2">
          <mat-label>Imagen URL</mat-label>
          <input matInput formControlName="imagenUrl" />
          <mat-error *ngIf="form.controls.imagenUrl.hasError('required')">
            La imagen es obligatoria
          </mat-error>
        </mat-form-field>

        <!-- Título -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" />
        </mat-form-field>

        <!-- Link (select dinámico) -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Ruta del botón</mat-label>
          <mat-select formControlName="link">
            <mat-option *ngFor="let r of routes" [value]="r.path">
              {{ r.title }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Descripción -->
        <mat-form-field appearance="outline" class="w-full md:col-span-2">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="3" formControlName="descripcion"></textarea>
        </mat-form-field>

        <!-- Orden -->
        <mat-form-field appearance="outline" class="w-full md:col-span-1">
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

  form = this.fb.group({
    imagenUrl: ['', Validators.required],
    titulo: [''],
    descripcion: [''],
    link: [''],
    orden: [undefined as number | undefined],
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
    }
  }

  close() {
    this.ref.close();
  }

  submit() {
    if (this.form.invalid) return;
    this.ref.close(this.form.getRawValue() as CarouselPrincipalUpsertDto);
  }
}

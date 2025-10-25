import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type RatingData = {
  articulo?: string;
  idProducto?: number | null;
};

@Component({
  selector: 'app-product-rating-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2
      mat-dialog-title
      class="text-xl font-semibold text-indigo-900 border-b border-slate-200 pb-2"
    >
      ¿Qué te pareció el producto?
    </h2>

    <div mat-dialog-content class="pt-4 flex flex-col gap-6">
      <!-- Estrellas -->
      <section class="flex flex-col items-center gap-3">
        <div class="text-sm text-slate-600">
          {{
            data.articulo ? 'Estás calificando: "' + data.articulo + '"' : ''
          }}
        </div>

        <!-- +mt-3 para separarlas del borde superior -->
        <div class="flex items-center justify-center gap-3 mt-3">
          <button
            *ngFor="let i of stars; let idx = index"
            type="button"
            class="w-12 h-12 rounded-full flex items-center justify-center transition-transform
             hover:scale-110 focus:outline-none"
            [attr.aria-label]="'Puntuar con ' + (idx + 1) + ' estrellas'"
            [attr.aria-pressed]="rating === idx + 1"
            (mouseenter)="preview(idx + 1)"
            (mouseleave)="preview(0)"
            (focus)="preview(idx + 1)"
            (blur)="preview(0)"
            (click)="setRating(idx + 1)"
          >
            <mat-icon
              [ngStyle]="{
                fontSize: '38px',
                lineHeight: 1,
                display: 'block',
                verticalAlign: 'middle',
                overflow: 'visible',
                transform: 'translateY(2px)',
                color: (hover || rating) >= idx + 1 ? '#FFC107' : '#9CA3AF'
              }"
            >
              {{ (hover || rating) >= idx + 1 ? 'star' : 'star_border' }}
            </mat-icon>
          </button>
        </div>

        <div class="text-xs text-slate-500">
          {{ rating ? rating + ' de 5' : 'Elegí entre 1 y 5 estrellas' }}
        </div>

        <div
          class="text-xs text-red-600"
          *ngIf="form.controls.puntuacion.invalid && triedSubmit"
        >
          La puntuación es obligatoria.
        </div>
      </section>

      <!-- Comentario -->
      <section class="flex flex-col gap-2">
        <h3 class="text-sm font-medium text-slate-800">
          Contanos acerca del producto
        </h3>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Comentario</mat-label>
          <textarea
            matInput
            rows="6"
            maxlength="1500"
            placeholder="¿Qué te pareció el producto que compraste?"
            [formControl]="form.controls.comentario"
          ></textarea>
          <mat-hint align="end">
            {{ form.controls.comentario.value?.length || 0 }}/1500
          </mat-hint>
        </mat-form-field>
      </section>
    </div>

    <div mat-dialog-actions class="mt-2 flex justify-end gap-3">
      <button mat-stroked-button (click)="close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="submit()">
        Guardar
      </button>
    </div>
  `,
})
export class ProductRatingDialogComponent {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<ProductRatingDialogComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: RatingData) {}

  // form
  form = this.fb.group({
    puntuacion: [null as number | null, Validators.required],
    comentario: [''],
  });

  // estrellas
  stars = [1, 2, 3, 4, 5];
  rating = 0; // valor confirmado
  hover = 0; // vista previa al pasar el mouse
  triedSubmit = false;

  preview(n: number) {
    this.hover = n;
  }
  setRating(n: number) {
    this.rating = n;
    this.form.controls.puntuacion.setValue(n);
  }

  close() {
    this.ref.close();
  }

  submit() {
    this.triedSubmit = true;
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.ref.close({
      idProducto: this.data.idProducto ?? null,
      articulo: this.data.articulo ?? null,
      puntuacion: Number(v.puntuacion),
      comentario: String(v.comentario || '').trim(),
    });
  }
}

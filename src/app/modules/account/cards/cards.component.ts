import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { CardsStore } from './cards.store';

@Component({
  selector: 'app-cards',
  standalone: true,
  providers: [CardsStore],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  template: `
    <section class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Mis Tarjetas</h2>
      </header>
      <mat-divider></mat-divider>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <ng-container *ngIf="store.vm$ | async as vm">
          <!-- Formulario alta / validación -->
          <div class="rounded-lg border border-slate-200 shadow-sm bg-white p-4">
            <h2 class="text-lg font-semibold mb-2">Agregar tarjeta</h2>

            <div class="grid md:grid-cols-3 gap-4">
              <mat-form-field appearance="outline">
                <mat-label>Tipo</mat-label>
                <mat-select
                  [ngModel]="vm.form.tipo"
                  (ngModelChange)="store.setTipo($event)"
                >
                  <mat-option [value]="null" disabled>Seleccioná</mat-option>
                  <mat-option [value]="'VISA'">Visa</mat-option>
                  <mat-option [value]="'MASTERCARD'">Mastercard</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Número</mat-label>
                <input
                  matInput
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="19"
                  [ngModel]="vm.form.numero"
                  (ngModelChange)="store.setNumero($event)"
                  placeholder="4111111111111111"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>CVV</mat-label>
                <input
                  matInput
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="3"
                  [ngModel]="vm.form.codigo"
                  (ngModelChange)="store.setCodigo($event)"
                  placeholder="123"
                />
              </mat-form-field>
            </div>

            <div class="flex items-center gap-3">
              <button
                mat-raised-button
                color="primary"
                [disabled]="
                  vm.isSubmitting ||
                  !vm.form.tipo ||
                  !vm.form.numero.length ||
                  !vm.form.codigo.length
                "
                (click)="store.register()"
              >
                {{ vm.isSubmitting ? 'Guardando...' : 'Validar y guardar' }}
              </button>
              <span class="text-sm text-red-600" *ngIf="vm.error as err">{{
                err
              }}</span>
            </div>
          </div>

              <div class="p-3"></div>

          <!-- Listado -->
          <div class="rounded-lg border border-slate-200 shadow-sm bg-white p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold">Mis tarjetas</h2>
              <span class="text-sm text-gray-500" *ngIf="vm.isLoading"
                >Cargando...</span
              >
            </div>

            <div *ngIf="vm.cards as cards">
              <div *ngIf="cards.length === 0" class="text-gray-600">
                No tenés tarjetas guardadas.
              </div>

              <ul *ngIf="cards.length > 0" class="divide-y divide-gray-100">
                <li
                  *ngFor="let c of cards"
                  class="py-3 flex items-center justify-between"
                >
                  <div class="flex items-center gap-3">
                    <mat-icon>credit_card</mat-icon>
                    <div>
                      <div class="font-medium">{{ c.tipo }}</div>
                      <div class="text-sm text-gray-600">
                        {{ c.maskedNumber }}
                      </div>
                    </div>
                  </div>

                  <button
                    mat-stroked-button
                    color="warn"
                    [disabled]="vm.isSubmitting"
                    (click)="store.remove(c.idTarjeta)"
                  >
                    Eliminar
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </ng-container>
      </div>
    </section>
  `,
})
export class CardsComponent {
  protected readonly store = inject(CardsStore);
}

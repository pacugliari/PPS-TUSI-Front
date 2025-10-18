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
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

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
    SpinnerComponent,
  ],
  template: `
    @if (store.vm$ | async; as vm) {
      @if (vm.isLoading) {
        <app-spinner />
      }
      <section class="rounded-md border border-slate-200 bg-white">
        <header class="text-center py-4">
          <h2 class="text-xl font-semibold text-indigo-900">Mis Tarjetas</h2>
        </header>
        <mat-divider></mat-divider>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <!-- Formulario alta / validación -->
          <div class="rounded-lg border border-slate-200 shadow-sm bg-white p-4">
            <h2 class="text-lg font-semibold mb-2">Agregar tarjeta</h2>

            <div class="grid md:grid-cols-4 gap-4">
              <mat-form-field appearance="outline">
                <mat-label>Banco</mat-label>
                <mat-select
                  [ngModel]="vm.form.idBanco"
                  (ngModelChange)="store.setIdBanco($event)"
                >
                  <mat-option [value]="null" disabled>Seleccioná</mat-option>
                  @for (b of vm.bancos; track b.idBanco) {
                    <mat-option [value]="b.idBanco">
                      {{ b.nombre }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

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
                  maxlength="16"
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
                  !vm.form.idBanco ||
                  !vm.form.tipo ||
                  !vm.form.numero.length ||
                  !vm.form.codigo.length
                "
                (click)="store.register()"
              >
                {{ vm.isSubmitting ? 'Guardando...' : 'Validar y guardar' }}
              </button>
              @if (vm.error;as err) {
                <span class="text-sm text-red-600">{{ err }}</span>
              }
            </div>
          </div>

          <div class="p-3"></div>

          <!-- Listado -->
          <div class="rounded-lg border border-slate-200 shadow-sm bg-white p-4">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold">Mis tarjetas</h2>
              @if (vm.isLoading) {
                <span class="text-sm text-gray-500">Cargando...</span>
              }
            </div>

            @if (vm.cards.length === 0) {
              <div class="text-gray-600">No tenés tarjetas guardadas.</div>
            } @else {
              <ul class="divide-y divide-gray-100">
                @for (c of vm.cards; track c.idTarjeta) {
                  <li class="py-3 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <mat-icon>credit_card</mat-icon>
                      <div>
                        <div class="font-medium">
                          {{ c.tipo }}
                          <span
                            class="ml-2 text-xs px-2 py-0.5 rounded border border-slate-200 bg-slate-50"
                          >
                            {{ c.banco.nombre }}
                          </span>
                        </div>
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
                }
              </ul>
            }
          </div>
        </div>
      </section>
    }
  `,
})
export class CardsComponent {
  protected readonly store = inject(CardsStore);
}

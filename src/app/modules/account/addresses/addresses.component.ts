import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AddressesStore } from './addresses.store';
import { Direccion, DireccionUpsertDto } from './addresses.model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  providers: [AddressesStore],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    SpinnerComponent,
  ],
  template: `
    @if (vm$ | async; as vm) { @if(vm.isLoading){
    <app-spinner />
    }
    <div class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Mis direcciones</h2>
      </header>
      <mat-divider></mat-divider>

      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Cards -->
          @for (d of vm.direcciones; track d.idDireccion) {
          <div class="rounded-lg border border-slate-200 shadow-sm bg-white">
            <div
              class="px-4 py-2 rounded-t-lg"
              [ngClass]="
                d.principal
                  ? 'bg-green-50 text-green-700'
                  : 'bg-slate-50 text-slate-700'
              "
            >
              <div class="flex items-center justify-between">
                <span>
                  {{
                    d.principal
                      ? d.alias
                        ? d.alias + ' (principal)'
                        : 'Dirección principal'
                      : d.alias || 'Dirección'
                  }}
                </span>
                <button
                  class="p-1"
                  mat-icon-button
                  (click)="startEdit(d)"
                  aria-label="Editar"
                >
                  <mat-icon class="text-inherit">edit</mat-icon>
                </button>
              </div>
            </div>

            <div class="p-4 space-y-1 text-slate-700">
              <div>{{ d.calle }} - {{ d.numero }}</div>
              <div>Adicionales: {{ d.adicionales }}</div>
              <div>{{ d.codigoPostal }}</div>
              <div>{{ d.ciudad }}</div>
              <div>{{ d.provincia }}</div>
            </div>

            <div class="px-4 pb-4 flex gap-2">
              @if (!d.principal) {
              <button
                mat-stroked-button
                color="primary"
                (click)="setPrincipal(d.idDireccion)"
              >
                Hacer principal
              </button>
              }
              <button
                mat-stroked-button
                color="warn"
                (click)="removeDireccion(d.idDireccion)"
              >
                Eliminar
              </button>
            </div>
          </div>
          } @empty {
          <div class="mt-6 text-slate-600">Sin direcciones cargadas.</div>
          }

          <!-- Card Nueva / Editar -->
          <div class="rounded-lg border border-slate-200 shadow-sm bg-white">
            @if (!vm.isCreatingOrEditing) {
            <button
              class="w-full h-full min-h-48 flex items-center justify-center text-green-600 hover:text-green-700"
              (click)="startCreate()"
            >
              + Nueva dirección
            </button>
            } @else {
            <div class="px-4 py-2 rounded-t-lg bg-slate-50 text-slate-700">
              {{
                vm.editingId === null ? 'Nueva dirección' : 'Editar dirección'
              }}
            </div>

            <form
              class="p-4 grid grid-cols-1 gap-4"
              [formGroup]="direccionForm"
            >
              <mat-form-field appearance="outline">
                <mat-label>Calle</mat-label>
                <input matInput formControlName="calle" required />
                <mat-error
                  *ngIf="direccionForm.get('calle')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Número</mat-label>
                <input matInput formControlName="numero" required />
                <mat-error
                  *ngIf="direccionForm.get('numero')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Adicionales (piso, depto, bloque, etc.)</mat-label>
                <input matInput formControlName="adicionales" required />
                <mat-error
                  *ngIf="direccionForm.get('adicionales')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Código postal</mat-label>
                <input matInput formControlName="codigoPostal" required />
                <mat-error
                  *ngIf="
                    direccionForm.get('codigoPostal')?.hasError('required')
                  "
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Ciudad</mat-label>
                <input matInput formControlName="ciudad" required />
                <mat-error
                  *ngIf="direccionForm.get('ciudad')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Provincia</mat-label>
                <input matInput formControlName="provincia" required />
                <mat-error
                  *ngIf="direccionForm.get('provincia')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nombre de la dirección</mat-label>
                <input matInput formControlName="alias" required />
                <mat-error
                  *ngIf="direccionForm.get('alias')?.hasError('required')"
                  >Requerido</mat-error
                >
              </mat-form-field>

              <div class="flex gap-3">
                <button mat-stroked-button type="button" (click)="cancelEdit()">
                  Cancelar
                </button>
                <button
                  mat-flat-button
                  color="primary"
                  (click)="saveDireccion()"
                  [disabled]="direccionForm.invalid || vm.saving"
                >
                  {{ vm.saving ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </form>
            }
          </div>
        </div>
      </div>
    </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressesComponent {
  readonly store = inject(AddressesStore);
  private fb = inject(FormBuilder);

  readonly vm$ = this.store.vm$;

  direccionForm = this.fb.group({
    calle: ['', [Validators.required, Validators.minLength(2)]],
    numero: ['', [Validators.required]],
    adicionales: ['', [Validators.required]],
    codigoPostal: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
    provincia: ['', [Validators.required]],
    alias: ['', [Validators.required]],
  });

  ngOnInit() {
    this.store.loadDirecciones();
  }

  saveDireccion() {
    if (this.direccionForm.invalid) return;
    const payload: DireccionUpsertDto =
      this.direccionForm.getRawValue() as DireccionUpsertDto;
    this.store.saveDireccion(payload);
  }

  startCreate() {
    this.store.setEditingId(null);
    this.direccionForm.reset();
  }

  startEdit(d: Direccion) {
    this.store.setEditingId(d.idDireccion);
    this.direccionForm.reset({ ...d });
  }

  cancelEdit() {
    this.store.setEditingId(undefined);
  }

  removeDireccion(id: number) {
    this.store.deleteDireccion(id);
  }

  setPrincipal(id: number) {
    this.store.setPrincipal(id);
  }
}

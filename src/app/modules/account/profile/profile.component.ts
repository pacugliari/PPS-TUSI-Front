import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProfileStore } from './profile.store';
import { ProfileUpsertDto } from './profile.model';
import { SpinnerComponent } from "../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SpinnerComponent
],
  template: `
    @if (vm$ | async; as vm) { @if(vm.isLoading) {<app-spinner />}
    <header class="text-center py-4">
      <h2 class="text-xl font-semibold text-indigo-900">Datos Personales</h2>
    </header>
    <mat-divider></mat-divider>

    <div class="p-5">
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="grid grid-cols-12 gap-4"
      >
        <!-- Numero de cliente -->
        <mat-form-field appearance="outline" class="col-span-12 md:col-span-4">
          <mat-label>Número de Cliente</mat-label>
          <input matInput formControlName="nroCliente" readonly />
        </mat-form-field>

        <!-- Apellido y Nombre -->
        <mat-form-field appearance="outline" class="col-span-12 md:col-span-8">
          <mat-label>Apellido y Nombre</mat-label>
          <input matInput formControlName="nombre" required />
        </mat-form-field>

        <!-- Email -->
        <mat-form-field appearance="outline" class="col-span-12">
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" formControlName="email" required />
          <mat-error *ngIf="form.get('email')?.hasError('email')">
            Formato inválido
          </mat-error>
        </mat-form-field>

        <!-- Teléfono -->
        <mat-form-field appearance="outline" class="col-span-12 md:col-span-4">
          <mat-label>Número Telefónico</mat-label>
          <input matInput formControlName="telefono" required />
        </mat-form-field>

        <!-- Tipo doc -->
        <mat-form-field appearance="outline" class="col-span-12 md:col-span-4">
          <mat-label>Tipo de documento</mat-label>
          <mat-select formControlName="tipoDoc" required>
            <mat-option value="DNI">DNI</mat-option>
            <mat-option value="CUIT">CUIT</mat-option>
            <mat-option value="LE">LE</mat-option>
            <mat-option value="LC">LC</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- DNI -->
        <mat-form-field appearance="outline" class="col-span-12 md:col-span-4">
          <mat-label>DNI</mat-label>
          <input matInput formControlName="dni" required />
        </mat-form-field>

        <!-- Submit -->
        <div class="col-span-12">
          <button
            mat-raised-button
            color="primary"
            class="w-full !bg-indigo-900 hover:!bg-indigo-800"
            [disabled]="form.invalid || vm.isLoading"
          >
            Actualizar Datos
          </button>
        </div>
      </form>
    </div>
    }
  `,
  providers: [ProfileStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private store = inject(ProfileStore);

  readonly vm$ = this.store.vm$;

  form = this.fb.group({
    nroCliente: [''],
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', Validators.required],
    tipoDoc: ['', Validators.required],
    dni: ['', Validators.required],
  });

  constructor() {
    this.store.patchForm(this.form);
  }

  private buildDto(): ProfileUpsertDto {
    const v = this.form.getRawValue();
    return {
      nombre: (v.nombre ?? '').trim(),
      email: (v.email ?? '').trim(),
      telefono: (v.telefono ?? '').trim(),
      tipoDoc: (v.tipoDoc ?? '').trim(),
      dni: (v.dni?.toString() ?? '').trim(),
    };
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.store.updateProfile(this.buildDto());
  }
}

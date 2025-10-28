import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProductsStore } from './products.store';
import { Product, ProductUpsertDto } from './products.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-products',
  standalone: true,
  providers: [ProductsStore],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    SpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (store.vm$ | async; as vm) { @if(vm.isLoading){ <app-spinner />} @if
    (!vm.showForm) {
    <section class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h2 class="text-xl font-semibold text-indigo-900">Productos</h2>
      </header>
      <mat-divider></mat-divider>

      <div class="p-5 overflow-auto">
        <div class="flex items-center justify-between mb-4">
          <button mat-raised-button color="primary" (click)="onNew()">
            <mat-icon class="mr-1">add</mat-icon> Nuevo producto
          </button>
        </div>

        <div class="rounded-lg border border-slate-200 shadow-sm bg-white overflow-auto">
          <table mat-table [dataSource]="vm.products" class="min-w-[960px] w-full">
            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Producto</th>
              <td mat-cell *matCellDef="let p">
                <div class="p-2">
                  <div class="font-medium">{{ p.nombre }}</div>
                  <div class="text-xs text-slate-500">
                    {{ p.categoriaNombre || 'Cat ' + p.idCategoria }} /
                    {{ p.subcategoriaNombre || 'Sub ' + p.idSubCategoria }} /
                    {{ p.marcaNombre || 'Marca ' + p.idMarca }}
                  </div>
                  <div class="text-xs text-slate-600 line-clamp-1 md:line-clamp-2">
                    {{ p.descripcion || '—' }}
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="precio">
              <th mat-header-cell *matHeaderCellDef>Precio</th>
              <td mat-cell *matCellDef="let p" class="text-right">
                {{ p.precio | currency : 'ARS' : 'symbol-narrow' : '1.2-2' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="iva">
              <th mat-header-cell *matHeaderCellDef>IVA</th>
              <td mat-cell *matCellDef="let p" class="text-center">
                {{ p.iva }}%
              </td>
            </ng-container>

            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>Stock</th>
              <td mat-cell *matCellDef="let p" class="text-right">
                <div class="font-medium">{{ p.stockActual }}</div>
                <div class="text-xs text-slate-500">
                  min {{ p.stockMinimo }} · max {{ p.stockMaximo }} · disp {{ p.disponibilidad }}
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let p" class="text-center">
                <span
                  class="px-2 py-0.5 rounded text-xs"
                  [ngClass]="
                    p.estado === 'disponible'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  "
                >
                  {{ p.estado }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef class="text-right">Acciones</th>
              <td mat-cell *matCellDef="let p" class="text-right space-x-1">
                <a
                  mat-icon-button
                  [href]="'/product/' + p.idProducto"
                  target="_blank"
                  rel="noopener"
                  aria-label="Ver detalle"
                  matTooltip="Ver detalle y fotos"
                >
                  <mat-icon>open_in_new</mat-icon>
                </a>

                <button mat-icon-button (click)="onEdit(p)" aria-label="Editar">
                  <mat-icon>edit</mat-icon>
                </button>

                <button
                  mat-icon-button
                  color="warn"
                  (click)="store.remove(p.idProducto)"
                  aria-label="Eliminar"
                >
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols"></tr>
          </table>
        </div>

        @if (vm.products.length === 0) {
        <div class="p-4 text-slate-500">No hay productos.</div>
        }
      </div>
    </section>
    } @else {
    <section class="rounded-md border border-slate-200 bg-white">
      <header class="text-center py-4">
        <h3 class="text-lg font-semibold">
          {{ vm.selected ? 'Editar producto' : 'Nuevo producto' }}
        </h3>
      </header>
      <mat-divider></mat-divider>

      <div class="flex items-center justify-between m-4">
        <button mat-stroked-button color="primary" (click)="onBack()">
          <mat-icon class="mr-1">arrow_back</mat-icon> Volver a la lista
        </button>
      </div>

      <form
        class="p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        [formGroup]="form"
        (ngSubmit)="onSubmit(vm.selected)"
      >
        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select
            formControlName="idCategoria"
            (selectionChange)="onCategoryChange($event.value, vm.options?.subcategorias || [])"
          >
            @for (c of vm.options?.categorias || []; track c.idCategoria) {
            <mat-option [value]="c.idCategoria">{{ c.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Subcategoría</mat-label>
          <mat-select formControlName="idSubCategoria">
            @for (s of subsByCat(vm.options?.subcategorias || [], form.get('idCategoria')!.value); track s.idSubCategoria) {
            <mat-option [value]="s.idSubCategoria">{{ s.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Marca</mat-label>
          <mat-select formControlName="idMarca">
            @for (m of vm.options?.marcas || []; track m.idMarca) {
            <mat-option [value]="m.idMarca">{{ m.nombre }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="md:col-span-1">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" maxlength="180" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Precio</mat-label>
          <input matInput type="number" min="0" step="0.01" formControlName="precio" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>IVA (%)</mat-label>
          <input matInput type="number" min="0" max="27" step="0.5" formControlName="iva" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="md:col-span-2">
          <mat-label>Descripción</mat-label>
          <textarea matInput rows="3" formControlName="descripcion"></textarea>
        </mat-form-field>

        <div class="md:col-span-2 space-y-4 mb-3">
          <div>
            <div class="text-sm font-medium mb-2">Fotos actuales</div>
            @if(currentFotos.length === 0){
            <div class="text-xs text-slate-500">Este producto todavía no tiene fotos.</div>
            } @else {
            <div class="flex items-center gap-3 flex-wrap">
              @for (url of currentFotos; track url) {
              <a
                class="inline-flex items-center justify-center h-10 w-10 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200"
                [href]="url"
                target="_blank"
                rel="noopener"
                matTooltip="Abrir foto en nueva pestaña"
                aria-label="Abrir foto"
              >
                <mat-icon>image</mat-icon>
              </a>
              }
            </div>
            }
          </div>

          <mat-divider></mat-divider>

          <div>
            <label class="text-sm font-medium block mb-2">Adjuntar nuevas fotos (máx. 3)</label>
            <input
              type="file"
              (change)="onFilesSelected($event)"
              accept="image/*"
              multiple
              class="block w-full text-sm"
              aria-label="Seleccionar archivos de imagen"
            />
            @if(previewUrls.length){
            <div class="mt-3">
              <div class="text-xs text-slate-600 mb-2">
                {{ selectedFiles.length }} archivo(s) listo(s) para subir:
              </div>
              <div class="flex items-center gap-3 flex-wrap">
                @for (p of previewUrls; track $index; let i = $index) {
                <div class="flex items-center gap-2">
                  <a
                    class="inline-flex items-center justify-center h-10 w-10 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    [href]="p"
                    target="_blank"
                    rel="noopener"
                    matTooltip="Abrir previsualización"
                    aria-label="Abrir previsualización"
                  >
                    <mat-icon>image</mat-icon>
                  </a>
                  <button
                    type="button"
                    mat-icon-button
                    color="warn"
                    (click)="removeSelected(i)"
                    aria-label="Quitar archivo"
                    matTooltip="Quitar este archivo"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                }
              </div>
            </div>
            }
          </div>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Stock mínimo</mat-label>
          <input matInput type="number" min="0" step="1" formControlName="stockMinimo" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Stock máximo</mat-label>
          <input matInput type="number" min="0" step="1" formControlName="stockMaximo" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Stock actual</mat-label>
          <input matInput type="number" min="0" step="1" formControlName="stockActual" />
        </mat-form-field>

        <div class="md:col-span-2">
          <div class="flex items-center justify-between mb-2">
            <div class="font-medium">Propiedades (hasta 5)</div>
            <button type="button" mat-stroked-button (click)="addProp()" [disabled]="props.length >= 5">
              <mat-icon class="mr-1">add</mat-icon> Agregar
            </button>
          </div>

          <div formArrayName="propiedades" class="grid gap-3">
            @for (ctrl of props.controls; track $index; let i = $index) {
            <div class="grid grid-cols-1 md:grid-cols-5 gap-2" [formGroupName]="i">
              <mat-form-field appearance="outline" class="md:col-span-2">
                <mat-label>Característica</mat-label>
                <mat-select formControlName="idCaracteristica">
                  @for (c of vm.options?.caracteristicas || []; track c.idCaracteristica) {
                  <mat-option [value]="c.idCaracteristica">{{ c.descripcion }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="md:col-span-3">
                <mat-label>Valor</mat-label>
                <input matInput formControlName="valor" />
              </mat-form-field>

              <div class="md:col-span-5 text-right">
                <button type="button" mat-icon-button color="warn" (click)="removeProp(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            }
          </div>
        </div>

        <div class="md:col-span-2 text-right mt-2">
          <button mat-raised-button color="primary" [disabled]="form.invalid || vm.isLoading">
            {{ vm.selected ? 'Guardar cambios' : 'Crear producto' }}
          </button>
        </div>
      </form>
    </section>
    } }
  `,
})
export class ProductsComponent {
  protected store = inject(ProductsStore);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  cols = ['nombre', 'precio', 'iva', 'stock', 'estado', 'acciones'];

  currentFotos: string[] = [];
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  form = this.fb.group({
    idCategoria: [null as number | null, Validators.required],
    idSubCategoria: [null as number | null, Validators.required],
    idMarca: [null as number | null, Validators.required],
    nombre: ['', [Validators.required, Validators.maxLength(180)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    descripcion: [''],
    iva: [21, [Validators.required, Validators.min(0), Validators.max(27)]],
    fotosRaw: [''],
    stockMinimo: [0, [Validators.required, Validators.min(0)]],
    stockMaximo: [0, [Validators.required, Validators.min(0)]],
    stockActual: [0, [Validators.required, Validators.min(0)]],
    propiedades: this.fb.array<FormGroup>([]),
  });

  get props(): FormArray<FormGroup> {
    return this.form.get('propiedades') as FormArray<FormGroup>;
  }

  subsByCat(
    allSubs: Array<{ idSubCategoria: number; idCategoria: number; nombre: string }>,
    idCat: number | null
  ) {
    return Array.isArray(allSubs) ? (idCat ? allSubs.filter((s) => s.idCategoria === idCat) : allSubs) : [];
  }

  onCategoryChange(
    idCat: number | null,
    allSubs: Array<{ idSubCategoria: number; idCategoria: number; nombre: string }>
  ) {
    const sub = this.form.get('idSubCategoria')!.value as number | null;
    if (!sub) return;
    const stillValid = Array.isArray(allSubs)
      ? allSubs.some((s) => s.idSubCategoria === sub && s.idCategoria === idCat)
      : false;
    if (!stillValid) this.form.get('idSubCategoria')!.setValue(null);
  }

  onNew() {
    this.resetForm();
    this.store.openCreate();
  }

  onEdit(p: Product) {
    this.fillForm(p);
    this.store.openEdit(p);
  }

  onBack() {
    this.resetForm();
    this.store.backToList();
  }

  private revokeAllPreviews() {
    this.previewUrls.forEach((u) => URL.revokeObjectURL(u));
    this.previewUrls = [];
  }

  onFilesSelected(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    if (files.length > 3) {
      this.alertService.showError(['Máximo 3 fotos']);
      this.selectedFiles = [];
      this.revokeAllPreviews();
      input.value = '';
      return;
    }
    this.revokeAllPreviews();
    this.selectedFiles = files;
    this.previewUrls = files.map((f) => URL.createObjectURL(f));
  }

  removeSelected(index: number) {
    if (index < 0 || index >= this.selectedFiles.length) return;
    URL.revokeObjectURL(this.previewUrls[index]);
    this.previewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  openUrl(url: string) {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  get selectedFilesLabel(): string {
    return this.selectedFiles.map((f) => f.name).join(', ');
  }

  onSubmit(selected: Product | null) {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const fotos = (v.fotosRaw || '')
      .split('\n')
      .map((s: string) => s.trim())
      .filter((s: string) => !!s)
      .slice(0, 3);

    const dto: ProductUpsertDto = {
      idCategoria: Number(v.idCategoria),
      idSubCategoria: Number(v.idSubCategoria),
      idMarca: Number(v.idMarca),
      nombre: String(v.nombre).trim(),
      precio: Number(v.precio),
      descripcion: v.descripcion?.trim() || null,
      fotos,
      iva: Number(v.iva ?? 21),
      stockMinimo: Number(v.stockMinimo ?? 0),
      stockMaximo: Number(v.stockMaximo ?? 0),
      stockActual: Number(v.stockActual ?? 0),
      propiedades: (this.props.value || []).map((p: any) => ({
        idCaracteristica: Number(p.idCaracteristica),
        valor: String(p.valor ?? '').trim(),
      })),
    };

    this.store.save({
      id: selected?.idProducto,
      dto,
      files: this.selectedFiles,
    });
  }

  resetForm() {
    this.form.reset({
      idCategoria: null,
      idSubCategoria: null,
      idMarca: null,
      nombre: '',
      precio: 0,
      descripcion: '',
      iva: 21,
      fotosRaw: '',
      stockMinimo: 0,
      stockMaximo: 0,
      stockActual: 0,
    });
    this.props.clear();
    this.currentFotos = [];
    this.selectedFiles = [];
    this.revokeAllPreviews();
  }

  fillForm(p: Product) {
    this.form.patchValue({
      idCategoria: p.idCategoria,
      idSubCategoria: p.idSubCategoria,
      idMarca: p.idMarca,
      nombre: p.nombre,
      precio: p.precio,
      descripcion: p.descripcion ?? '',
      iva: p.iva,
      fotosRaw: (p.fotos || []).join('\n'),
      stockMinimo: p.stockMinimo,
      stockMaximo: p.stockMaximo,
      stockActual: p.stockActual,
    });

    this.props.clear();
    (p.propiedades || []).forEach((pr) => {
      this.props.push(
        this.fb.group({
          idCaracteristica: [pr.idCaracteristica, Validators.required],
          valor: [pr.valor, Validators.required],
        })
      );
    });

    this.currentFotos = Array.isArray(p.fotos) ? p.fotos.slice(0, 3) : [];
    this.selectedFiles = [];
    this.revokeAllPreviews();
  }

  addProp() {
    this.props.push(
      this.fb.group({
        idCaracteristica: [null, Validators.required],
        valor: ['', Validators.required],
      })
    );
  }

  removeProp(i: number) {
    if (i < 0 || i >= this.props.length) return;
    this.props.removeAt(i);
  }

  ngOnDestroy(): void {
    this.revokeAllPreviews();
  }
}

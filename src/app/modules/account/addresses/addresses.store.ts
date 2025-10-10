import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, exhaustMap, of, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AddressesApiService } from './api.service';
import { Direccion, DireccionUpsertDto } from './addresses.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/api-response.model';

export interface AddressesState {
  isLoading: boolean;
  saving: boolean;
  direcciones: Direccion[];
  editingId: number | null | undefined; // undefined=inactivo, null=creando, number=editando
  errors: ApiError | null;
}

const initialState: AddressesState = {
  isLoading: false,
  saving: false,
  direcciones: [],
  editingId: undefined,
  errors: null,
};

@Injectable()
export class AddressesStore extends ComponentStore<AddressesState> {
  constructor(
    private readonly api: AddressesApiService,
    private readonly alertService: AlertService
  ) {
    super(initialState);
  }

  // --------- UPDATERS ----------
  readonly setDirecciones = this.updater<Direccion[]>((state, direcciones) => ({
    ...state,
    direcciones,
  }));

  readonly setEditingId = this.updater<number | null | undefined>(
    (state, editingId) => ({ ...state, editingId })
  );

  readonly setSaving = this.updater<boolean>((state, saving) => ({
    ...state,
    saving,
  }));

  // --------- EFFECTS ----------
  readonly loadDirecciones = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.getDirecciones().pipe(
          tapResponse({
            next: (res) => {
              this.setDirecciones((res?.payload ?? []).map(Direccion.adapt));
            },
            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                (Array.isArray(errors) ? errors : [errors]).flatMap((err) =>
                  Object.values(err)
                )
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly saveDireccion = this.effect<DireccionUpsertDto>(($) =>
    $.pipe(
      tap(() => this.setSaving(true)),
      exhaustMap((payload) =>
        this.select((s) => s.editingId).pipe(
          exhaustMap((editingId) => {
            if (editingId === null) {
              return this.api.createDireccion(payload);
            } else if (typeof editingId === 'number') {
              return this.api.updateDireccion(editingId, payload);
            } else {
              return of(null);
            }
          }),
          tapResponse({
            next: () => {
              this.setEditingId(undefined);
              this.loadDirecciones();
            },
            error: (err) => {
              console.error(err);
              this.alertService.showError(['Error guardando dirección']);
            },
            finalize: () => this.setSaving(false),
          })
        )
      )
    )
  );

  readonly deleteDireccion = this.effect<number>(($) =>
    $.pipe(
      exhaustMap((id) =>
        this.api.deleteDireccion(id).pipe(
          tapResponse({
            next: () => this.loadDirecciones(),
            error: (err) => {
              console.error(err);
              this.alertService.showError(['Error eliminando dirección']);
            },
          })
        )
      )
    )
  );

  readonly setPrincipal = this.effect<number>(($) =>
    $.pipe(
      exhaustMap((id) =>
        this.api.setDireccionPrincipal(id).pipe(
          tapResponse({
            next: () => this.loadDirecciones(),
            error: (err) => {
              console.error(err);
              this.alertService.showError(['Error marcando como principal']);
            },
          })
        )
      )
    )
  );

  // --------- VIEW MODEL SELECTOR ----------
  readonly vm$ = this.select((state) => ({
    isLoading: state.isLoading,
    saving: state.saving,
    direcciones: state.direcciones,
    editingId: state.editingId,
    errors: state.errors,
    isCreatingOrEditing: state.editingId !== undefined,
  }));
}

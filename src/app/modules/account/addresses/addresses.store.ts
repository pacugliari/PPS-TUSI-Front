import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, forkJoin, of, tap, withLatestFrom } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AddressesApiService } from './api.service';
import { Direccion, DireccionUpsertDto, Zona } from './addresses.model';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';

export interface AddressesState {
  isLoading: boolean;
  saving: boolean;
  direcciones: Direccion[];
  zonas: Zona[];
  editingId: number | null | undefined;
  errors: ApiError | null;
}

const initialState: AddressesState = {
  isLoading: false,
  saving: false,
  direcciones: [],
  zonas: [],
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

  readonly setZonas = this.updater<Zona[]>((state, zonas) => ({
    ...state,
    zonas,
  }));

  readonly setEditingId = this.updater<number | null | undefined>(
    (state, editingId) => ({
      ...state,
      editingId,
    })
  );

  readonly setSaving = this.updater<boolean>((state, saving) => ({
    ...state,
    saving,
  }));

  // Helpers optimistas
  private readonly addOrReplaceDireccion = this.updater<Direccion>((s, d) => {
    const idx = s.direcciones.findIndex((x) => x.idDireccion === d.idDireccion);
    const direcciones = [...s.direcciones];
    if (idx >= 0) direcciones[idx] = d;
    else direcciones.unshift(d);
    return { ...s, direcciones };
  });

  private readonly removeDireccionById = this.updater<number>((s, id) => ({
    ...s,
    direcciones: s.direcciones.filter((x) => x.idDireccion !== id),
  }));

  private readonly markPrincipal = this.updater<number>((s, id) => ({
    ...s,
    direcciones: s.direcciones.map((x) => ({
      ...x,
      principal: x.idDireccion === id,
    })),
  }));

  // --------- EFFECTS ----------
  readonly loadData = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        forkJoin({
          direcciones: this.api.getDirecciones(),
          zonas: this.api.getZonas(),
        }).pipe(
          tapResponse({
            next: ({ direcciones, zonas }) => {
              this.setDirecciones(direcciones?.payload ?? []);
              this.setZonas(zonas?.payload ?? []);
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
      withLatestFrom(this.select((s) => s.editingId)),
      exhaustMap(([payload, editingId]) => {
        if (editingId === null) {
          return this.api.createDireccion(payload).pipe(
            tapResponse({
              next: (res) => {
                const created = res?.payload as Direccion;
                this.addOrReplaceDireccion(created);
                this.setEditingId(undefined);
              },
              error: (err) => {
                console.error(err);
                this.alertService.showError(['Error guardando dirección']);
              },
              finalize: () => this.setSaving(false),
            })
          );
        } else if (typeof editingId === 'number') {
          return this.api.updateDireccion(editingId, payload).pipe(
            tapResponse({
              next: (res) => {
                const updated = res?.payload as Direccion;
                this.addOrReplaceDireccion(updated);
                this.setEditingId(undefined);
              },
              error: (err) => {
                console.error(err);
                this.alertService.showError(['Error guardando dirección']);
              },
              finalize: () => this.setSaving(false),
            })
          );
        } else {
          this.setSaving(false);
          return of(null);
        }
      })
    )
  );

  // Eliminar (optimista con rollback)
  readonly deleteDireccion = this.effect<number>(($) =>
    $.pipe(
      withLatestFrom(this.select((s) => s.direcciones)),
      exhaustMap(([id, prev]) => {
        this.removeDireccionById(id);
        return this.api.deleteDireccion(id).pipe(
          tapResponse({
            next: () => {},
            error: (err) => {
              console.error(err);
              this.alertService.showError(['Error eliminando dirección']);
              this.setDirecciones(prev);
            },
          })
        );
      })
    )
  );

  readonly setPrincipal = this.effect<number>(($) =>
    $.pipe(
      withLatestFrom(this.select((s) => s.direcciones)),
      exhaustMap(([id, prev]) => {
        this.markPrincipal(id);
        return this.api.setDireccionPrincipal(id).pipe(
          tapResponse({
            next: (res) => {
              const updated = res?.payload as Direccion | undefined;
              if (updated) this.addOrReplaceDireccion(updated);
            },
            error: (err) => {
              console.error(err);
              this.alertService.showError(['Error marcando como principal']);
              this.setDirecciones(prev);
            },
          })
        );
      })
    )
  );

  // --------- VIEW MODEL ----------
  readonly vm$ = this.select((state) => ({
    isLoading: state.isLoading,
    saving: state.saving,
    direcciones: state.direcciones,
    zonas: state.zonas,
    editingId: state.editingId,
    errors: state.errors,
    isCreatingOrEditing: state.editingId !== undefined,
  }));
}

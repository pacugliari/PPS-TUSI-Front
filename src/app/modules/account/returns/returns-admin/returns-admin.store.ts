import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { ReturnsAdminApiService } from './api.service';
import { Return } from '../return.model';
import { ApiError } from '../../../../shared/models/api-response.model';
import { AlertService } from '../../../../shared/alert/alert.service';

export interface ReturnsAdminState {
  isLoading: boolean;
  devoluciones: Return[];
  errors: ApiError | null;
}

const initialState: ReturnsAdminState = {
  isLoading: false,
  devoluciones: [],
  errors: null,
};

@Injectable()
export class ReturnsAdminStore extends ComponentStore<ReturnsAdminState> {
  private readonly api = inject(ReturnsAdminApiService);
  private readonly alertService = inject(AlertService);

  constructor() {
    super(initialState);
    this.loadDevoluciones();
  }

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    devoluciones: s.devoluciones,
  }));

  readonly loadDevoluciones = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.getDevoluciones().pipe(
          tapResponse({
            next: (res) => this.patchState({ devoluciones: res.payload ?? [] }),
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly aprobar = this.effect<number>((id$) =>
    id$.pipe(
      exhaustMap((id) =>
        this.api.aprobar(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.loadDevoluciones();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
          })
        )
      )
    )
  );

  readonly rechazar = this.effect<number>((id$) =>
    id$.pipe(
      exhaustMap((id) =>
        this.api.rechazar(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.loadDevoluciones();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
          })
        )
      )
    )
  );

  readonly confirmar = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      exhaustMap((id) =>
        this.api.confirmar(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.loadDevoluciones();
            },
            error: () => {
              this.patchState({ isLoading: false });
            },
          })
        )
      )
    )
  );
}

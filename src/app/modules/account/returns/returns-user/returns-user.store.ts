import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { ReturnsApiService } from './api.service';
import { ApiError } from '../../../../shared/models/api-response.model';
import { Return } from '../return.model';
import { AlertService } from '../../../../shared/alert/alert.service';

export interface ReturnsState {
  isLoading: boolean;
  devoluciones: Return[];
  errors: ApiError | null;
}

const initialState: ReturnsState = {
  isLoading: false,
  devoluciones: [],
  errors: null,
};

@Injectable()
export class ReturnsStore extends ComponentStore<ReturnsState> {
  private readonly api = inject(ReturnsApiService);
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
}

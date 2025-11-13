import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  CarouselPrincipal,
  CarouselPrincipalUpsertDto,
} from './carousel-principal.model';

import { MatDialog } from '@angular/material/dialog';
import { CarouselPrincipalDialogComponent } from './carousel-principal-dialog.component';
import { tap, switchMap, filter, exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { CarouselPrincipalApiService } from './api.service';

export interface CarouselPrincipalState {
  isLoading: boolean;
  slides: CarouselPrincipal[];
  errors: ApiError | null;
}

const initialState: CarouselPrincipalState = {
  isLoading: false,
  slides: [],
  errors: null,
};

@Injectable()
export class CarouselPrincipalStore extends ComponentStore<CarouselPrincipalState> {
  private readonly api = inject(CarouselPrincipalApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select(({ isLoading, slides }) => ({
    isLoading,
    slides,
  }));

  constructor() {
    super(initialState);
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (slides) => this.patchState({ slides, isLoading: false }),
            error: (errors: ApiError) =>
              this.patchState({ isLoading: false, errors }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      switchMap(() =>
        this.dialog
          .open(CarouselPrincipalDialogComponent, {
            data: { mode: 'create' } as const,
            width: 'auto',
          })
          .afterClosed()
      ),
      filter(
        (dto): dto is CarouselPrincipalUpsertDto & { file?: File | null } =>
          !!dto
      ),
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap((dto) =>
        this.api.create(dto).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly openEdit = this.effect<CarouselPrincipal>((slide$) =>
    slide$.pipe(
      switchMap((slide) =>
        this.dialog
          .open(CarouselPrincipalDialogComponent, {
            data: { mode: 'edit', slide } as const,
            width: 'auto',
          })
          .afterClosed()
          .pipe(
            filter(
              (dto): dto is CarouselPrincipalUpsertDto & { file?: File | null } =>
                !!dto
            ),
            tap((dto) =>
              this.update({
                id: slide.idCarruselPrincipal,
                dto,
              })
            )
          )
      )
    )
  );

  readonly update = this.effect<{
    id: number;
    dto: CarouselPrincipalUpsertDto & { file?: File | null };
  }>((in$) =>
    in$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(({ id, dto }) =>
        this.api.update(id, dto).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly remove = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap((id) =>
        this.api.delete(id).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );
}

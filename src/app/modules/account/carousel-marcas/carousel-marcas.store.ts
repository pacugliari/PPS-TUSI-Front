import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { CarouselMarca, CarouselMarcaUpsertDto } from './carousel-marcas.model';
import { CarouselMarcasApiService } from './api.service';
import { MatDialog } from '@angular/material/dialog';
import { CarouselMarcasDialogComponent } from './carousel-marcas-dialog.component';
import { tap, switchMap, filter, exhaustMap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';

export interface CarouselMarcasState {
  isLoading: boolean;
  marcas: CarouselMarca[];
  errors: ApiError | null;
}

const initialState: CarouselMarcasState = {
  isLoading: false,
  marcas: [],
  errors: null,
};

@Injectable()
export class CarouselMarcasStore extends ComponentStore<CarouselMarcasState> {
  private readonly api = inject(CarouselMarcasApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select(({ isLoading, marcas }) => ({
    isLoading,
    marcas,
  }));

  constructor() {
    super(initialState);
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (marcas) => this.patchState({ marcas, isLoading: false }),
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors, isLoading: false });
            },
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      switchMap(() =>
        this.dialog
          .open(CarouselMarcasDialogComponent, {
            data: { mode: 'create' },
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is CarouselMarcaUpsertDto => !!dto),
      tap(() => this.patchState({ isLoading: true })),
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

  readonly openEdit = this.effect<CarouselMarca>((marca$) =>
    marca$.pipe(
      switchMap((marca) =>
        this.dialog
          .open(CarouselMarcasDialogComponent, {
            data: { mode: 'edit', marca },
            width: 'auto',
          })
          .afterClosed()
          .pipe(
            filter((dto): dto is CarouselMarcaUpsertDto => !!dto),
            tap((dto) => this.update({ id: marca.idCarruselMarcas, dto }))
          )
      )
    )
  );

  readonly update = this.effect<{ id: number; dto: CarouselMarcaUpsertDto }>(
    (in$) =>
      in$.pipe(
        tap(() => this.patchState({ isLoading: true })),
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
      tap(() => this.patchState({ isLoading: true })),
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

import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Feature, FeatureUpsertDto } from './features.model';
import { FeatureDialogComponent } from './feature-dialog.component';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { FeaturesApiService } from './api.service';

interface FeaturesState {
  isLoading: boolean;
  isSubmitting: boolean;
  features: Feature[];
  errors: ApiError | null;
}

@Injectable()
export class FeaturesStore extends ComponentStore<FeaturesState> {
  private readonly api = inject(FeaturesApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    isSubmitting: s.isSubmitting,
    features: s.features,
    error: s.errors,
  }));

  constructor() {
    super({
      isLoading: false,
      isSubmitting: false,
      features: [],
      errors: null,
    });
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (features) => this.patchState({ features }),
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      switchMap(() =>
        this.dialog
          .open(FeatureDialogComponent, {
            data: { mode: 'create' } as const,
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is FeatureUpsertDto => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((dto) =>
        this.api.create(dto).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openEdit = this.effect<Feature>((feat$) =>
    feat$.pipe(
      switchMap((feature) =>
        this.dialog
          .open(FeatureDialogComponent, {
            data: { mode: 'edit', feature } as const,
            width: 'auto',
          })
          .afterClosed()
          .pipe(
            filter((dto): dto is FeatureUpsertDto => !!dto),
            tap((dto) => this.update({ id: feature.idCaracteristica, dto }))
          )
      )
    )
  );

  readonly update = this.effect<{ id: number; dto: FeatureUpsertDto }>(
    (input$) =>
      input$.pipe(
        tap(() => this.patchState({ isSubmitting: true, errors: null })),
        exhaustMap(({ id, dto }) =>
          this.api.update(id, dto).pipe(
            tapResponse({
              next: (res) => {
                this.alertService.showSuccess(res.message);
                this.load();
              },
              error: (errors: ApiError) => {
                this.alertService.showError(
                  errors.flatMap((e) => Object.values(e))
                );
                this.patchState({ errors });
              },
              finalize: () => this.patchState({ isSubmitting: false }),
            })
          )
        )
      )
  );

  readonly remove = this.effect<number>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((id) =>
        this.api.remove(id).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((e) => Object.values(e))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );
}

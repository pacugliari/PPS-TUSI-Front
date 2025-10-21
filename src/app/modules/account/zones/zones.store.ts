import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, switchMap, tap, withLatestFrom } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Zone, ZoneUpsertDto } from './zones.model';
import { ZoneDialogComponent } from './zone-dialog.component';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { ZonesApiService } from './api.service';

export interface ZonesState {
  isLoading: boolean;
  isSubmitting: boolean;
  zones: Zone[];
  errors: ApiError | null;
}

const initialState: ZonesState = {
  isLoading: false,
  isSubmitting: false,
  zones: [],
  errors: null,
};

@Injectable()
export class ZonesStore extends ComponentStore<ZonesState> {
  private readonly api = inject(ZonesApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly zones$ = this.select((s) => s.zones);
  readonly isLoading$ = this.select((s) => s.isLoading);
  readonly isSubmitting$ = this.select((s) => s.isSubmitting);

  readonly vm$ = this.select(({ isLoading, zones }) => ({ isLoading, zones }));

  constructor() {
    super(initialState);
    this.load();
  }

  readonly load = this.effect<void>((tr$) =>
    tr$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (zones) => this.patchState({ zones, isLoading: false }),
            error: (err: any) =>
              this.patchState({ isLoading: false, errors: err }),
          })
        )
      )
    )
  );

  readonly create = this.effect<ZoneUpsertDto>((dto$) =>
    dto$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
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
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly update = this.effect<{ idZona: number; dto: ZoneUpsertDto }>((in$) =>
    in$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(({ idZona, dto }) =>
        this.api.update(idZona, dto).pipe(
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
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      switchMap(() =>
        this.dialog
          .open(ZoneDialogComponent, {
            data: { mode: 'create' } as const,
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is ZoneUpsertDto => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((dto) =>
        this.api.create(dto).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openEdit = this.effect<Zone>((zone$) =>
    zone$.pipe(
      switchMap((zone) =>
        this.dialog
          .open(ZoneDialogComponent, {
            data: { mode: 'edit', zone } as const,
            width: 'auto',
          })
          .afterClosed()
          .pipe(withLatestFrom(this.select(() => zone.idZona)))
      ),
      filter(([dto]) => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(([dto, id]) =>
        this.api.update(id as number, dto as ZoneUpsertDto).pipe(
          tapResponse({
            next: (response) => {
              this.alertService.showSuccess(response.message);
              this.load();
            },
            error: (errors: ApiError) => {
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
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

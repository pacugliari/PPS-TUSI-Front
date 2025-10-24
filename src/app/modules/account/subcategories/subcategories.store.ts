// subcategories.store.ts
import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import {
  exhaustMap,
  filter,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';
import {
  SubCategory,
  SubCategoryUpsertDto,
  SimpleCategory,
} from './subcategories.model';
import { SubCategoryDialogComponent } from './subcategory-dialog.component';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { SubCategoriesApiService } from './api.service';

interface SubCategoriesState {
  isLoading: boolean;
  isSubmitting: boolean;
  subcats: SubCategory[];
  categorias: SimpleCategory[];
  errors: ApiError | null;
}

@Injectable()
export class SubCategoriesStore extends ComponentStore<SubCategoriesState> {
  private readonly api = inject(SubCategoriesApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    isSubmitting: s.isSubmitting,
    subcats: s.subcats,
    categorias: s.categorias,
    error: s.errors,
  }));

  constructor() {
    super({
      isLoading: false,
      isSubmitting: false,
      subcats: [],
      categorias: [],
      errors: null,
    });
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        forkJoin({
          subcats: this.api.list(),
          options: this.api.options(),
        }).pipe(
          tapResponse({
            next: ({ subcats, options }) =>
              this.patchState({
                subcats,
                categorias: options.categorias ?? [],
              }),
            error: (errors: ApiError) => this.patchState({ errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly openCreate = this.effect<void>((o$) =>
    o$.pipe(
      withLatestFrom(this.select((s) => s.categorias)),
      switchMap(([_, categorias]) =>
        this.dialog
          .open(SubCategoryDialogComponent, {
            data: { mode: 'create', categorias },
            width: 'auto',
          })
          .afterClosed()
      ),
      filter((dto): dto is SubCategoryUpsertDto => !!dto),
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

  readonly openEdit = this.effect<SubCategory>((subcat$) =>
    subcat$.pipe(
      withLatestFrom(this.select((s) => s.categorias)),
      switchMap(([subcat, categorias]) =>
        this.dialog
          .open(SubCategoryDialogComponent, {
            data: { mode: 'edit', subcat, categorias },
            width: 'auto',
          })
          .afterClosed()
          .pipe(withLatestFrom(this.select(() => subcat.idSubCategoria)))
      ),
      filter(([dto]) => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(([dto, id]) =>
        this.api.update(id as number, dto as SubCategoryUpsertDto).pipe(
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

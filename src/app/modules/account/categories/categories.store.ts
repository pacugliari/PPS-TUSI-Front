import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Category, CategoryUpsertDto } from './categories.model';
import { CategoryDialogComponent } from './category-dialog.component';
import { AlertService } from '../../../shared/alert/alert.service';
import { ApiError } from '../../../shared/models/api-response.model';
import { CategoriesApiService } from './api.service';

interface CategoriesState {
  isLoading: boolean;
  isSubmitting: boolean;
  categories: Category[];
  errors: ApiError | null;
}

@Injectable()
export class CategoriesStore extends ComponentStore<CategoriesState> {
  private readonly api = inject(CategoriesApiService);
  private readonly dialog = inject(MatDialog);
  private readonly alertService = inject(AlertService);

  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    isSubmitting: s.isSubmitting,
    categories: s.categories,
    error: s.errors,
  }));

  constructor() {
    super({ isLoading: false, isSubmitting: false, categories: [], errors: null });
    this.load();
  }

  readonly load = this.effect<void>((o$) =>
    o$.pipe(
      tap(() => this.patchState({ isLoading: true, errors: null })),
      exhaustMap(() =>
        this.api.list().pipe(
          tapResponse({
            next: (categories) => this.patchState({ categories }),
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
          .open(CategoryDialogComponent, { data: { mode: 'create' } as const, width: 'auto' })
          .afterClosed()
      ),
      filter((dto): dto is CategoryUpsertDto => !!dto),
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap((dto) =>
        this.api.create(dto).pipe(
          tapResponse({
            next: (res) => { this.alertService.showSuccess(res.message); this.load(); },
            error: (errors: ApiError) => {
              this.alertService.showError(errors.flatMap((e) => Object.values(e)));
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );

  readonly openEdit = this.effect<Category>((cat$) =>
    cat$.pipe(
      switchMap((category) =>
        this.dialog
          .open(CategoryDialogComponent, { data: { mode: 'edit', category } as const, width: 'auto' })
          .afterClosed()
          .pipe(filter((dto): dto is CategoryUpsertDto => !!dto), tap((dto) => this.update({ id: category.idCategoria, dto })))
      )
    )
  );

  readonly update = this.effect<{ id: number; dto: CategoryUpsertDto }>((input$) =>
    input$.pipe(
      tap(() => this.patchState({ isSubmitting: true, errors: null })),
      exhaustMap(({ id, dto }) =>
        this.api.update(id, dto).pipe(
          tapResponse({
            next: (res) => { this.alertService.showSuccess(res.message); this.load(); },
            error: (errors: ApiError) => {
              this.alertService.showError(errors.flatMap((e) => Object.values(e)));
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
            next: (res) => { this.alertService.showSuccess(res.message); this.load(); },
            error: (errors: ApiError) => {
              this.alertService.showError(errors.flatMap((e) => Object.values(e)));
              this.patchState({ errors });
            },
            finalize: () => this.patchState({ isSubmitting: false }),
          })
        )
      )
    )
  );
}

import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { exhaustMap, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ProfileModel, ProfileUpsertDto } from './profile.model';
import { ApiError } from '../../../shared/models/api-response.model';
import { ProfileApiService } from './api.service';
import { FormGroup } from '@angular/forms';

export interface ProfileState {
  isLoading: boolean;
  profile: ProfileModel | null;
  errors: ApiError | null;
}

const initialState: ProfileState = {
  isLoading: false,
  profile: null,
  errors: null,
};

@Injectable()
export class ProfileStore extends ComponentStore<ProfileState> {
  private readonly api = inject(ProfileApiService);

  constructor() {
    super(initialState);
    this.loadProfile();
  }

  readonly vm$ = this.select(({ isLoading, profile, errors }) => ({
    isLoading,
    profile,
    errors,
  }));

  readonly patchForm = this.effect<FormGroup>((form$) =>
    form$.pipe(
      switchMap((form) =>
        this.vm$.pipe(
          tap(({ profile }) => {
            if (profile) form.patchValue(profile);
          })
        )
      )
    )
  );

  readonly loadProfile = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      exhaustMap(() =>
        this.api.getProfile().pipe(
          tapResponse({
            next: (profile) => this.patchState({ profile }),
            error: (errors: ApiError) =>
              this.patchState({ profile: null, errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );

  readonly updateProfile = this.effect<ProfileUpsertDto>((dto$) =>
    dto$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      exhaustMap((dto) =>
        this.api.updateProfile(dto).pipe(
          tapResponse({
            next: (profile) => this.patchState({ profile }),
            error: (errors: ApiError) =>
              this.patchState({ profile: null, errors }),
            finalize: () => this.patchState({ isLoading: false }),
          })
        )
      )
    )
  );
}

import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { GlobalStore } from '../../global-store';
import { tap, EMPTY, exhaustMap } from 'rxjs';
import { ApiService } from './api.service';
import { tapResponse } from '@ngrx/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../shared/api-response.model';
import { User } from './register.model';
import { Router } from '@angular/router';

export interface State {
  isLoading: boolean;
  loginForm: FormGroup | null;
  loginSubmitted: boolean;
  registerSubmitted: boolean;
  registerForm: FormGroup | null;
  errors: any;
}

const InitialState: State = {
  isLoading: false,
  loginForm: null,
  loginSubmitted: false,
  registerSubmitted: false,
  registerForm: null,
  errors: null,
};

@Injectable()
export class Store extends ComponentStore<State> {
  constructor(
    private readonly globalStore: GlobalStore,
    private readonly apiService: ApiService,
    private readonly fb: FormBuilder,
    private readonly alertService: AlertService,
    private readonly router: Router,
  ) {
    super(InitialState);
  }

  readonly loadData = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.patchState({
          loginForm: this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            rememberMe: [false],
          }),
          registerForm: this.fb.group(
            {
              email: ['', [Validators.required, Validators.email]],
              password: ['', [Validators.required, Validators.minLength(8)]],
              confirmPassword: ['', [Validators.required]],
            },
            { validators: this.matchFields('password', 'confirmPassword') }
          ),
        });
      })
    )
  );

  readonly vm$ = this.select(
    ({
      isLoading,
      loginForm,
      registerForm,
      errors,
      loginSubmitted,
      registerSubmitted,
    }) => ({
      isLoading,
      loginForm,
      registerForm,
      errors,
      loginSubmitted,
      registerSubmitted,
    })
  );

  readonly onLoginSubmit = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ loginSubmitted: true, isLoading: true })),
      exhaustMap(() => {
        const state = this.get();
        if (state.loginForm?.invalid) {
          state.loginForm.markAllAsTouched();
          return EMPTY;
        }

        return this.apiService.login(state.loginForm?.getRawValue()).pipe(
          tapResponse({
            next: (res) => {
              if (res.payload) {
                this.globalStore.setToken(res.payload.token);
                this.globalStore.setUser(User.adapt(res.payload.user));
                this.router.navigate(['/']);
              }

              this.alertService.showSuccess(res.message);
            },
            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({
                errors,
              });
            },
            finalize: () => this.patchState({ isLoading: false }),
          })
        );
      })
    )
  );

  readonly onRegisterSubmit = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.patchState({ registerSubmitted: true, isLoading: true })),
      exhaustMap(() => {
        const state = this.get();
        if (state.registerForm?.invalid) {
          state.registerForm.markAllAsTouched();
          return EMPTY;
        }

        return this.apiService.register(state.registerForm?.getRawValue()).pipe(
          tapResponse({
            next: (res) => {
              this.alertService.showSuccess(res.message);
            },
            error: (errors: ApiError) => {
              console.error(errors);
              this.alertService.showError(
                errors.flatMap((err) => Object.values(err))
              );
              this.patchState({
                errors,
              });
            },
            finalize: () => {
              this.get().registerForm?.reset();
              this.patchState({ isLoading: false });
            },
          })
        );
      })
    )
  );

  /** Validador para confirmar contraseña */
  private matchFields(field: string, confirmField: string) {
    return (group: AbstractControl): ValidationErrors | null => {
      const f = group.get(field)?.value;
      const c = group.get(confirmField)?.value;
      return f === c ? null : { fieldsDontMatch: true };
    };
  }
}

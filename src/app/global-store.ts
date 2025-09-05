import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, catchError, switchMap, tap } from 'rxjs';

export interface UserGlobalState {
  name: string;
}

interface GlobalState {
  user: UserGlobalState | null;
  token: string | null;
}

const initialState: GlobalState = {
  user: null,
  token: null,
};

@Injectable({
  providedIn: 'root',
})
export class GlobalStore extends ComponentStore<GlobalState> {
  constructor(private router: Router) {
    super(initialState);
  }

  /* SELECTORS */

  readonly user$ = this.select((state) => state.user);

  readonly token$ = this.select((state) => state.token);

  /* COMBINED SELECTORS */

  readonly vm$ = this.select(({ user }) => ({
    user,
  }));

  /* UPDATERS */

  readonly setUser = this.updater<UserGlobalState>((state, user) => {
    /*const path = user.profileImage ?? this.generateAvatar(user.name);
    this.auth.setAvatar(path);
    this.auth.setName(user.name);
    user.profileImage = path;*/
    return { ...state, user };
  });

  readonly setToken = this.updater<string>((state, token) => {
    //this.auth.setToken(token);
    return { ...state, token, loggingIn: false };
  });

  readonly setTimeZone = this.updater<string>((state, timeZone) => {
    //this.auth.setTimeZone(timeZone!);
    return { ...state, timeZone: timeZone };
  });

  readonly setConfig = this.updater((state, config) => {
    return { ...state, config };
  });

  readonly setPermissions = this.updater<string[]>((state, permissions) => {
    // this.auth.setPermissions(permissions);
    return { ...state, permissions };
  });

  readonly setLoginErrors = this.updater<any>((state, loginErrors) => {
    return { ...state, loginErrors, loggingIn: false };
  });

  readonly clearState = this.updater((state) => {
    return {
      ...state,
      user: null,
      token: '',
      config: null,
      permissions: [],
    };
  });

  /* EFECTS */

  /*readonly loadData = this.effect($ =>
    $.pipe(
      tap(() => {
        const timezone = localStorage.getItem('timezone');
        if (timezone) this.setTimeZone(timezone);
        const token = localStorage.getItem('token');
        if (token) this.setToken(token);

        const permissions = localStorage.getItem('permissions');
        if (permissions) this.setPermissions(JSON.parse(permissions));

        const name = localStorage.getItem('name');
        const profileImage = this.auth.getAvatar();
        if (name && profileImage) {
          this.setUser({ name, profileImage });
        }
      })
    )
  );*/

  /*readonly clearStorage = this.effect($ =>
    $.pipe(
      tap(() => {
        this.clearState();
        this.auth.removeData();
      })
    )
  );*/

  /*readonly login = this.effect<{ email: string; password: string }>(credentials$ =>
    credentials$.pipe(
      tap(() => {
        this.patchState({ loggingIn: true });
      }),
      switchMap(credentials => {
        return this.auth.login(credentials).pipe(
          catchError((err: any) => {
            this.setLoginErrors(err);
            return EMPTY;
          })
        );
      }),
      tap((data: any) => {
        // para guardar la version vieja la cual es utilizada dentro de muchas
        // areas de la aplicacion, se deberá migrar progresivamente
        localStorage.setItem('Token', JSON.stringify(data));

        this.setToken(data.data.token);
        this.setPermissions(data.data.permissions);
        this.setTimeZone(data.data.timezone);
        this.setUser({ name: data.data.name, profileImage: data.data.profile_image });

        if (data.data.should_change_password) {
          const modal = this.modalService.open(ResetPasswordConfirmationComponent);
          modal.componentInstance.passwordChanged.subscribe((success: boolean) => {
            if (success) {
              this.router.navigate([`/profile/account/edit/${data.data.name}`]);
            } else {
              this.router.navigate(['/dashboard']);
            }
          });
        } else {
          this.router.navigate(['/dashboard']);
        }
      })
    )
  );*/

  /*readonly logout = this.effect($ =>
    $.pipe(
      switchMap(() =>
       this.auth.logout().pipe(
          tap(() => {
            this.clearState();
            this.auth.removeData();
            this.router.navigate(['/auth/login']);
          }),
          catchError((err: any) => EMPTY)
        )
      )
    )
  );*/

  readonly prueba = this.effect(($) =>
    $.pipe(
      tap(() => {
        alert('PRUEBA GLOBAL STORE');
      })
    )
  );
}

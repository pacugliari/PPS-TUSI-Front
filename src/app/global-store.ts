import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { RolType } from './shared/rol.model';

interface RolGlobalState {
  idRol: number;
  tipo: RolType;
  nombre: string;
}

interface PerfilGlobalState {
  nombre: string;
}

export interface UserGlobalState {
  id: number;
  email: string;
  role: RolGlobalState;
  compraOnline: boolean;
  perfil: PerfilGlobalState | null;
}
interface GlobalState {
  user: UserGlobalState | null;
  token: string | null;
  errors: Array<Record<string, string>> | null;
  isLoading: boolean;
}

const initialState: GlobalState = {
  user: null,
  token: null,
  errors: null,
  isLoading: false,
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
    this.setLocalStorageUser(user);
    return { ...state, user };
  });

  readonly setToken = this.updater<string>((state, token) => {
    this.setLocalStorageToken(token);
    return { ...state, token };
  });

  readonly setErrors = this.updater<any>((state, errors) => {
    return { ...state, errors };
  });

  public readonly setIsLoading = this.updater<boolean>((state, isLoading) => ({
    ...state,
    isLoading,
  }));

  readonly clearState = this.updater((state) => {
    return {
      ...state,
      user: null,
      token: '',
    };
  });

  /* EFECTS */

  readonly loadData = this.effect(($) =>
    $.pipe(
      tap(() => {
        const token = this.getLocalStorageToken();
        const user = this.getLocalStorageUser();

        if (token) this.setToken(token);
        if (user) this.setUser(user);
      })
    )
  );

  readonly clearStorage = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.clearState();
        this.removeDataLocalStorage();
      })
    )
  );

  readonly logout = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.clearStorage();
        this.router.navigate(['/register']);
      })
    )
  );

  public setLocalStorageUser(user: UserGlobalState) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public setLocalStorageToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getLocalStorageUser(): UserGlobalState | null {
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user);
    return null;
  }

  public getLocalStorageToken(): string {
    const token = localStorage.getItem('token');
    if (token) return token;
    return '';
  }

  public removeDataLocalStorage() {
    localStorage.clear();
  }
}

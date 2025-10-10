import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { RolType } from './shared/rol.model';
import { Producto } from './shared/api/producto.model';
import { SharedApiService } from './shared/api/api.service';

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

export interface CartPersistedItem {
  idProducto: number;
  cantidad: number;
}

export interface CartItem {
  idProducto: number;
  nombre: string;
  precio: number;
  imagen: string | null;
  cantidad: number;
}

interface GlobalState {
  user: UserGlobalState | null;
  token: string | null;
  errors: Array<Record<string, string>> | null;
  isLoading: boolean;
  cart: CartItem[];
  favorites: number[];
}

const initialState: GlobalState = {
  user: null,
  token: null,
  errors: null,
  isLoading: false,
  cart: [],
  favorites: [],
};

const LS_USER_KEY = 'user';
const LS_TOKEN_KEY = 'token';
const LS_CART_NS = 'cart';
const LS_FAVS_NS = 'favorites';

const ROLES_SIN_CART: ReadonlyArray<RolType> = [
  RolType.ADMINISTRADOR,
  RolType.OPERARIO,
];
const ROLES_SIN_FAVS: ReadonlyArray<RolType> = [
  RolType.ADMINISTRADOR,
  RolType.OPERARIO,
];

@Injectable({ providedIn: 'root' })
export class GlobalStore extends ComponentStore<GlobalState> {
  constructor(
    private router: Router,
    private sharedApiService: SharedApiService
  ) {
    super(initialState);
  }

  //SELECTORS
  readonly isLoading$ = this.select((s) => s.isLoading);
  readonly user$ = this.select((s) => s.user);
  readonly token$ = this.select((s) => s.token);

  readonly cart$ = this.select((s) => s.cart);
  readonly cartCount$ = this.select(this.cart$, (cart) =>
    cart.reduce((a, i) => a + i.cantidad, 0)
  );
  readonly cartTotal$ = this.select(this.cart$, (cart) =>
    cart.reduce((a, i) => a + i.precio * i.cantidad, 0)
  );

  readonly favorites$ = this.select((s) => s.favorites);
  readonly favoritesIds$ = this.select(this.favorites$, (ids) => new Set(ids));
  readonly favoritesCount$ = this.select(this.favorites$, (ids) => ids.length);
  readonly isFavorite$ = (id: number) =>
    this.select(this.favoritesIds$, (set) => set.has(id));

  readonly canUseCart$ = this.select(this.user$, (u) => this.cartEnabledFor(u));
  readonly canUseFavs$ = this.select(this.user$, (u) => this.favsEnabledFor(u));

  readonly vm$ = this.select(({ user, cart, favorites, isLoading }) => ({
    user,
    cart,
    favorites,
    isLoading,
  }));

  //UPDATERS

  readonly setUser = this.updater<UserGlobalState>((state, user) => {
    this.setLocalStorageItem(LS_USER_KEY, user);

    const cartEnabled = this.cartEnabledFor(user);
    const favsEnabled = this.favsEnabledFor(user);

    if (cartEnabled) {
      const guest =
        this.getPerUser<CartPersistedItem[]>(LS_CART_NS, null) ?? [];
      const own = this.getPerUser<CartPersistedItem[]>(LS_CART_NS, user) ?? [];
      const merged = this.mergePersistedCarts(own, guest);
      this.setPerUser(LS_CART_NS, user, merged);
      this.removePerUser(LS_CART_NS, null);
    } else {
      this.removePerUser(LS_CART_NS, user);
    }

    let nextFavs: number[] = state.favorites;
    if (favsEnabled) {
      const guestF = this.getPerUser<number[]>(LS_FAVS_NS, null) ?? [];
      const ownF = this.getPerUser<number[]>(LS_FAVS_NS, user) ?? [];
      nextFavs = Array.from(new Set([...ownF, ...guestF]));
      this.setPerUser(LS_FAVS_NS, user, nextFavs);
      this.removePerUser(LS_FAVS_NS, null);
    } else {
      nextFavs = [];
      this.removePerUser(LS_FAVS_NS, user);
    }

    return { ...state, user, favorites: nextFavs };
  });

  readonly setToken = this.updater<string>((state, token) => {
    this.setLocalStorageRaw(LS_TOKEN_KEY, token);
    return { ...state, token };
  });

  readonly setErrors = this.updater<any>((s, errors) => ({ ...s, errors }));
  readonly setIsLoading = this.updater<boolean>((s, isLoading) => ({
    ...s,
    isLoading,
  }));

  readonly clearState = this.updater((s) => {
    const guest = this.getPerUser<CartPersistedItem[]>(LS_CART_NS, null) ?? [];
    return { ...s, user: null, token: '', cart: [], favorites: [] };
  });

  readonly addToCart = this.updater<{ producto: Omit<Producto, 'categoria' | 'precioAnterior'>; cantidad?: number }>(
    (state, { producto, cantidad = 1 }) => {
      if (!this.cartEnabledFor(state.user)) return state;

      const nextCart = [...state.cart];
      const idx = nextCart.findIndex(
        (i) => i.idProducto === producto.idProducto
      );
      if (idx >= 0)
        nextCart[idx] = {
          ...nextCart[idx],
          cantidad: nextCart[idx].cantidad + cantidad,
        };
      else
        nextCart.push({
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.fotos?.[0] ?? null,
          cantidad,
        });

      const persisted = this.toPersisted(nextCart);
      this.setPerUser(LS_CART_NS, state.user, persisted);

      return { ...state, cart: nextCart };
    }
  );

  readonly updateQuantity = this.updater<{
    idProducto: number;
    cantidad: number;
  }>((state, { idProducto, cantidad }) => {
    if (!this.cartEnabledFor(state.user)) return state;
    const next = state.cart.map((i) =>
      i.idProducto === idProducto
        ? { ...i, cantidad: Math.max(1, cantidad) }
        : i
    );
    this.setPerUser(LS_CART_NS, state.user, this.toPersisted(next));
    return { ...state, cart: next };
  });

  readonly removeFromCart = this.updater<number>((state, idProducto) => {
    if (!this.cartEnabledFor(state.user)) return state;
    const next = state.cart.filter((i) => i.idProducto !== idProducto);
    this.setPerUser(LS_CART_NS, state.user, this.toPersisted(next));
    return { ...state, cart: next };
  });

  readonly clearCart = this.updater((state) => {
    if (!this.cartEnabledFor(state.user)) return state;
    this.setPerUser(LS_CART_NS, state.user, []);
    return { ...state, cart: [] };
  });

  readonly setFavorites = this.updater<number[]>((state, favs) => {
    if (!this.favsEnabledFor(state.user)) return state;
    const unique = Array.from(new Set(favs));
    this.setPerUser(LS_FAVS_NS, state.user, unique);
    return { ...state, favorites: unique };
  });

  readonly addFavorite = this.updater<number>((state, id) => {
    if (!this.favsEnabledFor(state.user)) return state;
    if (state.favorites.includes(id)) return state;
    const next = [...state.favorites, id];
    this.setPerUser(LS_FAVS_NS, state.user, next);
    return { ...state, favorites: next };
  });

  readonly removeFavorite = this.updater<number>((state, id) => {
    if (!this.favsEnabledFor(state.user)) return state;
    const next = state.favorites.filter((x) => x !== id);
    this.setPerUser(LS_FAVS_NS, state.user, next);
    return { ...state, favorites: next };
  });

  readonly toggleFavorite = this.updater<number>((state, id) => {
    if (!this.favsEnabledFor(state.user)) return state;
    const exists = state.favorites.includes(id);
    const next = exists
      ? state.favorites.filter((x) => x !== id)
      : [...state.favorites, id];
    this.setPerUser(LS_FAVS_NS, state.user, next);
    return { ...state, favorites: next };
  });

  /* ================= EFFECTS ================= */

  readonly hydrateCart = this.effect<UserGlobalState | null>((user$) =>
    user$.pipe(
      switchMap((u) => {
        if (!this.cartEnabledFor(u)) {
          this.patchState({ cart: [] });
          return EMPTY;
        }

        const persisted =
          this.getPerUser<CartPersistedItem[]>(LS_CART_NS, u) ?? [];

        if (persisted.length === 0) {
          this.patchState({ cart: [] });
          return EMPTY;
        }

        const ids = persisted.map((p) => p.idProducto);
        const idSet = new Set(ids);

        return this.sharedApiService.getProducts().pipe(
          tapResponse({
            next: (res) => {
              const productos: Producto[] = (res?.payload ?? []).filter(
                (p: Producto) => idSet.has(p.idProducto)
              );

              const byId = new Map(productos.map((p) => [p.idProducto, p]));

              const cart: CartItem[] = persisted.map(
                ({ idProducto, cantidad }) => {
                  const prod = byId.get(idProducto);
                  if (prod) {
                    return {
                      idProducto: prod.idProducto,
                      nombre: prod.nombre,
                      precio: prod.precio,
                      imagen: prod.fotos?.[0] ?? null,
                      cantidad,
                    };
                  }
                  return {
                    idProducto,
                    nombre: 'Producto no disponible',
                    precio: 0,
                    imagen: null,
                    cantidad,
                  };
                }
              );

              this.patchState({ cart });
            },
            error: (err) => {
              alert(err);
            },
          })
        );
      })
    )
  );

  readonly loadData = this.effect(($) =>
    $.pipe(
      tap(() => {
        const token = this.getLocalStorageRaw(LS_TOKEN_KEY);
        const user = this.getLocalStorageItem<UserGlobalState>(LS_USER_KEY);
        if (token) this.setToken(token);

        if (user) {
          this.setUser(user);
          this.hydrateCart(user);
        } else {
          this.patchState({ user: null, favorites: [] });
          this.hydrateCart(null);
        }
      })
    )
  );

  readonly logout = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.patchState({ user: null, token: '' });
        this.removeLocalStorageKey(LS_USER_KEY);
        this.removeLocalStorageKey(LS_TOKEN_KEY);
        this.patchState({ favorites: [] });
        this.hydrateCart(null);
        this.router.navigate(['/register']);
      })
    )
  );

  //UTILS

  isFavorite(id: number) {
    return this.get().favorites.includes(id);
  }

  private hasLS() {
    return typeof localStorage !== 'undefined';
  }
  private setLocalStorageItem<T>(key: string, value: T) {
    if (!this.hasLS()) return;
    localStorage.setItem(key, JSON.stringify(value));
  }
  private setLocalStorageRaw(key: string, value: string) {
    if (!this.hasLS()) return;
    localStorage.setItem(key, value);
  }
  private getLocalStorageItem<T>(key: string): T | null {
    if (!this.hasLS()) return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  private getLocalStorageRaw(key: string): string {
    if (!this.hasLS()) return '';
    return localStorage.getItem(key) ?? '';
  }
  private removeLocalStorageKey(key: string) {
    if (!this.hasLS()) return;
    localStorage.removeItem(key);
  }
  private setPerUser<T>(ns: string, u: UserGlobalState | null, value: T) {
    this.setLocalStorageItem(this.nsKey(ns, u), value);
  }
  private getPerUser<T>(ns: string, u: UserGlobalState | null): T | null {
    return this.getLocalStorageItem<T>(this.nsKey(ns, u));
  }
  private removePerUser(ns: string, u: UserGlobalState | null) {
    this.removeLocalStorageKey(this.nsKey(ns, u));
  }

  private userKey(u: UserGlobalState | null): string {
    if (!u) return 'guest';
    return String(u.id || u.email || 'guest').toLowerCase();
  }
  private nsKey(ns: string, u: UserGlobalState | null) {
    return `${ns}:${this.userKey(u)}`;
  }

  private cartEnabledFor(u: UserGlobalState | null): boolean {
    if (!u) return true;
    return !ROLES_SIN_CART.includes(u.role?.tipo);
  }
  private favsEnabledFor(u: UserGlobalState | null): boolean {
    if (!u) return false;
    return !ROLES_SIN_FAVS.includes(u.role?.tipo);
  }

  private toPersisted(items: CartItem[]): CartPersistedItem[] {
    return items.map((i) => ({
      idProducto: i.idProducto,
      cantidad: i.cantidad,
    }));
  }

  private mergePersistedCarts(
    a: CartPersistedItem[],
    b: CartPersistedItem[]
  ): CartPersistedItem[] {
    const map = new Map<number, number>();
    const add = (arr: CartPersistedItem[]) => {
      for (const it of arr)
        map.set(it.idProducto, (map.get(it.idProducto) ?? 0) + it.cantidad);
    };
    add(a);
    add(b);
    return Array.from(map.entries()).map(([idProducto, cantidad]) => ({
      idProducto,
      cantidad,
    }));
  }
}

import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, switchMap, tap } from 'rxjs';
import { Product, ProductCard } from './product.model';
import { ProductApiService } from './api.service';
import { GlobalStore } from '../../global-store';

interface ProductState {
  isLoading: boolean;
  product: Product | null;
  latest: ProductCard[];
  selectedImageIdx: number;
  qty: number;
  error: string | null;
}

const initialState: ProductState = {
  isLoading: false,
  product: null,
  latest: [],
  selectedImageIdx: 0,
  qty: 1,
  error: null,
};

@Injectable()
export class ProductStore extends ComponentStore<ProductState> {
  private readonly api = inject(ProductApiService);
  private readonly globalStore = inject(GlobalStore);

  constructor() {
    super(initialState);
  }

  // VM
  readonly vm$ = this.select((s) => ({
    isLoading: s.isLoading,
    product: s.product,
    latest: s.latest,
    selectedImageIdx: s.selectedImageIdx,
    qty: s.qty,
    error: s.error,
  }));

  // Updaters
  readonly setLoading = this.updater<boolean>((s, v) => ({
    ...s,
    isLoading: v,
  }));
  readonly setAdding = this.updater<boolean>((s, v) => ({ ...s, isAdding: v }));
  readonly setProduct = this.updater<Product | null>((s, p) => ({
    ...s,
    product: p,
    selectedImageIdx: 0,
    qty: 1,
    error: null,
  }));
  readonly setLatest = this.updater<ProductCard[]>((s, v) => ({
    ...s,
    latest: v,
  }));
  readonly setSelectedImage = this.updater<number>((s, i) => ({
    ...s,
    selectedImageIdx: i,
  }));
  readonly setQty = this.updater<number>((s, q) => ({
    ...s,
    qty: Math.max(1, q),
  }));
  readonly setError = this.updater<string | null>((s, e) => ({
    ...s,
    error: e,
  }));

  // Effects
  readonly loadById = this.effect<number | null>((id$) =>
    id$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setError(null);
      }),
      switchMap((id) => {
        if (!id) return EMPTY;
        return this.api.getById(Number(id)).pipe(
          tap({
            next: (res) => {
              this.setProduct(res.payload);
              this.setLoading(false);
            },
            error: () => {
              this.setError('No se pudo cargar el producto');
              this.setLoading(false);
            },
          })
        );
      })
    )
  );

  readonly loadLatest = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() =>
        this.api.getLatest().pipe(
          tap({
            next: (res) => this.setLatest(res.payload ?? []),
            error: () => this.setLatest([]),
          })
        )
      )
    )
  );

  // UI helpers
  selectImage(i: number) {
    this.setSelectedImage(i);
  }
  inc() {
    const { qty, product } = this.get();
    const max = product?.stock ?? Number.MAX_SAFE_INTEGER;
    this.setQty(Math.min(qty + 1, max));
  }
  dec() {
    const { qty } = this.get();
    this.setQty(Math.max(1, qty - 1));
  }

  addToCart() {
    const { product, qty } = this.get();
    if (!product) return;
    this.globalStore.addToCart({ producto: product, cantidad: qty });
  }
}

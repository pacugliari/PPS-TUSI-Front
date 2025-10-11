import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Card, CardType } from './cards.model';
import { tap, switchMap, withLatestFrom } from 'rxjs';
import { CardsApiService } from './api.service';

interface CardsState {
  cards: Card[];
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string | null;

  // form
  tipo: CardType | null;
  numero: string;
  codigo: string;
}

const initialState: CardsState = {
  cards: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  tipo: null,
  numero: '',
  codigo: '',
};

@Injectable()
export class CardsStore extends ComponentStore<CardsState> {
  private readonly api = inject(CardsApiService);

  // selectors “atómicos”
  readonly cards$ = this.select((s) => s.cards);
  readonly isLoading$ = this.select((s) => s.isLoading);
  readonly isSubmitting$ = this.select((s) => s.isSubmitting);
  readonly error$ = this.select((s) => s.error);
  readonly form$ = this.select(({ tipo, numero, codigo }) => ({
    tipo,
    numero,
    codigo,
  }));

  // VM única para el componente
  readonly vm$ = this.select(
    this.cards$,
    this.isLoading$,
    this.isSubmitting$,
    this.error$,
    this.form$,
    (cards, isLoading, isSubmitting, error, form) => ({
      cards,
      isLoading,
      isSubmitting,
      error,
      form,
    })
  );

  constructor() {
    super(initialState);
    this.load();
  }

  // updaters
  readonly setTipo = this.updater<CardType | null>((s, tipo) => ({
    ...s,
    tipo,
  }));
  readonly setNumero = this.updater<string>((s, numero) => ({ ...s, numero }));
  readonly setCodigo = this.updater<string>((s, codigo) => ({ ...s, codigo }));
  private readonly setCards = this.updater<Card[]>((s, cards) => ({
    ...s,
    cards,
  }));
  private readonly setIsLoading = this.updater<boolean>((s, v) => ({
    ...s,
    isLoading: v,
  }));
  private readonly setIsSubmitting = this.updater<boolean>((s, v) => ({
    ...s,
    isSubmitting: v,
  }));
  private readonly setError = this.updater<string | null | undefined>(
    (s, e) => ({ ...s, error: e })
  );

  // effects
  readonly load = this.effect<void>(($) =>
    $.pipe(
      tap(() => this.setIsLoading(true)),
      switchMap(() =>
        this.api.list().pipe(
          tap((cards) => {
            this.setCards(cards);
            this.setIsLoading(false);
          })
        )
      )
    )
  );

  /** Valida y registra en un solo flujo */
  readonly register = this.effect<void>(($) =>
    $.pipe(
      withLatestFrom(this.form$),
      tap(() => {
        this.setIsSubmitting(true);
        this.setError(null);
      }),
      switchMap(([, form]) =>
        this.api
          .create({
            tipo: form.tipo as CardType,
            numero: form.numero,
            codigo: form.codigo,
          })
          .pipe(
            tap({
              next: (created) => {
                const { cards } = this.get();
                this.setCards([created, ...cards]);
                this.setIsSubmitting(false);
                // limpiar form
                this.patchState({ tipo: null, numero: '', codigo: '' });
              },
              error: () => {
                this.setIsSubmitting(false);
                this.setError('No se pudo guardar la tarjeta.');
              },
            })
          )
      )
    )
  );

  readonly remove = this.effect<number>(($) =>
    $.pipe(
      tap(() => this.setIsSubmitting(true)),
      switchMap((id) =>
        this.api.delete(id).pipe(
          tap(({ idTarjeta }) => {
            const left = this.get().cards.filter(
              (c) => c.idTarjeta !== idTarjeta
            );
            this.setCards(left);
            this.setIsSubmitting(false);
          })
        )
      )
    )
  );
}

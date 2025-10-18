import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Bank, Card, CardType } from './cards.model';
import { tap, switchMap, withLatestFrom } from 'rxjs';
import { CardsApiService } from './api.service';
import { AlertService } from '../../../shared/alert/alert.service';



interface CardsState {
  cards: Card[];
  bancos: Bank[];
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string | null;

  // form
  idBanco: number | null;
  tipo: CardType | null;
  numero: string;
  codigo: string;
}

const initialState: CardsState = {
  cards: [],
  bancos: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  idBanco: null,
  tipo: null,
  numero: '',
  codigo: '',
};

@Injectable()
export class CardsStore extends ComponentStore<CardsState> {
  private readonly api = inject(CardsApiService);
  private readonly alertService = inject(AlertService);

  readonly cards$ = this.select((s) => s.cards);
  readonly bancos$ = this.select((s) => s.bancos);
  readonly isLoading$ = this.select((s) => s.isLoading);
  readonly isSubmitting$ = this.select((s) => s.isSubmitting);
  readonly error$ = this.select((s) => s.error);
  readonly form$ = this.select(({ idBanco, tipo, numero, codigo }) => ({
    idBanco,
    tipo,
    numero,
    codigo,
  }));

  readonly vm$ = this.select(
    this.cards$,
    this.bancos$,
    this.isLoading$,
    this.isSubmitting$,
    this.error$,
    this.form$,
    (cards, bancos, isLoading, isSubmitting, error, form) => ({
      cards,
      bancos,
      isLoading,
      isSubmitting,
      error,
      form,
    })
  );

  constructor() {
    super(initialState);
    this.load();
    this.loadBancos();
  }

  readonly setIdBanco = this.updater<number | null>((s, idBanco) => ({
    ...s,
    idBanco,
  }));
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
  private readonly setBancos = this.updater<Bank[]>((s, bancos) => ({
    ...s,
    bancos,
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

  readonly loadBancos = this.effect<void>(($) =>
    $.pipe(
      switchMap(() =>
        this.api.options().pipe(
          tap((bancos) => {
            this.setBancos(bancos ?? []);
          })
        )
      )
    )
  );

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
            idBanco: form.idBanco as number,
            tipo: form.tipo as CardType,
            numero: form.numero,
            codigo: form.codigo,
          })
          .pipe(
            tap({
              next: (res) => {
                this.load();
                this.setIsSubmitting(false);
                this.alertService.showSuccess(res.message);
                this.patchState({
                  idBanco: null,
                  tipo: null,
                  numero: '',
                  codigo: '',
                });
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
          tap((res) => {
            this.load();
            this.alertService.showSuccess(res.message);
            this.setIsSubmitting(false);
          })
        )
      )
    )
  );
}

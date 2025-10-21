import { toDateOnlyString, toISOInstant } from './bank-promos.util';

export class BankPromo {
  constructor(
    public idPromocionBancaria: number,
    public idBanco: number,
    public nombre: string,
    public porcentaje: number,
    public fechaDesde: string, // YYYY-MM-DD
    public fechaHasta: string, // YYYY-MM-DD
    public dias: string[], // ["lunes","martes"...]
    public createdAt: string, // ISO instant
    public updatedAt: string, // ISO instant
    public bancoNombre?: string // opcional si backend lo incluye
  ) {}

  static adapt(item: any): BankPromo {
    if (
      !item ||
      item.idPromocionBancaria == null ||
      item.idBanco == null ||
      !item.nombre
    ) {
      throw new Error('Invalid bank promo data');
    }

    const pct = Number(item.porcentaje);
    if (Number.isNaN(pct)) throw new Error('Invalid porcentaje');

    return new BankPromo(
      Number(item.idPromocionBancaria),
      Number(item.idBanco),
      String(item.nombre ?? '').trim(),
      pct,
      toDateOnlyString(item.fechaDesde),
      toDateOnlyString(item.fechaHasta),
      Array.isArray(item.dias) ? item.dias.map(String) : [],
      toISOInstant(item.createdAt ?? new Date()),
      toISOInstant(item.updatedAt ?? new Date()),
      item.banco?.nombre ? String(item.banco.nombre) : undefined
    );
  }

  static adaptList(list?: any[]): BankPromo[] {
    return Array.isArray(list) ? list.map(BankPromo.adapt) : [];
  }
}

export interface BankPromoUpsertDto {
  idBanco: number;
  nombre: string;
  fechaDesde: string; // YYYY-MM-DD
  fechaHasta: string; // YYYY-MM-DD
  dias: string[]; // ["lunes","martes"...]
}

export type SimpleBank = { idBanco: number; nombre: string };

export class BankPromoOptions {
  constructor(public bancos: SimpleBank[]) {}
  static adapt(payload: any): BankPromoOptions {
    const bancos = Array.isArray(payload)
      ? payload.map((b: any) => ({
          idBanco: Number(b.idBanco),
          nombre: String(b.nombre),
        }))
      : [];
    return new BankPromoOptions(bancos);
  }
}

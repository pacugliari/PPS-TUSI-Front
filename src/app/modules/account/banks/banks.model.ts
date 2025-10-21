const toISOInstant = (d: any): string => new Date(d).toISOString();

export class Bank {
  constructor(
    public idBanco: number,
    public nombre: string,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static adapt(item: any): Bank {
    if (!item || item.idBanco == null || item.nombre == null) {
      throw new Error('Invalid bank data');
    }
    return new Bank(
      Number(item.idBanco),
      String(item.nombre ?? '').trim(),
      toISOInstant(item.createdAt ?? new Date()),
      toISOInstant(item.updatedAt ?? new Date())
    );
  }

  static adaptList(list?: any[]): Bank[] {
    return Array.isArray(list) ? list.map(Bank.adapt) : [];
  }
}

export interface BankUpsertDto {
  nombre: string;
}

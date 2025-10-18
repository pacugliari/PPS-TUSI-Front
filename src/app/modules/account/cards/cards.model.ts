export type CardType = 'VISA' | 'MASTERCARD';

export class Bank {
  constructor(public idBanco: number, public nombre: string) {}

  static adapt(item: any): Bank {
    if (!item || !item.idBanco || !item.nombre) {
      throw new Error('Invalid bank data');
    }
    return new Bank(Number(item.idBanco), String(item.nombre).trim());
  }

  static adaptList(list?: any[]): Bank[] {
    return Array.isArray(list) ? list.map(Bank.adapt) : [];
  }
}

export class Card {
  constructor(
    public idTarjeta: number,
    public tipo: string,
    public last4: string,
    public maskedNumber: string,
    public createdAt: string, // ISO
    public banco: Bank
  ) {}

  static adapt(item: any): Card {
    if (
      !item ||
      !item.idTarjeta ||
      !item.tipo ||
      !item.last4 ||
      !item.maskedNumber ||
      !item.createdAt ||
      !item.banco
    ) {
      throw new Error('Invalid card data');
    }

    return new Card(
      Number(item.idTarjeta),
      String(item.tipo).trim(),
      String(item.last4),
      String(item.maskedNumber),
      new Date(item.createdAt).toISOString(),
      Bank.adapt(item.banco)
    );
  }

  static adaptList(list?: any[]): Card[] {
    return Array.isArray(list) ? list.map(Card.adapt) : [];
  }
}

export interface CardCreateRequest {
  idBanco: number;
  tipo: CardType;
  numero: string;
  codigo: string;
}

export interface CardValidateRequest {
  tipo: CardType;
  numero: string;
  codigo: string;
}

export type CardType = 'VISA' | 'MASTERCARD';

export interface Card {
  idTarjeta: number;
  tipo: CardType;
  last4: string;
  maskedNumber: string;
  createdAt: string; // ISO
}

export interface CardCreateRequest {
  tipo: CardType;
  numero: string; // PAN completo
  codigo: string; // CVV
}

export interface CardValidateRequest {
  tipo: CardType;
  numero: string;
  codigo: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  payload: T;
  errors: any[];
}

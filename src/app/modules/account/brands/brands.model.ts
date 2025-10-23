import { toISOInstant } from './brands.util';

export class Brand {
  constructor(
    public idMarca: number,
    public nombre: string,
    public descripcion: string,
    public activo: boolean,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static adapt(item: any): Brand {
    if (!item || item.idMarca == null || !item.nombre) {
      throw new Error('Invalid brand data');
    }
    return new Brand(
      Number(item.idMarca),
      String(item.nombre).trim(),
      String(item.descripcion ?? '').trim(),
      Boolean(item.activo ?? true),
      toISOInstant(item.createdAt ?? new Date()),
      toISOInstant(item.updatedAt ?? new Date())
    );
  }

  static adaptList(list?: any[]): Brand[] {
    return Array.isArray(list) ? list.map(Brand.adapt) : [];
  }
}

export interface BrandUpsertDto {
  nombre: string;
  descripcion: string;
  activo?: boolean;
}

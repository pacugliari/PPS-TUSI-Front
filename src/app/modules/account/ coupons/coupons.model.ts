import { toDateOnlyString, toISOInstant } from "./coupons.util";

export class UserPerfil {
  constructor(
    public nombre: string,
    public dni: number | null,
    public telefono: string | null
  ) {}

  static adapt(item: any): UserPerfil {
    if (!item) return new UserPerfil('', null, null);
    return new UserPerfil(
      String(item.nombre ?? '').trim(),
      item.dni !== undefined && item.dni !== null ? Number(item.dni) : null,
      item.telefono != null ? String(item.telefono).trim() : null
    );
  }
}


export class User {
  constructor(
    public idUsuario: number,
    public nombre: string,
    public email: string,
    public dni: number | null,
    public telefono: string | null
  ) {}

  static adapt(item: any): User {
    if (!item || !item.idUsuario) {
      throw new Error('Invalid user data');
    }
    return new User(
      Number(item.idUsuario),
      String(item.nombre ?? '').trim(),
      String(item.email ?? '').trim(),
      item.dni !== null && item.dni !== undefined ? Number(item.dni) : null,
      item.telefono ? String(item.telefono).trim() : null
    );
  }

  static adaptList(list?: any[]): User[] {
    return Array.isArray(list) ? list.map(User.adapt) : [];
  }

  get label(): string {
    return this.nombre || this.email || `Usuario ${this.idUsuario}`;
  }
}


export class Coupon {
  constructor(
    public idCupon: number,
    public idUsuario: number,
    public porcentaje: number,
    public codigo: string,
    public fechaDesde: string, // 'YYYY-MM-DD'
    public fechaHasta: string, // 'YYYY-MM-DD'
    public activo: boolean,
    public createdAt: string, // ISO instant
    public updatedAt: string, // ISO instant
    public usuario?: User
  ) {}

  static adapt(item: any): Coupon {
    if (
      !item ||
      item.idCupon == null ||
      item.idUsuario == null ||
      item.porcentaje == null ||
      !item.codigo ||
      !item.fechaDesde ||
      !item.fechaHasta ||
      !item.createdAt ||
      !item.updatedAt
    ) {
      throw new Error('Invalid coupon data');
    }

    const pct = Number(item.porcentaje);
    if (Number.isNaN(pct)) throw new Error('Invalid porcentaje');

    return new Coupon(
      Number(item.idCupon),
      Number(item.idUsuario),
      pct,
      String(item.codigo).trim(),
      toDateOnlyString(item.fechaDesde),
      toDateOnlyString(item.fechaHasta),
      Boolean(item.activo ?? true),
      toISOInstant(item.createdAt),
      toISOInstant(item.updatedAt),
      item.usuario ? User.adapt(item.usuario) : undefined
    );
  }

  static adaptList(list?: any[]): Coupon[] {
    return Array.isArray(list) ? list.map(Coupon.adapt) : [];
  }
}


export class CouponsOptions {
  constructor(public users: User[]) {}

  static adapt(payload: any): CouponsOptions {
    const users = Array.isArray(payload?.users)
      ? User.adaptList(payload.users)
      : [];
    return new CouponsOptions(users);
  }
}


export interface CouponUpsertDto {
  idUsuario: number;
  porcentaje: number; // 0..100
  codigo: string;
  fechaDesde: string; // 'YYYY-MM-DD'
  fechaHasta: string; // 'YYYY-MM-DD'
}

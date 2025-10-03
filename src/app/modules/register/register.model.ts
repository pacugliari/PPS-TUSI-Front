import { RolType } from '../../shared/rol.model';

export interface LoginResponse {
  token: string;
  user: User;
}

export class User {
  constructor(
    public id: number,
    public email: string,
    public role: Rol,
    public compraOnline: boolean,
    public perfil: Perfil | null
  ) {}

  static adapt(item: any) {
    if (
      !item.id ||
      !item.email ||
      !item.role ||
      item.compraOnline === undefined
    ) {
      throw new Error('Invalid user data');
    }

    return new User(
      item.id,
      item.email,
      Rol.adapt(item.role),
      item.compraOnline,
      item.perfil && Perfil.adapt(item.perfil)
    );
  }
}

export class Rol {
  constructor(
    public idRol: number,
    public tipo: RolType,
    public nombre: string
  ) {}

  static adapt(item: any) {
    if (!item.idRol || !item.tipo || !item.nombre) {
      throw new Error('Invalid role data');
    }

    return new Rol(item.idRol, item.tipo, item.nombre);
  }
}

export class Perfil {
  constructor(public nombre: string) {}

  static adapt(item: any) {
    if (!item.nombre) {
      throw new Error('Invalid role data');
    }

    return new Perfil(item.nombre);
  }
}

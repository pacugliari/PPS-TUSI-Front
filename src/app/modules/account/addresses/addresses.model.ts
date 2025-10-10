export class UsuarioSummary {
  constructor(public idUsuario: number, public email: string) {}

  static adapt(item: any): UsuarioSummary {
    const missing: string[] = [];
    if (!item) missing.push('usuario');
    if (item?.idUsuario == null) missing.push('usuario.idUsuario');
    if (!item?.email) missing.push('usuario.email');
    if (missing.length) {
      throw new Error(`Invalid address data: missing ${missing.join(', ')}`);
    }
    return new UsuarioSummary(
      Number(item.idUsuario),
      String(item.email).trim()
    );
  }
}

export class ZonaSummary {
  constructor(public idZona: number, public nombre: string) {}

  static adapt(item: any): ZonaSummary {
    const missing: string[] = [];
    if (!item) missing.push('zona');
    if (item?.idZona == null) missing.push('zona.idZona');
    if (!item?.nombre) missing.push('zona.nombre');
    if (missing.length) {
      throw new Error(`Invalid address data: missing ${missing.join(', ')}`);
    }
    return new ZonaSummary(Number(item.idZona), String(item.nombre).trim());
  }
}
export class Direccion {
  constructor(
    public idDireccion: number,
    public idZona: number,
    public idUsuario: number,
    public direccion: string,
    public localidad: string,
    public cp: string,
    public alias: string,
    public adicionales: string,
    public principal: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public usuario: UsuarioSummary,
    public zona: ZonaSummary
  ) {}

  static adapt(item: any): Direccion {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idDireccion == null) missing.push('idDireccion');
    if (item?.idZona == null) missing.push('idZona');
    if (item?.idUsuario == null) missing.push('idUsuario');
    if (!item?.direccion) missing.push('direccion');
    if (!item?.localidad) missing.push('localidad');
    if (!item?.cp) missing.push('cp');
    if (!item?.alias) missing.push('alias');
    if (!item?.adicionales) missing.push('adicionales');
    if (typeof item?.principal !== 'boolean') missing.push('principal');
    if (!item?.usuario) missing.push('usuario');
    if (!item?.zona) missing.push('zona');

    if (missing.length) {
      throw new Error(`Invalid address data: missing ${missing.join(', ')}`);
    }

    const trim = (v: any) => (typeof v === 'string' ? v.trim() : v);

    return new Direccion(
      Number(item.idDireccion),
      Number(item.idZona),
      Number(item.idUsuario),
      trim(item.direccion),
      trim(item.localidad),
      trim(item.cp),
      trim(item.alias),
      trim(item.adicionales),
      Boolean(item.principal),
      new Date(item.createdAt),
      new Date(item.updatedAt),
      UsuarioSummary.adapt(item.usuario),
      ZonaSummary.adapt(item.zona)
    );
  }

  static adaptList(list?: any[]): Direccion[] {
    return Array.isArray(list) ? list.map(Direccion.adapt) : [];
  }
}

export interface DireccionUpsertDto {
  idZona: number;
  direccion: string;
  localidad: string;
  cp: string;
  alias: string;
  adicionales: string;
}

export class Zona {
  constructor(
    public idZona: number,
    public nombre: string,
    public costoEnvio: number,
    public createdAt: Date,
    public updatedAt: Date,
    public ciudad: string,
    public provincia: string
  ) {}

  static adapt(item: any): Zona {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idZona == null) missing.push('idZona');
    if (!item?.nombre) missing.push('nombre');
    if (item?.costoEnvio == null) missing.push('costoEnvio');

    if (missing.length) {
      throw new Error(`Invalid zone data: missing ${missing.join(', ')}`);
    }

    const trim = (v: any) => (typeof v === 'string' ? v.trim() : v);

    return new Zona(
      Number(item.idZona),
      trim(item.nombre),
      typeof item.costoEnvio === 'string'
        ? parseFloat(item.costoEnvio)
        : Number(item.costoEnvio),
      new Date(item.createdAt),
      new Date(item.updatedAt),
      trim(item.ciudad ?? ''),
      trim(item.provincia ?? '')
    );
  }

  static adaptList(list?: any[]): Zona[] {
    return Array.isArray(list) ? list.map(Zona.adapt) : [];
  }
}

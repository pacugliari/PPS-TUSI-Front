// validators/adapters.ts

export class Profile {
  constructor(
    public idPerfil: number,
    public idUsuario: number,
    public nombre: string,
    public tipoDocumento: string,
    public dni: number,
    public telefono: string,
    public email: string
  ) {}

  static adapt(item: any): Profile {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idPerfil == null) missing.push('idPerfil');
    if (item?.idUsuario == null) missing.push('idUsuario');
    if (!item?.nombre) missing.push('nombre');
    if (!item?.tipoDocumento) missing.push('tipoDocumento');
    if (item?.dni == null) missing.push('dni');
    if (item?.telefono == null) missing.push('telefono');
    if (!item?.usuario?.email) missing.push('usuario.email');
    if (missing.length)
      throw new Error(`Invalid profile: missing ${missing.join(', ')}`);

    return new Profile(
      Number(item.idPerfil),
      Number(item.idUsuario),
      String(item.nombre).trim(),
      String(item.tipoDocumento).trim(),
      Number(item.dni),
      String(item.telefono ?? '').trim(),
      String(item.usuario.email).trim()
    );
  }
}

export class Zona {
  constructor(
    public idZona: number,
    public nombre: string,
    public ciudad: string,
    public provincia: string,
    public costoEnvio: number
  ) {}

  static adapt(item: any): Zona {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idZona == null) missing.push('idZona');
    if (missing.length)
      throw new Error(`Invalid zona: missing ${missing.join(', ')}`);

    const n = (v: any) => (typeof v === 'string' ? Number(v) : Number(v ?? 0));
    const costo = n(item.costoEnvio);
    return new Zona(
      Number(item.idZona),
      String(item.nombre ?? '').trim(),
      String(item.ciudad ?? '').trim(),
      String(item.provincia ?? '').trim(),
      isNaN(costo) ? 0 : costo
    );
  }
}

export class DireccionAdapted {
  constructor(
    public id: number,
    public idZona: number,
    public idUsuario: number,
    public direccion: string,
    public cp: string | null,
    public alias: string | null,
    public localidad: string | null,
    public adicionales: string | null,
    public principal: boolean,
    public zona: Zona
  ) {}

  static adapt(item: any): DireccionAdapted {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idDireccion == null) missing.push('idDireccion');
    if (item?.idZona == null && item?.zona?.idZona == null)
      missing.push('idZona');
    if (item?.idUsuario == null) missing.push('idUsuario');
    if (!item?.direccion) missing.push('direccion');
    if (item?.principal == null) missing.push('principal');
    if (missing.length)
      throw new Error(`Invalid direccion: missing ${missing.join(', ')}`);

    const zonaSrc = item.zona ?? {
      idZona: item.idZona,
      nombre: null,
      ciudad: null,
      provincia: null,
      costoEnvio: item?.zona?.costoEnvio ?? 0,
    };

    const zona = Zona.adapt(zonaSrc);

    return new DireccionAdapted(
      Number(item.idDireccion),
      Number(zona.idZona),
      Number(item.idUsuario),
      String(item.direccion).trim(),
      item.cp != null ? String(item.cp).trim() : null,
      item.alias != null ? String(item.alias).trim() : null,
      item.localidad != null ? String(item.localidad).trim() : null,
      item.adicionales != null ? String(item.adicionales).trim() : null,
      Boolean(item.principal),
      zona
    );
  }
}

export class CheckoutOptions {
  constructor(
    public perfil: Profile | null,
    public direcciones: DireccionAdapted[]
  ) {}

  static adapt(item: any): CheckoutOptions {
    if (!item) throw new Error('Invalid checkout options: missing item');

    const perfil = item.perfil ? Profile.adapt(item.perfil) : null;
    const direcciones = Array.isArray(item.direcciones)
      ? item.direcciones.map((d: any) => DireccionAdapted.adapt(d))
      : [];

    return new CheckoutOptions(perfil, direcciones);
  }
}

export type CardsTypes = 'VISA' | 'MASTERCARD';

export class CardBank {
  constructor(public id: number, public nombre: string) {}
  static adapt(item: any): CardBank {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.id == null) missing.push('id');
    if (!item?.nombre) missing.push('nombre');
    if (missing.length)
      throw new Error(`Invalid bank: missing ${missing.join(', ')}`);
    return new CardBank(Number(item.id), String(item.nombre).trim());
  }
}

export class CardPromo {
  constructor(
    public idPromocionBancaria: number,
    public idBanco: number,
    public nombre: string,
    public fechaDesde: string | null,
    public fechaHasta: string | null,
    public activo: boolean,
    public dias: string[],
    public porcentaje: number
  ) {}

  static adapt(item: any): CardPromo {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idPromocionBancaria == null) missing.push('idPromocionBancaria');
    if (item?.idBanco == null) missing.push('idBanco');
    if (!item?.nombre) missing.push('nombre');
    if (item?.activo == null) missing.push('activo');
    if (item?.porcentaje == null) missing.push('porcentaje');
    if (missing.length)
      throw new Error(`Invalid promo: missing ${missing.join(', ')}`);

    const pct = Number(item.porcentaje);
    const dias = Array.isArray(item.dias)
      ? item.dias.map((d: any) => String(d))
      : [];
    const fmt = (s: any) => (s == null ? null : String(s));

    return new CardPromo(
      Number(item.idPromocionBancaria),
      Number(item.idBanco),
      String(item.nombre).trim(),
      fmt(item.fechaDesde),
      fmt(item.fechaHasta),
      Boolean(item.activo),
      dias,
      isNaN(pct) ? 0 : pct
    );
  }
}

export type ValidateCardRequest = {
  cardBrand: 'VISA' | 'MASTERCARD';
  last4: string;
  cvv: string;
};

export class CardValidationResponse {
  constructor(
    public idTarjeta: number,
    public valida: boolean,
    public error: string | null,
    public banco: CardBank | null,
    public promocion: CardPromo | null
  ) {}

  static adapt(item: any): CardValidationResponse {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idTarjeta == null) missing.push('idTarjeta');
    if (item?.valida == null) missing.push('valida');
    if (missing.length)
      throw new Error(`Invalid card validation: missing ${missing.join(', ')}`);

    return new CardValidationResponse(
      Number(item.idTarjeta),
      Boolean(item.valida),
      item.error == null ? null : String(item.error),
      item.banco ? CardBank.adapt(item.banco) : null,
      item.promocion ? CardPromo.adapt(item.promocion) : null
    );
  }
}


const toISOInstant = (d: any): string => new Date(d).toISOString();

export class Zone {
  constructor(
    public idZona: number,
    public nombre: string,
    public ciudad: string,
    public provincia: string,
    public costoEnvio: number,
    public createdAt: string, // ISO instant
    public updatedAt: string  // ISO instant
  ) {}

  static adapt(item: any): Zone {
    if (
      !item ||
      item.idZona == null ||
      item.nombre == null ||
      item.ciudad == null ||
      item.provincia == null ||
      item.costoEnvio == null ||
      !item.createdAt ||
      !item.updatedAt
    ) {
      throw new Error('Invalid zone data');
    }

    return new Zone(
      Number(item.idZona),
      String(item.nombre ?? '').trim(),
      String(item.ciudad ?? '').trim(),
      String(item.provincia ?? '').trim(),
      Number(item.costoEnvio),
      toISOInstant(item.createdAt),
      toISOInstant(item.updatedAt),
    );
  }

  static adaptList(list?: any[]): Zone[] {
    return Array.isArray(list) ? list.map(Zone.adapt) : [];
  }

  get label(): string {
    const ciudadProv = [this.ciudad, this.provincia].filter(Boolean).join(', ');
    return `${this.nombre} — ${ciudadProv}`;
  }
}

export interface ZoneUpsertDto {
  nombre: string;
  ciudad: string;
  provincia: string;
  costoEnvio: number; // >= 0
}

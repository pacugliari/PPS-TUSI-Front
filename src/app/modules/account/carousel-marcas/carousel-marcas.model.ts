const toISOInstant = (d: any): string => new Date(d).toISOString();

export class CarouselMarca {
  constructor(
    public idCarruselMarcas: number,
    public nombre: string,
    public logoUrl: string,
    public orden: number | null,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static adapt(item: any): CarouselMarca {
    return new CarouselMarca(
      Number(item.idCarruselMarcas),
      String(item.nombre ?? '').trim(),
      String(item.logoUrl ?? '').trim(),
      item.orden ?? null,
      toISOInstant(item.createdAt ?? new Date()),
      toISOInstant(item.updatedAt ?? new Date())
    );
  }

  static adaptList(list?: any[]): CarouselMarca[] {
    return Array.isArray(list) ? list.map(CarouselMarca.adapt) : [];
  }
}

export interface CarouselMarcaUpsertDto {
  nombre: string;
  logoUrl: string;
  orden?: number | null;
}

const toISOInstant = (d: any): string => new Date(d).toISOString();

export class CarouselPrincipal {
  constructor(
    public idCarruselPrincipal: number,
    public titulo: string | null,
    public descripcion: string | null,
    public imagenUrl: string,
    public link: string | null,
    public orden: number | null,
    public createdAt: string,
    public updatedAt: string
  ) {}

  static adapt(item: any): CarouselPrincipal {
    return new CarouselPrincipal(
      item.idCarruselPrincipal,
      item.titulo ?? null,
      item.descripcion ?? null,
      item.imagenUrl,
      item.link ?? null,
      item.orden ?? null,
      toISOInstant(item.createdAt),
      toISOInstant(item.updatedAt)
    );
  }

  static adaptList(list?: any[]): CarouselPrincipal[] {
    return Array.isArray(list) ? list.map(CarouselPrincipal.adapt) : [];
  }
}

export interface CarouselPrincipalUpsertDto {
  titulo?: string | null;
  descripcion?: string | null;
  imagenUrl: string;
  link?: string | null;
  orden?: number | null;
}

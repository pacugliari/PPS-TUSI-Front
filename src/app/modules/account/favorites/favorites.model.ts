export class Favorite {
  constructor(
    public idProducto: number,
    public nombre: string,
    public precio: number,
    public fotos: string[]
  ) {}

  static adapt(item: any): Favorite {
    if (
      !item ||
      !item.idProducto ||
      !item.nombre ||
      item.precio == null ||
      !item.fotos
    ) {
      throw new Error('Invalid favorite data');
    }

    const fotos: string[] = Array.isArray(item.fotos) ? item.fotos : [];
    const precio =
      typeof item.precio === 'string'
        ? parseFloat(item.precio)
        : Number(item.precio);

    return new Favorite(
      Number(item.idProducto),
      String(item.nombre).trim(),
      isNaN(precio) ? 0 : precio,
      fotos
    );
  }

  static adaptList(list?: any[]): Favorite[] {
    return Array.isArray(list) ? list.map(Favorite.adapt) : [];
  }
}

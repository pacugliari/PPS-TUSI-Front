// shop.model.ts
export class Producto {
  constructor(
    public idProducto: number,
    public nombre: string,
    public descripcion: string,
    public fotos: string[],
    public categoria: Categoria,
    public precio: number,
    public precioAnterior: number | null
  ) {}

  static adapt(item: any): Producto {
    const missing: string[] = [];

    if (!item) missing.push('item');
    if (item?.idProducto == null) missing.push('idProducto');
    if (!item?.nombre) missing.push('nombre');
    if (!item?.descripcion) missing.push('descripcion');
    if (!item?.fotos) missing.push('fotos');
    if (!item?.categoria) missing.push('categoria');
    if (item?.precio == null) missing.push('precio');

    if (missing.length) {
      throw new Error(`Invalid product data, missing: ${missing.join(', ')}`);
    }

    const fotos: string[] = Array.isArray(item.fotos) ? item.fotos : [];
    const precio =
      typeof item.precio === 'string' ? parseFloat(item.precio) : Number(item.precio);

    const precioAnterior =
      item.precioAnterior === null || item.precioAnterior === undefined
        ? null
        : typeof item.precioAnterior === 'string'
        ? parseFloat(item.precioAnterior)
        : Number(item.precioAnterior);

    return new Producto(
      Number(item.idProducto),
      String(item.nombre).trim(),
      String(item.descripcion).trim(),
      fotos,
      Categoria.adapt(item.categoria),
      isNaN(precio) ? 0 : precio,
      precioAnterior !== null && isNaN(precioAnterior) ? null : (precioAnterior as number | null)
    );
  }

  static adaptList(list: any[] | null | undefined): Producto[] {
    if (!list) return [];
    return list.map(Producto.adapt);
  }
}

export class Categoria {
  constructor(public idCategoria: number, public nombre: string) {}

  static adapt(item: any): Categoria {
    const missing: string[] = [];
    if (!item) missing.push('categoria');
    if (item?.idCategoria == null) missing.push('categoria.idCategoria');
    if (!item?.nombre) missing.push('categoria.nombre');

    if (missing.length) {
      throw new Error(`Invalid category data, missing: ${missing.join(', ')}`);
    }

    return new Categoria(Number(item.idCategoria), String(item.nombre).trim());
  }
}

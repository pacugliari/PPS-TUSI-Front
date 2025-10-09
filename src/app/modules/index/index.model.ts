export class Producto {
  constructor(
    public idProducto: number,
    public nombre: string,
    public fotos: string[],
    public categoria: Categoria,
    public precio: number,
    public precioAnterior: number | null
  ) {}

  static adapt(item: any): Producto {
    if (
      !item.idProducto ||
      !item.nombre ||
      !item.fotos ||
      !item.categoria ||
      !item.precio
    ) {
      throw new Error('Invalid product data');
    }

    return new Producto(
      item.idProducto,
      item.nombre,
      item.fotos,
      Categoria.adapt(item.categoria),
      parseFloat(item.precio),
      item.precioAnterior !== null ? parseFloat(item.precioAnterior) : null
    );
  }
}

export class Categoria {
  constructor(
    public idCategoria: number,
    public nombre: string
  ) {}

  static adapt(item: any): Categoria {
    if (!item.idCategoria || !item.nombre) {
      throw new Error('Invalid category data');
    }

    return new Categoria(item.idCategoria, item.nombre);
  }
}

export class Producto {
  constructor(
    public idProducto: number,
    public nombre: string,
    public precio: number,
    public fotos: string[],
    public categoria: Categoria
  ) {}

  static adapt(item: any) {
    if (
      !item.idProducto ||
      !item.nombre ||
      !item.precio ||
      item.fotos ||
      !item.categoria
    ) {
      throw new Error('Invalid product data');
    }

    return new Producto(
      item.idProducto,
      item.nombre,
      item.precio,
      item.fotos,
      Categoria.adapt(item.categoria)
    );
  }
}

export class Categoria {
  constructor(public idCategoria: number, public nombre: string) {}

  static adapt(item: any) {
    if (!item.idRol || !item.nombre) {
      throw new Error('Invalid category data');
    }

    return new Categoria(item.idRol, item.nombre);
  }
}

export interface CartIdQty {
  idProducto: number;
  cantidad: number;
}

export class ProductInCart {
  constructor(
    public idProducto: number,
    public nombre: string,
    public precio: number,
    public imagen: string | null,
    public iva: number | null
  ) {}

  static adapt(item: any): ProductInCart {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idProducto == null) missing.push('idProducto');
    if (!item?.nombre) missing.push('nombre');
    if (item?.precio == null) missing.push('precio');
    if (item?.iva == null) missing.push('iva');

    if (missing.length) {
      throw new Error(`Invalid cart product: missing ${missing.join(', ')}`);
    }

    const precio =
      typeof item.precio === 'string'
        ? parseFloat(item.precio)
        : Number(item.precio);

    return new ProductInCart(
      Number(item.idProducto),
      String(item.nombre).trim(),
      isNaN(precio) ? 0 : precio,
      Array.isArray(item.fotos) && item.fotos.length
        ? String(item.fotos[0])
        : item.imagen ?? null,
      item.iva ? parseFloat(item.iva) :  null
    );
  }

  static adaptList(list?: any[]): ProductInCart[] {
    return Array.isArray(list) ? list.map(ProductInCart.adapt) : [];
  }
}

export class CartLine {
  constructor(public producto: ProductInCart, public cantidad: number) {}

  get total(): number {
    return this.producto.precio * this.cantidad;
  }
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

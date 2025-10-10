export interface CartIdQty {
  idProducto: number;
  cantidad: number;
}

export class ProductInCart {
  constructor(
    public idProducto: number,
    public nombre: string,
    public precio: number,
    public imagen: string | null
  ) {}

  static adapt(item: any): ProductInCart {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (item?.idProducto == null) missing.push('idProducto');
    if (!item?.nombre) missing.push('nombre');
    if (item?.precio == null) missing.push('precio');

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
        : item.imagen ?? null
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

export class Coupon {
  constructor(public code: string, public percent: number) {}

  static adapt(item: any): Coupon {
    const missing: string[] = [];
    if (!item) missing.push('item');
    if (!item?.code) missing.push('code');
    if (item?.percent == null) missing.push('percent');
    if (missing.length) {
      throw new Error(`Invalid coupon: missing ${missing.join(', ')}`);
    }

    const p = Number(item.percent);
    return new Coupon(String(item.code).trim(), isNaN(p) ? 0 : p);
  }
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  total: number;
}

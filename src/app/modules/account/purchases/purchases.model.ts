export type PedidoEstado = 'pagado' | 'pendiente' | 'cancelado';

export class PedidoSummary {
  constructor(
    public idPedido: number,
    public fechaISO: string,
    public fechaView: string,
    public estado: PedidoEstado,
    public subtotal: number,
    public impuestos: number,
    public total: number,
    public formaPago: string
  ) {}

  static adapt(item: any): PedidoSummary {
    if (!item) throw new Error('Invalid pedido data');

    const errors: string[] = [];

    if (item.idPedido == null) errors.push('idPedido');
    if (!item.fecha) errors.push('fecha');
    if (!item.estado) errors.push('estado');
    if (item.total == null) errors.push('total');

    if (errors.length > 0) {
      throw new Error(`Invalid pedido data, missing: ${errors.join(', ')}`);
    }

    const iso = String(item.fecha);
    const view = new Date(iso).toLocaleDateString('es-AR');

    return new PedidoSummary(
      Number(item.idPedido),
      iso,
      view,
      String(item.estado) as PedidoEstado,
      parseNum(item.subtotal ?? 0),
      parseNum(item.impuestos ?? 0),
      parseNum(item.total),
      String(item.formaPago ?? '')
    );
  }

  static adaptList(list: any[] | null | undefined): PedidoSummary[] {
    if (!list) return [];
    return list.map(PedidoSummary.adapt);
  }
}

export class PedidoDetail {
  constructor(
    public idPedido: number,
    public items: PedidoDetailItem[],
    public total: number
  ) {}

  static adapt(payload: any): PedidoDetail {
    if (!payload) throw new Error('Invalid pedido detail data');

    const missing: string[] = [];
    if (payload.idPedido == null) missing.push('idPedido');
    if (!Array.isArray(payload.items ?? payload.detalle)) missing.push('items');
    if (missing.length) {
      throw new Error(
        `Invalid pedido detail data, missing: ${missing.join(', ')}`
      );
    }

    const items = PedidoDetailItem.adaptList(
      payload.items ?? payload.detalle ?? []
    );
    const total =
      payload.total != null
        ? parseNum(payload.total)
        : items.reduce((acc, it) => acc + it.subtotal, 0);

    return new PedidoDetail(Number(payload.idPedido), items, total);
  }
}

export class PedidoDetailItem {
  constructor(
    public idProducto: number,
    public articulo: string,
    public precio: number,
    public cantidad: number,
    public subtotal: number,
    public calificado: boolean
  ) {}

  static adapt(item: any): PedidoDetailItem {
    if (!item) throw new Error('Invalid pedido item data');

    const errors: string[] = [];

    if (!item.calificado) errors.push('calificado');
    if (!item.idProducto) errors.push('idProducto');
    if (!item.articulo) errors.push('articulo');
    if (item.precio == null) errors.push('precio');
    if (item.cantidad == null) errors.push('cantidad');

    if (errors.length > 0) {
      throw new Error(
        `Invalid pedido item data, missing: ${errors.join(', ')}`
      );
    }

    const precio = parseNum(item.precio);
    const cantidad = Number(item.cantidad);
    const subtotal =
      item.subtotal != null ? parseNum(item.subtotal) : precio * cantidad;

    return new PedidoDetailItem(
      item.idProducto,
      String(item.articulo),
      precio,
      cantidad,
      subtotal,
      Boolean(item.calificado)
    );
  }

  static adaptList(list: any[] | null | undefined): PedidoDetailItem[] {
    if (!list) return [];
    return list.map(PedidoDetailItem.adapt);
  }
}

function parseNum(value: any): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

export interface ProductRatingDto {
  puntuacion: number; // 1 a 5
  comentario?: string; // opcional
}

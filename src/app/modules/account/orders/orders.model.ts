// purchases.model.ts

export type PedidoEstado =
  | 'pagado'
  | 'pendiente'
  | 'cancelado'
  | 'reservado'
  | 'enviado'
  | 'entregado'
  | 'devuelto';

export interface PedidoCliente {
  idUsuario: number;
  email: string;
  nombre?: string;
  telefono?: string;
}

export class PedidoSummary {
  constructor(
    public idPedido: number,
    public fechaISO: string,
    public fechaView: string,
    public estado: PedidoEstado,
    public subtotal: number,
    public impuestos: number,
    public descuentoCupon: number,
    public descuentoBanco: number,
    public costoEnvio: number,
    public total: number,
    public formaPago: string,
    public porcentajeCupon: number,
    public porcentajeBanco: number,
    public subtotalBruto?: number,
    public baseImponible?: number,
    public cliente?: PedidoCliente
  ) {}

  static adapt(item: any): PedidoSummary {
    if (!item) throw new Error('Invalid pedido data');

    const missing: string[] = [];
    if (item.idPedido == null) missing.push('idPedido');
    if (!item.fecha) missing.push('fecha');
    if (!item.estado) missing.push('estado');
    if (item.total == null) missing.push('total');
    if (missing.length) {
      throw new Error(`Invalid pedido data, missing: ${missing.join(', ')}`);
    }

    const iso = String(item.fecha);
    const view = new Date(iso).toLocaleDateString('es-AR');

    const cliente: PedidoCliente | undefined = item.usuario
      ? {
          idUsuario: Number(item.usuario.idUsuario),
          email: String(item.usuario.email ?? ''),
          nombre: item.usuario.perfil?.nombre,
          telefono: item.usuario.perfil?.telefono,
        }
      : undefined;

    return new PedidoSummary(
      Number(item.idPedido),
      iso,
      view,
      String(item.estado) as PedidoEstado,
      parseNum(item.subtotal ?? 0),
      parseNum(item.impuestos ?? 0),
      parseNum(item.descuentoCupon ?? 0),
      parseNum(item.descuentoBanco ?? 0),
      parseNum(item.costoEnvio ?? 0),
      parseNum(item.total ?? 0),
      String(item.formaPago ?? ''),
      parseNum(item.porcentajeCupon ?? 0),
      parseNum(item.porcentajeBanco ?? 0),
      parseNum(item.subtotalBruto ?? 0),
      parseNum(item.baseImponible ?? 0),
      cliente
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
    public subtotal: number,
    public impuestos: number,
    public descuentoCupon: number,
    public descuentoBanco: number,
    public costoEnvio: number,
    public total: number,
    public porcentajeCupon: number,
    public porcentajeBanco: number,
    public subtotalBruto?: number,
    public baseImponible?: number,
    public cliente?: PedidoCliente
  ) {}

  static adapt(payload: any): PedidoDetail {
    if (!payload) throw new Error('Invalid pedido detail data');

    const missing: string[] = [];
    if (payload.idPedido == null) missing.push('idPedido');
    if (!Array.isArray(payload.items ?? payload.detalle)) missing.push('items');
    if (missing.length) {
      throw new Error(`Invalid pedido detail data, missing: ${missing.join(', ')}`);
    }

    const items = PedidoDetailItem.adaptList(payload.items ?? payload.detalle ?? []);

    const cliente: PedidoCliente | undefined = payload.usuario
      ? {
          idUsuario: Number(payload.usuario.idUsuario),
          email: String(payload.usuario.email ?? ''),
          nombre: payload.usuario.perfil?.nombre,
          telefono: payload.usuario.perfil?.telefono,
        }
      : undefined;

    return new PedidoDetail(
      Number(payload.idPedido),
      items,
      parseNum(payload.subtotal ?? 0),
      parseNum(payload.impuestos ?? 0),
      parseNum(payload.descuentoCupon ?? 0),
      parseNum(payload.descuentoBanco ?? 0),
      parseNum(payload.costoEnvio ?? 0),
      parseNum(payload.total ?? 0),
      parseNum(payload.porcentajeCupon ?? 0),
      parseNum(payload.porcentajeBanco ?? 0),
      parseNum(payload.subtotalBruto ?? 0),
      parseNum(payload.baseImponible ?? 0),
      cliente
    );
  }
}

export class PedidoDetailItem {
  constructor(
    public idProducto: number,
    public articulo: string,
    public precio: number,
    public cantidad: number,
    public subtotal: number,
    public calificado: boolean,
    public iva: number
  ) {}

  static adapt(item: any): PedidoDetailItem {
    if (!item) throw new Error('Invalid pedido item data');

    const errors: string[] = [];
    if (item.idProducto == null) errors.push('idProducto');
    if (item.articulo == null) errors.push('articulo');
    if (item.precio == null) errors.push('precio');
    if (item.cantidad == null) errors.push('cantidad');
    if (item.iva == null) errors.push('iva');

    if (errors.length > 0) {
      throw new Error(`Invalid pedido item data, missing: ${errors.join(', ')}`);
    }

    const precio = parseNum(item.precio);
    const cantidad = Number(item.cantidad);
    const subtotal = item.subtotal != null ? parseNum(item.subtotal) : precio * cantidad;

    return new PedidoDetailItem(
      Number(item.idProducto),
      String(item.articulo),
      precio,
      cantidad,
      subtotal,
      Boolean(item.calificado ?? false),
      Number(item.iva ?? 0)
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

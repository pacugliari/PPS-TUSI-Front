const toISOInstant = (d: any): string => new Date(d).toISOString();

export type PurchaseOrderStatus = 'pendiente' | 'entregado';

export interface PurchaseOrderItem {
  idItemOrdenCompra: number;
  idProducto: number;
  nombre: string;
  precio: number;
  cantidad: number;
  cantidadRecibida: number | null;
  iva: number;
  subtotal: number;
}

export interface PurchaseOrderDetail {
  idOrdenCompra: number;
  fecha: string;
  estado: PurchaseOrderStatus;
  subtotalBruto: number;
  impuestos: number;
  total: number;
  items: PurchaseOrderItem[];
}

export class PurchaseOrder {
  constructor(
    public idOrdenCompra: number,
    public fecha: string,
    public estado: PurchaseOrderStatus
  ) {}

  static adapt(item: any): PurchaseOrder {
    return new PurchaseOrder(
      Number(item.idOrdenCompra),
      toISOInstant(item.fecha),
      String(item.estado) as PurchaseOrderStatus
    );
  }

  static adaptList(list?: any[]): PurchaseOrder[] {
    return Array.isArray(list) ? list.map(PurchaseOrder.adapt) : [];
  }
}

export function adaptOrderDetail(data: any): PurchaseOrderDetail {
  return {
    idOrdenCompra: Number(data.idOrdenCompra),
    fecha: String(data.fecha),
    estado: String(data.estado) as PurchaseOrderStatus,
    subtotalBruto: Number(data.subtotalBruto ?? 0),
    impuestos: Number(data.impuestos ?? 0),
    total: Number(data.total ?? 0),

    items: Array.isArray(data.items)
      ? data.items.map((it: any) => ({
          idItemOrdenCompra: Number(it.idItemOrdenCompra ?? 0),
          idProducto: Number(it.idProducto),
          nombre: String(it.nombre),
          precio: Number(it.precio),
          cantidad: Number(it.cantidad),
          cantidadRecibida:
            it.cantidadRecibida !== null && it.cantidadRecibida !== undefined
              ? Number(it.cantidadRecibida)
              : null,
          iva: Number(it.iva),
          subtotal: Number(it.subtotal),
        }))
      : [],
  };
}

export interface ProductToReplenish {
  idProducto: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  reservado: number;
  comprometido: number;
  disponibilidad: number;
  cantidadAReponer: number;
}

export interface MarkDeliveredDto {
  items: {
    idItemOrdenCompra: number;
    cantidadRecibida: number;
  }[];
}

export interface CreateOrderItemDto {
  idProducto: number;
  cantidad: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
}

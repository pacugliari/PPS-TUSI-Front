export type ReturnEstado = 'revision' | 'aprobado' | 'rechazado' | 'devuelto';

export class Return {
  constructor(
    public idDevolucion: number,
    public idPedido: number,
    public idProducto: number,
    public producto: string,
    public motivo: string,
    public comentario: string | null,
    public estado: ReturnEstado,
    public fecha: string,
    public activo: boolean,
    public usuario?: string
  ) {}

  static adapt(item: any): Return {
    if (!item) throw new Error('Invalid return data');

    const missing: string[] = [];
    if (item.idDevolucion == null) missing.push('idDevolucion');
    if (item.idPedido == null) missing.push('idPedido');
    if (item.idProducto == null) missing.push('idProducto');
    if (!item.motivo) missing.push('motivo');
    if (!item.estado) missing.push('estado');
    if (!item.fecha) missing.push('fecha');

    if (missing.length > 0) {
      throw new Error(`Invalid return data, missing: ${missing.join(', ')}`);
    }

    const productoNombre =
      item.producto?.nombre ??
      (typeof item.producto === 'string' ? item.producto : 'Desconocido');

    const motivoMap: Record<string, string> = {
      producto_defectuoso: 'Producto defectuoso',
      producto_incorrecto: 'Producto incorrecto',
      producto_incompleto: 'Producto incompleto',
    };
    const motivoLegible = motivoMap[item.motivo] ?? item.motivo;

    const fechaISO = String(item.fecha);

    return new Return(
      Number(item.idDevolucion),
      Number(item.idPedido),
      Number(item.idProducto),
      productoNombre,
      motivoLegible,
      item.comentario ?? null,
      String(item.estado) as ReturnEstado,
      fechaISO,
      Boolean(item.activo),
      item.pedido?.usuario?.email
    );
  }

  static adaptList(list: any[] | null | undefined): Return[] {
    if (!list) return [];
    return list.map(Return.adapt);
  }
}

function parseNum(value: any): number {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

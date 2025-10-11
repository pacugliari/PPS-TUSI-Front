export type MetodoEnvio = 'DOMICILIO' | 'RETIRO';
export type MetodoPago  = 'EFECTIVO' | 'ONLINE';

export interface Direccion {
  id: number;
  etiqueta?: string;                 // alias
  calle: string;                     // ej: "Av. Siempre Viva 742"
  cp?: string;
  adicionales?: string;
  principal?: boolean;
  zona?: {
    id: number;
    nombre: string;
    ciudad: string;                  // viene en zona
    provincia: string;               // viene en zona
    costoEnvio: number;              // costo envío por zona
  };
}

export interface UserProfile {
  nombreCompleto: string;
  email: string;
  telefono: string;
  // ❌ ya no trae direcciones
}

export interface CheckoutSummary {
  subtotal: number;
  descuento: number;
  total: number; // subtotal - descuento (sin envío)
}

export interface CheckoutVM extends CheckoutSummary {
  percent: number;
  coupon: { code?: string; percent?: number } | null;

  // selección/envío/pago
  metodoEnvio: MetodoEnvio;
  metodoPago:  MetodoPago;
  selectedAddressId: number | null;

  // direcciones para el template
  direcciones: Direccion[];

  // costos
  costoEnvioDomicilio: number;
  totalConEnvio: number;
  iva: number;            // 21%
  totalConIva: number;

  // pago online
  tarjetaSeleccionada: string | null;
  ultimos4: string;
  codigoValidacion: string;

  // perfil (solo lectura)
  profile: UserProfile | null;
}

export interface CheckoutPayload {
  envio: MetodoEnvio;
  direccionId: number | null;
  pago: MetodoPago;
  tarjeta: string | null;
  ultimos4: string | null;
  total: number; // total final (con IVA)
}

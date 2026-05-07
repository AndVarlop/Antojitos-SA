export interface Cliente {
  id: string;
  nombre: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
  limite_credito: number;
  saldo_credito: number;
  verificado: boolean;
  activo: boolean;
  is_admin: boolean;
  created_at?: string;
}

export interface AdminEstadisticas {
  pedidos_total: number;
  pedidos_hoy: number;
  pedidos_pendientes: number;
  ingresos_total: number;
  ingresos_mes: number;
  clientes_total: number;
  clientes_verificados: number;
  credito_otorgado: number;
  credito_usado: number;
  productos_activos: number;
  productos_agotados: number;
}

export interface PedidoDetallado {
  id: string;
  created_at: string;
  estado: EstadoPedido;
  metodo_pago: MetodoPago;
  total: number;
  notas: string | null;
  cliente_nombre: string;
  cliente_telefono: string | null;
  cliente_email: string | null;
  cliente_id: string | null;
  cliente_perfil_nombre: string | null;
  calle: string | null;
  numero: string | null;
  colonia: string | null;
  ciudad: string | null;
  cp: string | null;
  items_count: number;
}

export interface Direccion {
  id: string;
  cliente_id: string;
  etiqueta: string;
  calle: string;
  numero: string | null;
  colonia: string | null;
  ciudad: string;
  estado: string | null;
  cp: string | null;
  referencias: string | null;
  predeterminada: boolean;
  created_at?: string;
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'credito';
export type EstadoPedido = 'pendiente' | 'confirmado' | 'en_preparacion' | 'en_camino' | 'entregado' | 'cancelado';

export interface Pedido {
  id: string;
  cliente_id: string | null;
  cliente_nombre: string;
  cliente_email: string | null;
  cliente_telefono: string | null;
  direccion_id: string | null;
  metodo_pago: MetodoPago;
  notas: string | null;
  total: number;
  estado: EstadoPedido;
  created_at: string;
}

export interface MovimientoCredito {
  id: string;
  cliente_id: string;
  pedido_id: string | null;
  tipo: 'cargo' | 'abono' | 'ajuste';
  monto: number;
  saldo_resultante: number;
  notas: string | null;
  created_at: string;
}

export interface RegistroInput {
  email: string;
  password: string;
  nombre: string;
  telefono?: string;
}

export interface CheckoutInput {
  direccion_id: string | null;
  metodo_pago: MetodoPago;
  notas?: string;
  items: { producto_id: string; cantidad: number }[];
}

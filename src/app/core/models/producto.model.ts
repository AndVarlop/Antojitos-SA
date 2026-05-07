export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  categoria: string;
  stock: number;
  activo: boolean;
  created_at?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface PedidoInput {
  cliente_nombre: string;
  cliente_email?: string;
  cliente_telefono?: string;
  items: { producto_id: string; cantidad: number }[];
}

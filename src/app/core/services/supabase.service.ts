import { Injectable, inject, signal } from '@angular/core';
import { Producto } from '../models/producto.model';
import { CheckoutInput, MovimientoCredito, Pedido } from '../models/cliente.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private auth = inject(AuthService);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  async cargarProductos(categoria?: string, q?: string): Promise<Producto[]> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      let query = this.auth.db.from('productos').select('*').eq('activo', true);
      if (categoria) query = query.eq('categoria', categoria);
      if (q && q.trim()) query = query.ilike('nombre', `%${q.trim()}%`);
      const { data, error } = await query.order('precio', { ascending: true });
      if (error) throw error;
      const lista = (data ?? []) as Producto[];
      this.productos.set(lista);
      return lista;
    } catch (e: any) {
      this.error.set(e?.message ?? 'Error al cargar productos');
      return [];
    } finally {
      this.cargando.set(false);
    }
  }

  async calcularTotal(items: { producto_id: string; cantidad: number }[]): Promise<number> {
    const { data, error } = await this.auth.db.rpc('calcular_total_pedido', { items });
    if (error) throw error;
    return Number(data ?? 0);
  }

  async crearPedidoAutenticado(input: CheckoutInput): Promise<string> {
    const { data, error } = await this.auth.db.rpc('crear_pedido_autenticado', {
      p_direccion_id: input.direccion_id,
      p_metodo_pago: input.metodo_pago,
      p_notas: input.notas ?? null,
      p_items: input.items
    });
    if (error) throw error;
    return data as string;
  }

  async crearPedidoInvitado(payload: {
    cliente_nombre: string;
    cliente_email?: string;
    cliente_telefono?: string;
    items: { producto_id: string; cantidad: number }[];
  }): Promise<string> {
    const { data, error } = await this.auth.db.rpc('descontar_stock_y_crear_pedido', {
      p_cliente_nombre: payload.cliente_nombre,
      p_cliente_email: payload.cliente_email ?? null,
      p_cliente_telefono: payload.cliente_telefono ?? null,
      p_items: payload.items
    });
    if (error) throw error;
    return data as string;
  }

  async misPedidos(): Promise<Pedido[]> {
    const uid = this.auth.session()?.user.id;
    if (!uid) return [];
    const { data, error } = await this.auth.db
      .from('pedidos')
      .select('*')
      .eq('cliente_id', uid)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Pedido[];
  }

  async movimientosCredito(): Promise<MovimientoCredito[]> {
    const uid = this.auth.session()?.user.id;
    if (!uid) return [];
    const { data, error } = await this.auth.db
      .from('creditos_movimientos')
      .select('*')
      .eq('cliente_id', uid)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as MovimientoCredito[];
  }

  async abonarCredito(monto: number, notas?: string): Promise<number> {
    const { data, error } = await this.auth.db.rpc('abonar_credito', {
      p_monto: monto,
      p_notas: notas ?? null
    });
    if (error) throw error;
    await this.auth.cargarPerfil();
    return Number(data ?? 0);
  }
}

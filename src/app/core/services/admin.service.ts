import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Producto } from '../models/producto.model';
import {
  AdminEstadisticas,
  Cliente,
  EstadoPedido,
  PedidoDetallado
} from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private auth = inject(AuthService);

  async estadisticas(): Promise<AdminEstadisticas> {
    const { data, error } = await this.auth.db.rpc('admin_estadisticas');
    if (error) throw error;
    return data as AdminEstadisticas;
  }

  async pedidos(filtroEstado?: EstadoPedido | 'todos'): Promise<PedidoDetallado[]> {
    let q = this.auth.db.from('admin_pedidos_detallado').select('*').order('created_at', { ascending: false });
    if (filtroEstado && filtroEstado !== 'todos') q = q.eq('estado', filtroEstado);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as PedidoDetallado[];
  }

  async pedidoItems(pedidoId: string) {
    const { data, error } = await this.auth.db
      .from('pedido_items')
      .select('*, productos(nombre, imagen_url)')
      .eq('pedido_id', pedidoId);
    if (error) throw error;
    return data ?? [];
  }

  async cambiarEstado(pedidoId: string, estado: EstadoPedido): Promise<void> {
    const { error } = await this.auth.db.rpc('admin_cambiar_estado_pedido', {
      p_pedido_id: pedidoId,
      p_estado: estado
    });
    if (error) throw error;
  }

  async clientes(busqueda?: string): Promise<Cliente[]> {
    let q = this.auth.db.from('clientes').select('*').eq('is_admin', false).order('created_at', { ascending: false });
    if (busqueda && busqueda.trim()) q = q.ilike('nombre', `%${busqueda.trim()}%`);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as Cliente[];
  }

  async ajustarLimite(clienteId: string, nuevoLimite: number, notas?: string): Promise<void> {
    const { error } = await this.auth.db.rpc('admin_ajustar_credito', {
      p_cliente_id: clienteId,
      p_nuevo_limite: nuevoLimite,
      p_notas: notas ?? null
    });
    if (error) throw error;
  }

  async condonarSaldo(clienteId: string, monto: number, notas?: string): Promise<number> {
    const { data, error } = await this.auth.db.rpc('admin_condonar_saldo', {
      p_cliente_id: clienteId,
      p_monto: monto,
      p_notas: notas ?? null
    });
    if (error) throw error;
    return Number(data ?? 0);
  }

  // Productos
  async productos(): Promise<Producto[]> {
    const { data, error } = await this.auth.db.from('productos').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Producto[];
  }

  async crearProducto(p: Partial<Producto>): Promise<Producto> {
    const { data, error } = await this.auth.db.from('productos').insert(p).select().single();
    if (error) throw error;
    return data as Producto;
  }

  async actualizarProducto(id: string, p: Partial<Producto>): Promise<Producto> {
    const { data, error } = await this.auth.db.from('productos').update(p).eq('id', id).select().single();
    if (error) throw error;
    return data as Producto;
  }

  async eliminarProducto(id: string): Promise<void> {
    const { error } = await this.auth.db.from('productos').delete().eq('id', id);
    if (error) throw error;
  }

  // Bucket: "productos" (público) en Supabase Storage
  async subirImagenProducto(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await this.auth.db.storage
      .from('productos')
      .upload(nombre, file, { upsert: false, contentType: file.type });

    if (error) throw error;

    const { data } = this.auth.db.storage
      .from('productos')
      .getPublicUrl(nombre);

    return data.publicUrl;
  }

  async eliminarImagenProducto(url: string): Promise<void> {
    const nombre = url.split('/productos/').pop();
    if (!nombre) return;
    await this.auth.db.storage.from('productos').remove([nombre]);
  }
}

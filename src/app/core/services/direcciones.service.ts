import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Direccion } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class DireccionesService {
  private auth = inject(AuthService);

  async listar(): Promise<Direccion[]> {
    const uid = this.auth.session()?.user.id;
    if (!uid) return [];
    const { data, error } = await this.auth.db
      .from('direcciones')
      .select('*')
      .eq('cliente_id', uid)
      .order('predeterminada', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Direccion[];
  }

  async crear(d: Partial<Direccion>): Promise<Direccion> {
    const uid = this.auth.session()?.user.id;
    if (!uid) throw new Error('No autenticado');
    const { data, error } = await this.auth.db
      .from('direcciones')
      .insert({ ...d, cliente_id: uid })
      .select()
      .single();
    if (error) throw error;
    return data as Direccion;
  }

  async actualizar(id: string, d: Partial<Direccion>): Promise<Direccion> {
    const { data, error } = await this.auth.db
      .from('direcciones')
      .update(d)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Direccion;
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await this.auth.db.from('direcciones').delete().eq('id', id);
    if (error) throw error;
  }

  async setPredeterminada(id: string): Promise<void> {
    const uid = this.auth.session()?.user.id;
    if (!uid) throw new Error('No autenticado');
    await this.auth.db.from('direcciones').update({ predeterminada: false }).eq('cliente_id', uid);
    await this.auth.db.from('direcciones').update({ predeterminada: true }).eq('id', id);
  }
}

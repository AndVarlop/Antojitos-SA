import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { EstadoPedido, PedidoDetallado } from '../../core/models/cliente.model';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="head">
      <div>
        <h1>Pedidos</h1>
        <p class="muted">{{ pedidos().length }} pedidos</p>
      </div>
      <select [ngModel]="filtro()" (ngModelChange)="cambiarFiltro($event)" class="filtro">
        <option value="todos">Todos</option>
        <option value="pendiente">Pendientes</option>
        <option value="confirmado">Confirmados</option>
        <option value="en_preparacion">En preparación</option>
        <option value="en_camino">En camino</option>
        <option value="entregado">Entregados</option>
        <option value="cancelado">Cancelados</option>
      </select>
    </header>

    @if (cargando()) { <p>Cargando…</p> }

    <table class="tabla">
      <thead>
        <tr>
          <th>Folio</th>
          <th>Fecha</th>
          <th>Cliente</th>
          <th>Pago</th>
          <th>Total</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (p of pedidos(); track p.id) {
          <tr>
            <td class="folio">#{{ p.id.slice(0,8) }}</td>
            <td>{{ p.created_at | date:'short' }}</td>
            <td>
              <strong>{{ p.cliente_nombre }}</strong>
              @if (p.cliente_telefono) { <small>{{ p.cliente_telefono }}</small> }
            </td>
            <td><span class="metodo">{{ p.metodo_pago }}</span></td>
            <td><strong>$ {{ p.total | number:'1.2-2' }}</strong></td>
            <td>
              <select class="estado-sel" [class]="'e-' + p.estado"
                [ngModel]="p.estado"
                (ngModelChange)="cambiar(p, $event)">
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="en_preparacion">En preparación</option>
                <option value="en_camino">En camino</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </td>
            <td>
              <button class="link" (click)="verDetalle(p)">Ver detalle</button>
            </td>
          </tr>
        }
        @if (pedidos().length === 0 && !cargando()) {
          <tr><td colspan="7" class="vacio">Sin pedidos</td></tr>
        }
      </tbody>
    </table>

    @if (detalle(); as d) {
      <div class="overlay" (click)="cerrarDetalle()"></div>
      <aside class="detalle">
        <header>
          <h3>Pedido #{{ d.id.slice(0,8) }}</h3>
          <button (click)="cerrarDetalle()">✕</button>
        </header>
        <div class="info">
          <p><strong>Cliente:</strong> {{ d.cliente_nombre }} · {{ d.cliente_telefono }}</p>
          <p><strong>Dirección:</strong>
            @if (d.calle) { {{ d.calle }} {{ d.numero }}, {{ d.colonia }}, {{ d.ciudad }} {{ d.cp }} }
            @else { <em>Sin dirección</em> }
          </p>
          <p><strong>Pago:</strong> {{ d.metodo_pago }}</p>
          <p><strong>Total:</strong> $ {{ d.total | number:'1.2-2' }}</p>
          @if (d.notas) { <p><strong>Notas:</strong> {{ d.notas }}</p> }
        </div>
        <h4>Items</h4>
        @if (items().length === 0) { <p class="muted">Cargando…</p> }
        @for (it of items(); track it.id) {
          <div class="item-row">
            <span>{{ it.cantidad }}× {{ it.productos?.nombre || 'Producto' }}</span>
            <span>$ {{ it.subtotal | number:'1.2-2' }}</span>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
    h1 { color: var(--lila-700); margin-bottom: 2px; }
    .muted { color: var(--texto-suave); font-size: 14px; margin: 0; }
    .filtro { padding: 10px 14px; border-radius: 12px; border: 1px solid var(--lila-200); background: white; font: inherit; }

    .tabla { width: 100%; background: white; border-radius: 16px; border: 1px solid var(--lila-100); overflow: hidden; border-collapse: collapse; }
    .tabla th { background: var(--lila-50); color: var(--lila-700); text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 600; }
    .tabla td { padding: 14px 16px; border-top: 1px solid var(--lila-100); font-size: 14px; }
    .tabla tbody tr:hover { background: var(--lila-50); }
    .folio { font-family: monospace; color: var(--lila-700); font-weight: 700; }
    .metodo { text-transform: capitalize; padding: 3px 10px; border-radius: 999px; background: var(--lila-50); font-size: 12px; }
    .estado-sel { padding: 6px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid; cursor: pointer; }
    .e-pendiente { background: #fff5e0; border-color: #f0c14b; color: #8a6d00; }
    .e-confirmado, .e-en_preparacion, .e-en_camino { background: var(--lila-50); border-color: var(--lila-300); color: var(--lila-700); }
    .e-entregado { background: var(--verde-100); border-color: var(--verde-300); color: var(--verde-500); }
    .e-cancelado { background: #ffe5ec; border-color: var(--rosa-fresa); color: #b00020; }
    .link { background: none; color: var(--lila-600); padding: 0; font-size: 13px; }
    .link:hover { color: var(--verde-500); }
    small { display: block; color: var(--texto-suave); font-size: 12px; }
    .vacio { text-align: center; color: var(--texto-suave); padding: 40px; }

    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 60; }
    .detalle {
      position: fixed; top: 0; right: 0; bottom: 0; width: min(440px, 100%);
      background: white; padding: 24px; z-index: 70; overflow-y: auto;
      box-shadow: -10px 0 30px rgba(0,0,0,.1);
    }
    .detalle header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .detalle h3 { color: var(--lila-700); }
    .detalle button { background: var(--lila-100); width: 32px; height: 32px; border-radius: 50%; }
    .info p { margin: 8px 0; font-size: 14px; }
    .info strong { color: var(--lila-700); }
    h4 { margin: 18px 0 10px; color: var(--lila-700); font-size: 14px; }
    .item-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed var(--lila-100); font-size: 14px; }
  `]
})
export class AdminPedidosComponent implements OnInit {
  admin = inject(AdminService);
  pedidos = signal<PedidoDetallado[]>([]);
  cargando = signal(false);
  filtro = signal<EstadoPedido | 'todos'>('todos');

  detalle = signal<PedidoDetallado | null>(null);
  items = signal<any[]>([]);

  async ngOnInit() { await this.cargar(); }

  async cargar() {
    this.cargando.set(true);
    try {
      this.pedidos.set(await this.admin.pedidos(this.filtro()));
    } finally { this.cargando.set(false); }
  }

  async cambiarFiltro(v: EstadoPedido | 'todos') {
    this.filtro.set(v);
    await this.cargar();
  }

  async cambiar(p: PedidoDetallado, nuevo: EstadoPedido) {
    try {
      await this.admin.cambiarEstado(p.id, nuevo);
      await this.cargar();
    } catch (e: any) { alert(e?.message ?? 'Error'); }
  }

  async verDetalle(p: PedidoDetallado) {
    this.detalle.set(p);
    this.items.set([]);
    try { this.items.set(await this.admin.pedidoItems(p.id)); }
    catch (e) { console.error(e); }
  }

  cerrarDetalle() { this.detalle.set(null); }
}

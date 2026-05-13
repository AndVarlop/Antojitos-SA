import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { EstadoPedido, PedidoDetallado } from '../../core/models/cliente.model';

const ESTADOS: Record<EstadoPedido, { label: string; bg: string; color: string; ico: string }> = {
  pendiente:      { label: 'Pendiente',    bg: '#fff8e1', color: '#e65100', ico: '⏳' },
  confirmado:     { label: 'Confirmado',   bg: '#e8f4fd', color: '#1565c0', ico: '✅' },
  en_preparacion: { label: 'Preparando',   bg: '#ede7f6', color: '#4a148c', ico: '👩‍🍳' },
  en_camino:      { label: 'En camino',    bg: '#e8f5e9', color: '#1b5e20', ico: '🚚' },
  entregado:      { label: 'Entregado',    bg: '#e8f5e9', color: '#2f6f4e', ico: '🎉' },
  cancelado:      { label: 'Cancelado',    bg: '#ffe5ec', color: '#b00020', ico: '❌' },
};

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ped">

      <!-- Header -->
      <div class="ped-head">
        <div>
          <h1>Pedidos</h1>
          <p class="sub">{{ pedidos().length }} pedidos · Última actualización hace un momento</p>
        </div>
        <button class="btn-reload" (click)="cargar()">🔄 Recargar</button>
      </div>

      <!-- Filtros -->
      <div class="filtros surface">
        @for (f of filtrosOps; track f.val) {
          <button
            [class.activo]="filtro() === f.val"
            (click)="cambiarFiltro(f.val)">
            {{ f.label }}
            @if (f.val === 'pendiente' && contarEstado('pendiente') > 0) {
              <span class="f-badge">{{ contarEstado('pendiente') }}</span>
            }
          </button>
        }
      </div>

      <!-- Loading -->
      @if (cargando()) {
        <div class="tabla-wrap">
          @for (i of [1,2,3,4]; track i) {
            <div class="skel-row"></div>
          }
        </div>
      }

      <!-- Tabla -->
      @if (!cargando()) {
        <div class="tabla-wrap">
          @if (pedidos().length === 0) {
            <div class="empty">
              <span>📦</span>
              <p>Sin pedidos con este filtro.</p>
            </div>
          } @else {
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
                  <tr class="fila" (click)="verDetalle(p)">
                    <td><span class="folio">#{{ p.id.slice(0,8) }}</span></td>
                    <td class="fecha">{{ p.created_at | date:'d MMM · h:mma' }}</td>
                    <td>
                      <strong class="cli-nom">{{ p.cliente_nombre }}</strong>
                      @if (p.cliente_telefono) { <small class="cli-tel">{{ p.cliente_telefono }}</small> }
                    </td>
                    <td><span class="pago-chip">{{ p.metodo_pago }}</span></td>
                    <td><strong class="precio">$ {{p.total | number:'1.0-0' }}</strong></td>
                    <td>
                      <span class="estado-badge"
                        [style.background]="estadoInfo(p.estado).bg"
                        [style.color]="estadoInfo(p.estado).color">
                        {{ estadoInfo(p.estado).ico }} {{ estadoInfo(p.estado).label }}
                      </span>
                    </td>
                    <td>
                      <button class="link-btn" (click)="$event.stopPropagation(); verDetalle(p)">
                        Ver →
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      }

      <!-- Drawer detalle -->
      @if (detalle(); as d) {
        <div class="overlay" (click)="cerrarDetalle()"></div>
        <aside class="drawer">

          <div class="drawer-head">
            <div>
              <span class="drawer-folio">#{{ d.id.slice(0,8) }}</span>
              <span class="estado-badge"
                [style.background]="estadoInfo(d.estado).bg"
                [style.color]="estadoInfo(d.estado).color">
                {{ estadoInfo(d.estado).ico }} {{ estadoInfo(d.estado).label }}
              </span>
            </div>
            <button class="cerrar-btn" (click)="cerrarDetalle()">✕</button>
          </div>

          <div class="drawer-body">
            <!-- Info cliente -->
            <div class="info-section">
              <h4>👤 Cliente</h4>
              <div class="info-grid">
                <div><label>Nombre</label><span>{{ d.cliente_nombre }}</span></div>
                @if (d.cliente_telefono) { <div><label>Teléfono</label><span>{{ d.cliente_telefono }}</span></div> }
                <div><label>Método de pago</label><span class="pago-chip">{{ d.metodo_pago }}</span></div>
                <div><label>Fecha</label><span>{{ d.created_at | date:'medium' }}</span></div>
              </div>
            </div>

            @if (d.calle) {
              <div class="info-section">
                <h4>📍 Dirección</h4>
                <p class="dir-txt">{{ d.calle }} {{ d.numero }}, {{ d.colonia }}, {{ d.ciudad }} {{ d.cp }}</p>
              </div>
            }

            @if (d.notas) {
              <div class="info-section">
                <h4>📝 Notas</h4>
                <p>{{ d.notas }}</p>
              </div>
            }

            <!-- Items -->
            <div class="info-section">
              <h4>🛍️ Items</h4>
              @if (items().length === 0) {
                <p class="cargando-txt">Cargando items…</p>
              }
              @for (it of items(); track it.id) {
                <div class="item-row">
                  <span class="item-qty">{{ it.cantidad }}×</span>
                  <span class="item-nom">{{ it.productos?.nombre || 'Producto' }}</span>
                  <span class="item-sub">$ {{it.subtotal | number:'1.0-0' }}</span>
                </div>
              }
              <div class="total-row">
                <span>Total</span>
                <strong>$ {{d.total | number:'1.0-0' }}</strong>
              </div>
            </div>

            <!-- Cambiar estado -->
            <div class="info-section">
              <h4>⚡ Cambiar estado</h4>
              <div class="estados-btns">
                @for (est of estadosOps; track est.val) {
                  <button
                    class="est-btn"
                    [class.est-activo]="d.estado === est.val"
                    [style.background]="d.estado === est.val ? estadoInfo(est.val).bg : ''"
                    [style.color]="d.estado === est.val ? estadoInfo(est.val).color : ''"
                    [style.borderColor]="d.estado === est.val ? estadoInfo(est.val).color : ''"
                    (click)="cambiarEstado(d, est.val)">
                    {{ estadoInfo(est.val).ico }} {{ est.label }}
                  </button>
                }
              </div>
            </div>
          </div>

        </aside>
      }

    </div>
  `,
  styles: [`
    .ped { max-width: 1100px; }

    .ped-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 22px;
      gap: 14px;
    }

    h1 { font-size: clamp(20px, 4vw, 28px); color: var(--uva-900); margin: 0 0 4px; }
    .sub { color: var(--texto-suave); margin: 0; font-size: 13px; }

    .btn-reload {
      padding: 9px 16px;
      border-radius: 10px;
      border: 1px solid var(--linea);
      background: #fff;
      color: var(--uva-700);
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
      transition: all .2s;
    }
    .btn-reload:hover { border-color: var(--fresa-300); color: var(--fresa-600); }

    /* Filtros */
    .filtros {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 10px;
      margin-bottom: 18px;
    }

    .filtros button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--texto-suave);
      font-size: 13px;
      font-weight: 600;
      transition: all .18s;
    }
    .filtros button:hover { background: var(--malva-50); color: var(--uva-700); }
    .filtros button.activo { background: var(--uva-900); color: #fff; }

    .f-badge {
      background: var(--fresa-600);
      color: #fff;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 999px;
    }

    /* Tabla wrap */
    .tabla-wrap {
      background: #fff;
      border: 1px solid rgba(95,52,120,.10);
      border-radius: 14px;
      overflow: hidden;
    }

    .skel-row {
      height: 58px;
      border-bottom: 1px solid rgba(95,52,120,.08);
      background: linear-gradient(90deg, #f8f7fc, #f0eef8, #f8f7fc);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    .tabla { width: 100%; border-collapse: collapse; }
    .tabla th {
      background: #faf9ff;
      color: var(--texto-suave);
      text-align: left;
      padding: 12px 16px;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: .5px;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(95,52,120,.08);
    }
    .tabla td { padding: 14px 16px; border-bottom: 1px solid rgba(95,52,120,.06); font-size: 14px; }
    .fila { cursor: pointer; transition: background .15s; }
    .fila:hover td { background: #faf8ff; }
    .fila:last-child td { border-bottom: 0; }

    .folio { font-family: 'Courier New', monospace; color: var(--uva-700); font-weight: 700; font-size: 13px; }
    .fecha { color: var(--texto-suave); font-size: 13px; white-space: nowrap; }
    .cli-nom { display: block; color: var(--uva-900); font-size: 14px; }
    .cli-tel { display: block; color: var(--texto-suave); font-size: 12px; }
    .precio { color: var(--uva-900); font-size: 15px; }

    .pago-chip {
      padding: 3px 10px;
      border-radius: 999px;
      background: var(--malva-50);
      color: var(--uva-700);
      font-size: 12px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .estado-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 11px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }

    .link-btn {
      background: none;
      color: var(--fresa-600);
      font-size: 12px;
      font-weight: 700;
      padding: 0;
    }
    .link-btn:hover { color: var(--fresa-700); }

    .empty {
      padding: 60px 20px;
      text-align: center;
      color: var(--texto-suave);
    }
    .empty span { font-size: 40px; display: block; margin-bottom: 12px; }
    .empty p { font-size: 14px; }

    /* Drawer */
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 60; }
    .drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(460px, 100vw);
      background: #fff;
      z-index: 70;
      display: flex;
      flex-direction: column;
      box-shadow: -16px 0 50px rgba(76,42,91,.2);
      animation: slideIn .28s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

    .drawer-head {
      padding: 18px 20px;
      border-bottom: 1px solid rgba(95,52,120,.10);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: #faf9ff;
    }

    .drawer-head > div { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

    .drawer-folio {
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: 700;
      color: var(--uva-900);
    }

    .cerrar-btn {
      background: var(--malva-100);
      color: var(--uva-700);
      width: 32px; height: 32px;
      border-radius: 50%;
      font-size: 14px;
      flex-shrink: 0;
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-section h4 {
      font-size: 12px;
      font-weight: 700;
      color: var(--texto-suave);
      text-transform: uppercase;
      letter-spacing: .8px;
      margin: 0 0 10px;
      font-family: 'Poppins', sans-serif;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .info-grid div { display: flex; flex-direction: column; gap: 2px; }
    .info-grid label { font-size: 11px; color: var(--texto-suave); font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
    .info-grid span { font-size: 14px; color: var(--uva-900); font-weight: 500; }

    .dir-txt { font-size: 14px; color: var(--uva-900); margin: 0; line-height: 1.6; }

    .cargando-txt { color: var(--texto-suave); font-size: 13px; }

    .item-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(95,52,120,.07);
    }
    .item-qty { color: var(--fresa-600); font-weight: 700; font-size: 14px; min-width: 24px; }
    .item-nom { flex: 1; font-size: 14px; color: var(--uva-900); }
    .item-sub { font-size: 14px; font-weight: 700; color: var(--uva-900); }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0 0;
      font-size: 16px;
    }
    .total-row strong { color: var(--fresa-600); font-size: 18px; }

    /* Botones de estado */
    .estados-btns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .est-btn {
      padding: 9px 12px;
      border-radius: 9px;
      border: 1px solid rgba(95,52,120,.15);
      background: #fff;
      color: var(--texto-suave);
      font-size: 12.5px;
      font-weight: 600;
      transition: all .18s;
      text-align: left;
    }
    .est-btn:hover { border-color: var(--fresa-300); background: var(--fresa-50); color: var(--fresa-600); }
    .est-btn.est-activo { font-weight: 700; }

    /* Responsive */
    @media (max-width: 760px) {
      .ped-head { flex-direction: column; }
      .btn-reload { width: 100%; justify-content: center; }
      .filtros { gap: 4px; }
      .filtros button { padding: 6px 10px; font-size: 12px; }
      .tabla-wrap { overflow-x: auto; }
      .tabla { min-width: 640px; }
      .drawer { width: 100vw; }
      .info-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminPedidosComponent implements OnInit {
  admin = inject(AdminService);
  pedidos = signal<PedidoDetallado[]>([]);
  cargando = signal(false);
  filtro = signal<EstadoPedido | 'todos'>('todos');
  detalle = signal<PedidoDetallado | null>(null);
  items = signal<any[]>([]);

  readonly filtrosOps = [
    { val: 'todos' as const, label: 'Todos' },
    { val: 'pendiente' as EstadoPedido, label: 'Pendientes' },
    { val: 'confirmado' as EstadoPedido, label: 'Confirmados' },
    { val: 'en_preparacion' as EstadoPedido, label: 'Preparando' },
    { val: 'en_camino' as EstadoPedido, label: 'En camino' },
    { val: 'entregado' as EstadoPedido, label: 'Entregados' },
    { val: 'cancelado' as EstadoPedido, label: 'Cancelados' },
  ];

  readonly estadosOps = [
    { val: 'pendiente' as EstadoPedido, label: 'Pendiente' },
    { val: 'confirmado' as EstadoPedido, label: 'Confirmado' },
    { val: 'en_preparacion' as EstadoPedido, label: 'Preparando' },
    { val: 'en_camino' as EstadoPedido, label: 'En camino' },
    { val: 'entregado' as EstadoPedido, label: 'Entregado' },
    { val: 'cancelado' as EstadoPedido, label: 'Cancelado' },
  ];

  async ngOnInit() { await this.cargar(); }

  estadoInfo(e: EstadoPedido) { return ESTADOS[e] ?? { label: e, bg: '#f5f5f5', color: '#666', ico: '•' }; }

  contarEstado(e: EstadoPedido) { return this.pedidos().filter(p => p.estado === e).length; }

  async cargar() {
    this.cargando.set(true);
    try { this.pedidos.set(await this.admin.pedidos(this.filtro())); }
    finally { this.cargando.set(false); }
  }

  async cambiarFiltro(v: EstadoPedido | 'todos') {
    this.filtro.set(v);
    await this.cargar();
  }

  async verDetalle(p: PedidoDetallado) {
    this.detalle.set(p);
    this.items.set([]);
    try { this.items.set(await this.admin.pedidoItems(p.id)); }
    catch (e) { console.error(e); }
  }

  cerrarDetalle() { this.detalle.set(null); }

  async cambiarEstado(p: PedidoDetallado, nuevo: EstadoPedido) {
    if (p.estado === nuevo) return;
    try {
      await this.admin.cambiarEstado(p.id, nuevo);
      this.detalle.set({ ...p, estado: nuevo });
      await this.cargar();
    } catch (e: any) { alert(e?.message ?? 'Error al cambiar estado'); }
  }
}

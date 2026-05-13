import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AdminEstadisticas } from '../../core/models/cliente.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dash">

      <!-- Header -->
      <div class="dash-head">
        <div>
          <h1>Dashboard</h1>
          <p class="sub">Resumen del negocio en tiempo real.</p>
        </div>
        <button class="btn-refresh" (click)="cargar()" [class.girando]="cargando()">
          🔄 Actualizar
        </button>
      </div>

      <!-- Skeleton o KPIs -->
      @if (cargando()) {
        <div class="grid-kpi">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="kpi skel"></div>
          }
        </div>
      }

      @if (s(); as stats) {
        <!-- KPI Cards -->
        <div class="grid-kpi">

          <div class="kpi" [class.kpi-alerta]="stats.pedidos_pendientes > 0">
            <div class="kpi-ico" style="background:#fff3e0;color:#e65100">📦</div>
            <div class="kpi-info">
              <span class="kpi-label">Pedidos hoy</span>
              <strong class="kpi-val">{{ stats.pedidos_hoy }}</strong>
              <small>{{ stats.pedidos_total }} totales</small>
            </div>
            @if (stats.pedidos_pendientes > 0) {
              <span class="kpi-tag tag-amber">{{ stats.pedidos_pendientes }} pendientes</span>
            }
          </div>

          <div class="kpi kpi-destaca">
            <div class="kpi-ico" style="background:#fce4ec;color:#c9364f">⏳</div>
            <div class="kpi-info">
              <span class="kpi-label">Por procesar</span>
              <strong class="kpi-val">{{ stats.pedidos_pendientes }}</strong>
              <small>pedidos pendientes</small>
            </div>
            <a routerLink="/admin/pedidos" class="kpi-link">Ver →</a>
          </div>

          <div class="kpi">
            <div class="kpi-ico" style="background:#e8f5e9;color:#2f6f4e">💰</div>
            <div class="kpi-info">
              <span class="kpi-label">Ingresos del mes</span>
              <strong class="kpi-val">$ {{stats.ingresos_mes | number:'1.0-0' }}</strong>
              <small>$ {{stats.ingresos_total | number:'1.0-0' }} histórico</small>
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-ico" style="background:#ede7f6;color:#5f3478">👥</div>
            <div class="kpi-info">
              <span class="kpi-label">Clientes</span>
              <strong class="kpi-val">{{ stats.clientes_total }}</strong>
              <small>{{ stats.clientes_verificados }} verificados</small>
            </div>
          </div>

          <div class="kpi">
            <div class="kpi-ico" style="background:#e3f2fd;color:#1565c0">💳</div>
            <div class="kpi-info">
              <span class="kpi-label">Crédito activo</span>
              <strong class="kpi-val">$ {{stats.credito_usado | number:'1.0-0' }}</strong>
              <small>de $ {{stats.credito_otorgado | number:'1.0-0' }} otorgado</small>
            </div>
          </div>

          <div class="kpi" [class.kpi-rojo]="stats.productos_agotados > 0">
            <div class="kpi-ico"
              [style.background]="stats.productos_agotados > 0 ? '#ffe5ec' : '#f3faf3'"
              [style.color]="stats.productos_agotados > 0 ? '#b00020' : '#2f6f4e'">
              {{ stats.productos_agotados > 0 ? '⚠️' : '✅' }}
            </div>
            <div class="kpi-info">
              <span class="kpi-label">Productos activos</span>
              <strong class="kpi-val">{{ stats.productos_activos }}</strong>
              <small [class.text-rojo]="stats.productos_agotados > 0">
                {{ stats.productos_agotados > 0 ? stats.productos_agotados + ' agotados' : 'Todo en stock' }}
              </small>
            </div>
            @if (stats.productos_agotados > 0) {
              <span class="kpi-tag tag-rojo">Revisar</span>
            }
          </div>

        </div>

        <!-- Sección especial fresas -->
        <div class="fresas-panel">
          <div class="fresas-panel-head">
            <div>
              <span class="fresas-kicker">Producto estrella</span>
              <h2>Fresas con crema 🍓</h2>
              <p>{{ hoyEsViernes ? '¡Hoy es día de entregas!' : 'Entrega el ' + proximoViernes }}</p>
            </div>
            <div class="fresas-estado-badge" [class.es-viernes]="hoyEsViernes">
              {{ hoyEsViernes ? '🍓 Día de entrega' : '📅 Próximo viernes' }}
            </div>
          </div>
          <div class="fresas-acciones">
            <a routerLink="/admin/pedidos" class="fresas-btn">Ver pedidos de fresas →</a>
            <a href="#" class="fresas-btn-ghost" target="_blank" rel="noopener">
              Abrir WhatsApp
            </a>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="accesos">
          <h3>Accesos rápidos</h3>
          <div class="accesos-grid">
            <a routerLink="/admin/pedidos" class="acceso-card">
              <span>📦</span>
              <strong>Pedidos</strong>
              <small>{{ stats.pedidos_total }} total</small>
            </a>
            <a routerLink="/admin/productos" class="acceso-card">
              <span>🛍️</span>
              <strong>Productos</strong>
              <small>{{ stats.productos_activos }} activos</small>
            </a>
            <a routerLink="/admin/clientes" class="acceso-card">
              <span>👥</span>
              <strong>Clientes</strong>
              <small>{{ stats.clientes_total }} registrados</small>
            </a>
            <a routerLink="/" class="acceso-card" target="_blank">
              <span>🏪</span>
              <strong>Ver tienda</strong>
              <small>Vista pública</small>
            </a>
          </div>
        </div>
      }

      @if (!cargando() && !s()) {
        <div class="empty-state">
          <span>📊</span>
          <p>No se pudieron cargar las estadísticas.</p>
          <button class="btn-primario" (click)="cargar()">Reintentar</button>
        </div>
      }

    </div>
  `,
  styles: [`
    .dash { max-width: 1100px; }

    .dash-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
      gap: 16px;
    }

    h1 {
      font-size: clamp(22px, 4vw, 30px);
      color: var(--uva-900);
      margin: 0 0 4px;
    }

    .sub { color: var(--texto-suave); margin: 0; font-size: 14px; }

    .btn-refresh {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      border-radius: 10px;
      border: 1px solid var(--linea);
      background: #fff;
      color: var(--uva-700);
      font-size: 13px;
      font-weight: 600;
      transition: all .2s;
      flex-shrink: 0;
    }
    .btn-refresh:hover { border-color: var(--fresa-300); color: var(--fresa-600); }
    .btn-refresh.girando { opacity: .6; pointer-events: none; }

    /* KPI Grid */
    .grid-kpi {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
      margin-bottom: 28px;
    }

    .kpi {
      background: #fff;
      border: 1px solid rgba(95,52,120,.10);
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 2px 12px rgba(76,42,91,.05);
      transition: box-shadow .2s, transform .2s;
      position: relative;
      overflow: hidden;
    }

    .kpi:hover { box-shadow: 0 8px 24px rgba(76,42,91,.10); transform: translateY(-2px); }

    .kpi.skel {
      min-height: 110px;
      background: linear-gradient(90deg, #f0eef8, #e8e5f4, #f0eef8);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border: none;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .kpi-destaca { background: linear-gradient(135deg, #fff5f7 0%, #fff0f5 100%); border-color: rgba(201,54,79,.18); }
    .kpi-alerta { border-color: rgba(255,152,0,.35); }
    .kpi-rojo { border-color: rgba(176,0,32,.25); background: #fff5f7; }

    .kpi-ico {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .kpi-info { display: flex; flex-direction: column; gap: 3px; }
    .kpi-label { color: var(--texto-suave); font-size: 12px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }
    .kpi-val { font-size: 28px; font-weight: 800; color: var(--uva-900); line-height: 1.1; }
    .kpi small { color: var(--texto-suave); font-size: 12px; }
    .text-rojo { color: #b00020 !important; font-weight: 600; }

    .kpi-tag {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 999px;
    }

    .tag-amber { background: #fff8e1; color: #e65100; border: 1px solid rgba(230,81,0,.2); }
    .tag-rojo { background: #ffe5ec; color: #b00020; border: 1px solid rgba(176,0,32,.2); }

    .kpi-link {
      align-self: flex-start;
      font-size: 12px;
      font-weight: 700;
      color: var(--fresa-600);
      text-decoration: none;
    }
    .kpi-link:hover { color: var(--fresa-700); }

    /* Fresas Panel */
    .fresas-panel {
      background: linear-gradient(135deg, #fff0f3, #ffe4ec 50%, #f9e4ff);
      border: 1px solid rgba(201,54,79,.2);
      border-radius: 16px;
      padding: 26px 28px;
      margin-bottom: 28px;
    }

    .fresas-panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .fresas-kicker {
      display: inline-block;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--fresa-600);
      margin-bottom: 6px;
    }

    .fresas-panel h2 {
      font-size: clamp(20px, 3vw, 26px);
      color: var(--uva-900);
      margin: 0 0 6px;
    }

    .fresas-panel p { color: var(--texto-suave); margin: 0; font-size: 14px; }

    .fresas-estado-badge {
      padding: 8px 18px;
      border-radius: 999px;
      background: rgba(255,255,255,.7);
      border: 1px solid rgba(201,54,79,.2);
      color: var(--fresa-600);
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }

    .fresas-estado-badge.es-viernes {
      background: rgba(201,54,79,.12);
      border-color: rgba(201,54,79,.4);
      color: var(--fresa-700);
    }

    .fresas-acciones { display: flex; gap: 10px; flex-wrap: wrap; }

    .fresas-btn {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      border-radius: 10px;
      background: var(--fresa-600);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: background .2s;
    }
    .fresas-btn:hover { background: var(--fresa-700); color: #fff; }

    .fresas-btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 10px 20px;
      border-radius: 10px;
      background: rgba(255,255,255,.72);
      border: 1px solid rgba(201,54,79,.2);
      color: var(--fresa-600);
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: all .2s;
    }
    .fresas-btn-ghost:hover { background: rgba(255,255,255,.9); }

    /* Accesos rápidos */
    .accesos h3 {
      font-size: 16px;
      color: var(--uva-900);
      margin: 0 0 14px;
    }

    .accesos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
    }

    .acceso-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 16px;
      background: #fff;
      border: 1px solid rgba(95,52,120,.10);
      border-radius: 14px;
      text-decoration: none;
      text-align: center;
      transition: all .2s;
      box-shadow: 0 2px 8px rgba(76,42,91,.04);
    }
    .acceso-card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(76,42,91,.10); border-color: rgba(201,54,79,.2); }
    .acceso-card span { font-size: 26px; }
    .acceso-card strong { display: block; color: var(--uva-900); font-size: 14px; }
    .acceso-card small { color: var(--texto-suave); font-size: 12px; }

    /* Empty state */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: var(--texto-suave);
    }
    .empty-state span { font-size: 48px; display: block; margin-bottom: 16px; }
    .empty-state p { margin-bottom: 20px; font-size: 15px; }

    @media (max-width: 760px) {
      .dash-head { flex-direction: column; align-items: stretch; }
      .btn-refresh { width: 100%; justify-content: center; }
      .grid-kpi { grid-template-columns: repeat(2, 1fr); gap: 10px; }
      .kpi-val { font-size: 22px; }
      .fresas-panel { padding: 20px; }
      .fresas-panel-head { flex-direction: column; align-items: flex-start; }
      .accesos-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 420px) {
      .grid-kpi { grid-template-columns: 1fr; }
      .accesos-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  admin = inject(AdminService);
  s = signal<AdminEstadisticas | null>(null);
  cargando = signal(false);

  readonly hoyEsViernes = new Date().getDay() === 5;
  readonly proximoViernes = (() => {
    const hoy = new Date();
    const dia = hoy.getDay();
    if (dia === 5) return 'hoy';
    const diff = dia < 5 ? 5 - dia : 7 - dia + 5;
    const v = new Date(hoy);
    v.setDate(hoy.getDate() + diff);
    return v.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  })();

  async ngOnInit() { await this.cargar(); }

  async cargar() {
    this.cargando.set(true);
    try { this.s.set(await this.admin.estadisticas()); }
    catch (e) { console.error(e); this.s.set(null); }
    finally { this.cargando.set(false); }
  }
}

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { AdminEstadisticas } from '../../core/models/cliente.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Dashboard</h1>
    <p class="muted">Resumen de la operación.</p>

    @if (cargando()) { <p>Cargando…</p> }

    @if (stats(); as s) {
      <div class="grid">
        <div class="kpi">
          <span class="kpi-label">Pedidos hoy</span>
          <strong>{{ s.pedidos_hoy }}</strong>
          <small>{{ s.pedidos_total }} totales</small>
        </div>
        <div class="kpi destaca">
          <span class="kpi-label">Pendientes</span>
          <strong>{{ s.pedidos_pendientes }}</strong>
          <small>por procesar</small>
        </div>
        <div class="kpi">
          <span class="kpi-label">Ingresos del mes</span>
          <strong>$ {{ s.ingresos_mes | number:'1.2-2' }}</strong>
          <small>$ {{ s.ingresos_total | number:'1.2-2' }} totales</small>
        </div>
        <div class="kpi">
          <span class="kpi-label">Clientes</span>
          <strong>{{ s.clientes_total }}</strong>
          <small>{{ s.clientes_verificados }} verificados</small>
        </div>
        <div class="kpi">
          <span class="kpi-label">Crédito otorgado</span>
          <strong>$ {{ s.credito_otorgado | number:'1.2-2' }}</strong>
          <small>$ {{ s.credito_usado | number:'1.2-2' }} en uso</small>
        </div>
        <div class="kpi" [class.alerta]="s.productos_agotados > 0">
          <span class="kpi-label">Productos</span>
          <strong>{{ s.productos_activos }}</strong>
          <small>{{ s.productos_agotados }} agotados</small>
        </div>
      </div>
    }
  `,
  styles: [`
    h1 { color: var(--lila-700); margin-bottom: 4px; }
    .muted { color: var(--texto-suave); margin-bottom: 28px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .kpi {
      background: white;
      padding: 22px;
      border-radius: 16px;
      border: 1px solid var(--lila-100);
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 4px 14px rgba(85,60,154,.06);
    }
    .kpi-label { color: var(--texto-suave); font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: .5px; }
    .kpi strong { font-size: 32px; color: var(--lila-700); font-weight: 700; }
    .kpi small { color: var(--texto-suave); font-size: 13px; }
    .kpi.destaca { background: var(--gradiente-hero); border-color: var(--lila-300); }
    .kpi.destaca strong { color: var(--lila-700); }
    .kpi.alerta { border-color: var(--rosa-fresa); background: #fff5f7; }
    .kpi.alerta strong { color: var(--rosa-fresa); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  admin = inject(AdminService);
  stats = signal<AdminEstadisticas | null>(null);
  cargando = signal(false);

  async ngOnInit() {
    this.cargando.set(true);
    try { this.stats.set(await this.admin.estadisticas()); }
    catch (e) { console.error(e); }
    finally { this.cargando.set(false); }
  }
}

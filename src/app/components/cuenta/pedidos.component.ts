import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { Pedido } from '../../core/models/cliente.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Mis pedidos</h2>
    @if (cargando()) { <p class="muted">Cargando…</p> }
    @if (!cargando() && pedidos().length === 0) {
      <p class="muted">Aún no has hecho ningún pedido.</p>
    }
    @for (p of pedidos(); track p.id) {
      <article class="pedido">
        <div class="pedido-head">
          <span class="folio">#{{ p.id.slice(0,8) }}</span>
          <span class="estado" [class]="'e-' + p.estado">{{ etiquetaEstado(p.estado) }}</span>
        </div>
        <div class="pedido-body">
          <span>{{ p.created_at | date:'medium' }}</span>
          <span class="metodo">{{ p.metodo_pago }}</span>
        </div>
        <div class="pedido-total">$ {{ p.total | number:'1.2-2' }}</div>
      </article>
    }
  `,
  styles: [`
    h2 { color: var(--lila-700); margin-bottom: 22px; }
    .muted { color: var(--texto-suave); }
    .pedido {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 6px 18px;
      padding: 16px 18px;
      border-radius: 14px;
      border: 1px solid var(--lila-100);
      margin-bottom: 12px;
      align-items: center;
    }
    .pedido-head { display: flex; gap: 12px; align-items: center; }
    .folio { font-weight: 700; color: var(--lila-700); font-family: monospace; }
    .estado {
      padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
      background: var(--lila-100); color: var(--lila-700);
    }
    .e-entregado { background: var(--verde-100); color: var(--verde-500); }
    .e-cancelado { background: #ffe5ec; color: #b00020; }
    .e-en_camino, .e-confirmado, .e-en_preparacion { background: #fff5e0; color: #8a6d00; }

    .pedido-body { display: flex; gap: 14px; color: var(--texto-suave); font-size: 14px; }
    .metodo { text-transform: capitalize; }
    .pedido-total {
      grid-column: 2; grid-row: 1 / span 2;
      font-size: 22px; font-weight: 700; color: var(--lila-700);
    }
  `]
})
export class PedidosComponent implements OnInit {
  supa = inject(SupabaseService);
  pedidos = signal<Pedido[]>([]);
  cargando = signal(false);

  async ngOnInit() {
    this.cargando.set(true);
    try { this.pedidos.set(await this.supa.misPedidos()); }
    finally { this.cargando.set(false); }
  }

  etiquetaEstado(e: string) {
    const map: Record<string, string> = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      en_preparacion: 'En preparación',
      en_camino: 'En camino',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return map[e] ?? e;
  }
}

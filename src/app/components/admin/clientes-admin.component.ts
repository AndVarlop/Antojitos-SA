import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="head">
      <div>
        <h1>Clientes</h1>
        <p class="muted">{{ clientes().length }} clientes</p>
      </div>
      <input class="buscar" placeholder="Buscar por nombre…"
        [(ngModel)]="busqueda"
        (ngModelChange)="buscar()" />
    </header>

    @if (cargando()) { <p>Cargando…</p> }

    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Teléfono</th>
          <th>Verificado</th>
          <th>Límite</th>
          <th>Saldo</th>
          <th>Disponible</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        @for (c of clientes(); track c.id) {
          <tr>
            <td><strong>{{ c.nombre }}</strong></td>
            <td>{{ c.telefono || '—' }}</td>
            <td>
              <span class="badge" [class.ok]="c.verificado" [class.no]="!c.verificado">
                {{ c.verificado ? '✓ Sí' : '✗ No' }}
              </span>
            </td>
            <td>$ {{ c.limite_credito | number:'1.2-2' }}</td>
            <td class="usado">$ {{ c.saldo_credito | number:'1.2-2' }}</td>
            <td><strong>$ {{ disponible(c) | number:'1.2-2' }}</strong></td>
            <td>
              <button class="link" (click)="abrir(c)">Gestionar</button>
            </td>
          </tr>
        }
        @if (clientes().length === 0 && !cargando()) {
          <tr><td colspan="7" class="vacio">Sin clientes</td></tr>
        }
      </tbody>
    </table>

    @if (sel(); as c) {
      <div class="overlay" (click)="cerrar()"></div>
      <aside class="modal">
        <header>
          <h3>{{ c.nombre }}</h3>
          <button (click)="cerrar()">✕</button>
        </header>

        <div class="info">
          <p><strong>Teléfono:</strong> {{ c.telefono || '—' }}</p>
          <p><strong>Verificado:</strong> {{ c.verificado ? 'Sí' : 'No' }}</p>
          <p><strong>Cliente desde:</strong> {{ c.created_at | date:'mediumDate' }}</p>
        </div>

        <h4>Ajustar límite de crédito</h4>
        <div class="row">
          <input type="number" min="0" step="0.01" [(ngModel)]="nuevoLimite" placeholder="Nuevo límite" />
          <input [(ngModel)]="notaLimite" placeholder="Nota" />
          <button class="btn-primario" (click)="ajustar()" [disabled]="enviando()">Guardar</button>
        </div>

        <h4>Registrar pago / condonar saldo</h4>
        <p class="muted small">Saldo actual: <strong>$ {{ c.saldo_credito | number:'1.2-2' }}</strong></p>
        <div class="row">
          <input type="number" min="0" step="0.01" [(ngModel)]="abonoMonto" placeholder="Monto" />
          <input [(ngModel)]="abonoNota" placeholder="Concepto" />
          <button class="btn-primario" (click)="abonar()" [disabled]="enviando()">Aplicar</button>
        </div>

        @if (mensaje()) { <div class="alerta-ok">{{ mensaje() }}</div> }
        @if (error()) { <div class="alerta-error">{{ error() }}</div> }
      </aside>
    }
  `,
  styles: [`
    .head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; gap: 14px; }
    h1 { color: var(--lila-700); margin-bottom: 2px; }
    .muted { color: var(--texto-suave); font-size: 14px; margin: 0; }
    .small { font-size: 13px; margin: 6px 0 12px; }
    .buscar { padding: 10px 14px; border-radius: 12px; border: 1px solid var(--lila-200); font: inherit; min-width: 260px; }

    .tabla { width: 100%; background: white; border-radius: 16px; border: 1px solid var(--lila-100); overflow: hidden; border-collapse: collapse; }
    .tabla th { background: var(--lila-50); color: var(--lila-700); text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 600; }
    .tabla td { padding: 14px 16px; border-top: 1px solid var(--lila-100); font-size: 14px; }
    .tabla tbody tr:hover { background: var(--lila-50); }
    .badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge.ok { background: var(--verde-100); color: var(--verde-500); }
    .badge.no { background: #ffe5ec; color: #b00020; }
    .usado { color: var(--rosa-fresa); }
    .link { background: none; color: var(--lila-600); padding: 0; font-size: 13px; }
    .vacio { text-align: center; color: var(--texto-suave); padding: 40px; }

    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 60; }
    .modal {
      position: fixed; top: 0; right: 0; bottom: 0; width: min(480px, 100%);
      background: white; padding: 24px; z-index: 70; overflow-y: auto;
    }
    .modal header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .modal h3 { color: var(--lila-700); }
    .modal button.cerrar, .modal header button { background: var(--lila-100); width: 32px; height: 32px; border-radius: 50%; }
    h4 { color: var(--lila-700); margin: 18px 0 8px; font-size: 14px; }
    .info p { margin: 6px 0; font-size: 14px; }
    .row { display: grid; grid-template-columns: 130px 1fr auto; gap: 8px; margin-bottom: 12px; }
    .row input { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--lila-200); font: inherit; }
    .alerta-ok { padding: 10px; background: var(--verde-100); color: var(--verde-500); border-radius: 10px; font-size: 13px; }
    .alerta-error { padding: 10px; background: #ffe5ec; color: #b00020; border-radius: 10px; font-size: 13px; }
  `]
})
export class AdminClientesComponent implements OnInit {
  admin = inject(AdminService);
  clientes = signal<Cliente[]>([]);
  cargando = signal(false);
  busqueda = '';
  private timer?: any;

  sel = signal<Cliente | null>(null);
  nuevoLimite?: number;
  notaLimite = '';
  abonoMonto?: number;
  abonoNota = '';
  enviando = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  async ngOnInit() { await this.cargar(); }

  disponible(c: Cliente) {
    return Math.max((c.limite_credito ?? 0) - (c.saldo_credito ?? 0), 0);
  }

  async cargar() {
    this.cargando.set(true);
    try { this.clientes.set(await this.admin.clientes(this.busqueda)); }
    finally { this.cargando.set(false); }
  }

  buscar() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.cargar(), 300);
  }

  abrir(c: Cliente) {
    this.sel.set(c);
    this.nuevoLimite = c.limite_credito;
    this.notaLimite = '';
    this.abonoMonto = undefined;
    this.abonoNota = '';
    this.mensaje.set(null); this.error.set(null);
  }

  cerrar() { this.sel.set(null); }

  async ajustar() {
    const c = this.sel(); if (!c || this.nuevoLimite == null) return;
    this.enviando.set(true); this.mensaje.set(null); this.error.set(null);
    try {
      await this.admin.ajustarLimite(c.id, this.nuevoLimite, this.notaLimite || undefined);
      this.mensaje.set('Límite actualizado ✓');
      await this.cargar();
      const fresh = this.clientes().find(x => x.id === c.id);
      if (fresh) this.sel.set(fresh);
    } catch (e: any) { this.error.set(e?.message ?? 'Error'); }
    finally { this.enviando.set(false); }
  }

  async abonar() {
    const c = this.sel(); if (!c || !this.abonoMonto) return;
    this.enviando.set(true); this.mensaje.set(null); this.error.set(null);
    try {
      await this.admin.condonarSaldo(c.id, this.abonoMonto, this.abonoNota || undefined);
      this.mensaje.set('Pago registrado ✓');
      this.abonoMonto = undefined; this.abonoNota = '';
      await this.cargar();
      const fresh = this.clientes().find(x => x.id === c.id);
      if (fresh) this.sel.set(fresh);
    } catch (e: any) { this.error.set(e?.message ?? 'Error'); }
    finally { this.enviando.set(false); }
  }
}

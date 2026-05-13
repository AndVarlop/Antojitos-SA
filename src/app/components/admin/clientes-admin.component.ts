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
    <div class="cli">

      <!-- Header -->
      <div class="cli-head">
        <div>
          <h1>Clientes</h1>
          <p class="sub">{{ clientes().length }} clientes registrados</p>
        </div>
        <label class="buscar-wrap">
          <span>🔍</span>
          <input class="buscar" placeholder="Buscar por nombre…"
            [(ngModel)]="busqueda"
            (ngModelChange)="buscar()" />
        </label>
      </div>

      @if (cargando()) {
        <div class="tabla-wrap">
          @for (i of [1,2,3,4,5]; track i) { <div class="skel-row"></div> }
        </div>
      }

      @if (!cargando()) {
        <div class="tabla-wrap">
          @if (clientes().length === 0) {
            <div class="empty"><span>👥</span><p>Sin clientes con este filtro.</p></div>
          } @else {
            <table class="tabla">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Límite crédito</th>
                  <th>Saldo usado</th>
                  <th>Disponible</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (c of clientes(); track c.id) {
                  <tr class="fila">
                    <td>
                      <div class="cli-info">
                        <div class="cli-avatar">{{ c.nombre[0].toUpperCase() }}</div>
                        <div>
                          <strong>{{ c.nombre }}</strong>
                          @if (c.telefono) { <small>{{ c.telefono }}</small> }
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge" [class.ok]="c.verificado" [class.no]="!c.verificado">
                        {{ c.verificado ? '✓ Verificado' : '✗ Sin verificar' }}
                      </span>
                    </td>
                    <td>$ {{c.limite_credito | number:'1.0-0' }}</td>
                    <td>
                      <span [class.usado-alto]="c.saldo_credito > 0">
                        $ {{c.saldo_credito | number:'1.0-0' }}
                      </span>
                    </td>
                    <td>
                      <strong class="disponible">
                        $ {{disponible(c) | number:'1.0-0' }}
                      </strong>
                    </td>
                    <td>
                      <button class="link-btn" (click)="abrir(c)">Gestionar →</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      }

      <!-- Drawer -->
      @if (sel(); as c) {
        <div class="overlay" (click)="cerrar()"></div>
        <aside class="drawer">

          <div class="drawer-head">
            <div class="drawer-cli">
              <div class="cli-avatar-lg">{{ c.nombre[0].toUpperCase() }}</div>
              <div>
                <strong>{{ c.nombre }}</strong>
                <small>{{ c.telefono || 'Sin teléfono' }}</small>
              </div>
            </div>
            <button class="cerrar-btn" (click)="cerrar()">✕</button>
          </div>

          <div class="drawer-body">

            <!-- Info -->
            <div class="info-section">
              <h4>📋 Información</h4>
              <div class="info-grid">
                <div><label>Verificado</label>
                  <span class="badge" [class.ok]="c.verificado" [class.no]="!c.verificado">
                    {{ c.verificado ? '✓ Sí' : '✗ No' }}
                  </span>
                </div>
                <div><label>Cliente desde</label><span>{{ c.created_at | date:'mediumDate' }}</span></div>
              </div>
            </div>

            <!-- Resumen crédito -->
            <div class="credito-resumen">
              <div class="credito-item">
                <span>Límite</span>
                <strong>$ {{c.limite_credito | number:'1.0-0' }}</strong>
              </div>
              <div class="credito-item">
                <span>Usado</span>
                <strong class="text-rojo">$ {{c.saldo_credito | number:'1.0-0' }}</strong>
              </div>
              <div class="credito-item">
                <span>Disponible</span>
                <strong class="text-verde">$ {{disponible(c) | number:'1.0-0' }}</strong>
              </div>
            </div>

            <!-- Bar de crédito -->
            <div class="credito-bar-wrap">
              <div class="credito-bar">
                <div class="credito-fill"
                  [style.width]="porcentajeUsado(c) + '%'"
                  [class.fill-alto]="porcentajeUsado(c) > 75">
                </div>
              </div>
              <small>{{ porcentajeUsado(c) | number:'1.0-0' }}% del límite usado</small>
            </div>

            <!-- Ajustar límite -->
            <div class="info-section">
              <h4>💳 Ajustar límite de crédito</h4>
              <div class="form-row">
                <div class="field">
                  <label>Nuevo límite (COP)</label>
                  <input type="number" min="0" step="1000" [(ngModel)]="nuevoLimite" placeholder="50000" />
                </div>
                <div class="field">
                  <label>Nota</label>
                  <input [(ngModel)]="notaLimite" placeholder="Razón del ajuste" />
                </div>
              </div>
              <button class="btn-accion" (click)="ajustar()" [disabled]="enviando()">
                {{ enviando() ? 'Guardando…' : 'Actualizar límite' }}
              </button>
            </div>

            <!-- Registrar pago -->
            <div class="info-section">
              <h4>💰 Registrar pago / abono</h4>
              <div class="form-row">
                <div class="field">
                  <label>Monto (COP)</label>
                  <input type="number" min="0" step="1000" [(ngModel)]="abonoMonto" placeholder="10000" />
                </div>
                <div class="field">
                  <label>Concepto</label>
                  <input [(ngModel)]="abonoNota" placeholder="Ej: Pago en efectivo" />
                </div>
              </div>
              <button class="btn-accion btn-verde" (click)="abonar()" [disabled]="enviando()">
                {{ enviando() ? 'Aplicando…' : 'Registrar pago' }}
              </button>
            </div>

            @if (mensaje()) { <div class="alerta-ok">✅ {{ mensaje() }}</div> }
            @if (error()) { <div class="alerta-error">❌ {{ error() }}</div> }

          </div>
        </aside>
      }

    </div>
  `,
  styles: [`
    .cli { max-width: 1100px; }

    .cli-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 22px;
      gap: 14px;
      flex-wrap: wrap;
    }

    h1 { font-size: clamp(20px, 4vw, 28px); color: var(--uva-900); margin: 0 0 4px; }
    .sub { color: var(--texto-suave); margin: 0; font-size: 13px; }

    .buscar-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      border-radius: 10px;
      border: 1px solid rgba(95,52,120,.15);
      background: #fff;
      min-width: 260px;
    }
    .buscar-wrap span { color: var(--texto-suave); font-size: 15px; }
    .buscar {
      border: none;
      outline: none;
      font: inherit;
      font-size: 14px;
      color: var(--uva-900);
      background: transparent;
      width: 100%;
    }

    /* Tabla */
    .tabla-wrap {
      background: #fff;
      border: 1px solid rgba(95,52,120,.10);
      border-radius: 14px;
      overflow: hidden;
    }

    .skel-row {
      height: 58px;
      border-bottom: 1px solid rgba(95,52,120,.06);
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
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .5px;
      text-transform: uppercase;
      border-bottom: 1px solid rgba(95,52,120,.08);
    }
    .tabla td { padding: 14px 16px; border-bottom: 1px solid rgba(95,52,120,.06); font-size: 14px; }
    .fila:hover td { background: #faf8ff; }
    .fila:last-child td { border-bottom: 0; }

    .cli-info { display: flex; align-items: center; gap: 12px; }
    .cli-avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: var(--gradiente-boton);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .cli-info strong { display: block; color: var(--uva-900); font-size: 14px; }
    .cli-info small, .cli-avatar-lg + div small { display: block; color: var(--texto-suave); font-size: 12px; }

    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
    }
    .badge.ok { background: var(--menta-100); color: var(--hoja-700); }
    .badge.no { background: #ffe5ec; color: #b00020; }

    .usado-alto { color: #b00020; font-weight: 600; }
    .disponible { color: var(--hoja-700); font-size: 15px; }

    .link-btn { background: none; color: var(--fresa-600); font-size: 12.5px; font-weight: 700; padding: 0; }
    .link-btn:hover { color: var(--fresa-700); }

    .empty { padding: 60px 20px; text-align: center; color: var(--texto-suave); }
    .empty span { font-size: 40px; display: block; margin-bottom: 12px; }

    /* Drawer */
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 60; }
    .drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: min(480px, 100vw);
      background: #fff;
      z-index: 70;
      display: flex;
      flex-direction: column;
      box-shadow: -16px 0 50px rgba(76,42,91,.18);
      animation: slideIn .28s cubic-bezier(.2,.8,.2,1);
    }
    @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

    .drawer-head {
      padding: 18px 20px;
      border-bottom: 1px solid rgba(95,52,120,.10);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #faf9ff;
    }

    .drawer-cli { display: flex; align-items: center; gap: 12px; }

    .cli-avatar-lg {
      width: 46px; height: 46px;
      border-radius: 50%;
      background: var(--gradiente-boton);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
    }

    .drawer-cli strong { display: block; color: var(--uva-900); font-size: 16px; }

    .cerrar-btn {
      background: var(--malva-100); color: var(--uva-700);
      width: 32px; height: 32px; border-radius: 50%; font-size: 14px;
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
      font-size: 11.5px;
      font-weight: 700;
      color: var(--texto-suave);
      text-transform: uppercase;
      letter-spacing: .8px;
      margin: 0 0 12px;
      font-family: 'Poppins', sans-serif;
    }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .info-grid div { display: flex; flex-direction: column; gap: 4px; }
    .info-grid label { font-size: 10.5px; color: var(--texto-suave); font-weight: 700; text-transform: uppercase; }
    .info-grid span { font-size: 14px; color: var(--uva-900); }

    /* Crédito resumen */
    .credito-resumen {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      background: var(--malva-50);
      border-radius: 12px;
      padding: 14px;
      border: 1px solid rgba(95,52,120,.12);
    }

    .credito-item { text-align: center; }
    .credito-item span { display: block; font-size: 11px; color: var(--texto-suave); font-weight: 600; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
    .credito-item strong { font-size: 16px; font-weight: 800; color: var(--uva-900); }
    .text-rojo { color: #b00020 !important; }
    .text-verde { color: var(--hoja-700) !important; }

    .credito-bar-wrap { display: flex; flex-direction: column; gap: 6px; }
    .credito-bar {
      height: 8px;
      border-radius: 999px;
      background: rgba(95,52,120,.12);
      overflow: hidden;
    }
    .credito-fill {
      height: 100%;
      border-radius: 999px;
      background: var(--uva-600);
      transition: width .4s ease;
    }
    .credito-fill.fill-alto { background: #b00020; }
    .credito-bar-wrap small { font-size: 12px; color: var(--texto-suave); }

    /* Formularios */
    .form-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
    .field { display: flex; flex-direction: column; gap: 4px; }
    .field label { font-size: 11px; font-weight: 700; color: var(--uva-700); text-transform: uppercase; letter-spacing: .3px; }
    .field input {
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(95,52,120,.18);
      font: inherit;
      font-size: 14px;
      outline: none;
      transition: border-color .2s, box-shadow .2s;
    }
    .field input:focus {
      border-color: rgba(201,54,79,.45);
      box-shadow: 0 0 0 3px rgba(201,54,79,.10);
    }

    .btn-accion {
      width: 100%;
      padding: 11px;
      border-radius: 10px;
      background: var(--uva-900);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      transition: all .2s;
    }
    .btn-accion:hover { background: var(--uva-800); }
    .btn-accion:disabled { opacity: .6; }
    .btn-accion.btn-verde { background: var(--hoja-700); }
    .btn-accion.btn-verde:hover { background: var(--hoja-600); }

    .alerta-ok {
      padding: 12px 14px;
      background: var(--menta-100);
      color: var(--hoja-700);
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
    }
    .alerta-error {
      padding: 12px 14px;
      background: #ffe5ec;
      color: #b00020;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
    }

    /* Responsive */
    @media (max-width: 760px) {
      .cli-head { flex-direction: column; }
      .buscar-wrap { min-width: 0; width: 100%; }
      .tabla-wrap { overflow-x: auto; }
      .tabla { min-width: 620px; }
      .drawer { width: 100vw; }
      .credito-resumen { grid-template-columns: 1fr; gap: 8px; }
      .info-grid { grid-template-columns: 1fr; }
    }
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

  disponible(c: Cliente) { return Math.max((c.limite_credito ?? 0) - (c.saldo_credito ?? 0), 0); }
  porcentajeUsado(c: Cliente) {
    if (!c.limite_credito) return 0;
    return Math.min(100, (c.saldo_credito / c.limite_credito) * 100);
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
    this.mensaje.set(null);
    this.error.set(null);
  }

  cerrar() { this.sel.set(null); }

  async ajustar() {
    const c = this.sel();
    if (!c || this.nuevoLimite == null) return;
    this.enviando.set(true); this.mensaje.set(null); this.error.set(null);
    try {
      await this.admin.ajustarLimite(c.id, this.nuevoLimite, this.notaLimite || undefined);
      this.mensaje.set('Límite actualizado correctamente');
      await this.cargar();
      const fresh = this.clientes().find(x => x.id === c.id);
      if (fresh) this.sel.set(fresh);
    } catch (e: any) { this.error.set(e?.message ?? 'Error'); }
    finally { this.enviando.set(false); }
  }

  async abonar() {
    const c = this.sel();
    if (!c || !this.abonoMonto) return;
    this.enviando.set(true); this.mensaje.set(null); this.error.set(null);
    try {
      await this.admin.condonarSaldo(c.id, this.abonoMonto, this.abonoNota || undefined);
      this.mensaje.set('Pago registrado correctamente');
      this.abonoMonto = undefined; this.abonoNota = '';
      await this.cargar();
      const fresh = this.clientes().find(x => x.id === c.id);
      if (fresh) this.sel.set(fresh);
    } catch (e: any) { this.error.set(e?.message ?? 'Error'); }
    finally { this.enviando.set(false); }
  }
}

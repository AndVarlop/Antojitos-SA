import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">

      @if (abierto()) {
        <div class="sb-overlay" (click)="cerrar()"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar" [class.abierto]="abierto()">
        <div class="sb-head">
          <a routerLink="/" class="sb-logo" (click)="cerrar()">
            <img src="antojitos-logo.jpeg" alt="Logo" />
            <div>
              <span class="sb-nombre">Antojitos S&amp;A</span>
              <small>Panel Admin</small>
            </div>
          </a>
          <button class="sb-x" (click)="cerrar()" aria-label="Cerrar">✕</button>
        </div>

        <nav class="sb-nav">
          <p class="sb-grupo">Principal</p>
          <a routerLink="/admin/dashboard" routerLinkActive="activo" (click)="cerrar()">
            <span>📊</span> Dashboard
          </a>
          <a routerLink="/admin/pedidos" routerLinkActive="activo" (click)="cerrar()">
            <span>📦</span> Pedidos
            @if (pendientes() > 0) { <em class="pill-badge">{{ pendientes() }}</em> }
          </a>
          <a routerLink="/admin/productos" routerLinkActive="activo" (click)="cerrar()">
            <span>🛍️</span> Productos
          </a>
          <a routerLink="/admin/clientes" routerLinkActive="activo" (click)="cerrar()">
            <span>👥</span> Clientes
          </a>

          <p class="sb-grupo" style="margin-top:8px">Especial</p>
          <a routerLink="/admin/dashboard" class="link-fresas" (click)="cerrar()">
            <span>🍓</span> Fresas &amp; Viernes
          </a>
        </nav>

        <div class="sb-foot">
          <a routerLink="/" class="sb-tienda" (click)="cerrar()">← Ver tienda</a>
          <button class="sb-logout" (click)="salir()">Salir</button>
        </div>
      </aside>

      <!-- Área principal -->
      <div class="main">

        <!-- Topbar -->
        <header class="topbar">
          <div class="tp-izq">
            <button class="hamb" (click)="toggle()" aria-label="Menú">
              <span></span><span></span><span></span>
            </button>
            <span class="tp-fecha">{{ hoy }}</span>
          </div>
          <div class="tp-der">
            <span class="negocio-badge">
              <span class="dot"></span> Activo
            </span>
            <div class="user-chip">
              <div class="avatar">{{ inicial() }}</div>
              <span>{{ nombre() }}</span>
              <span class="admin-badge">ADMIN</span>
            </div>
          </div>
        </header>

        <div class="page">
          <router-outlet />
        </div>
      </div>

      <!-- Bottom nav (solo móvil) -->
      <nav class="bot-nav">
        <a routerLink="/admin/dashboard" routerLinkActive="bot-activo">
          <span>📊</span><small>Dashboard</small>
        </a>
        <a routerLink="/admin/pedidos" routerLinkActive="bot-activo">
          <span>📦</span><small>Pedidos</small>
        </a>
        <a routerLink="/admin/productos" routerLinkActive="bot-activo">
          <span>🛍️</span><small>Productos</small>
        </a>
        <a routerLink="/admin/clientes" routerLinkActive="bot-activo">
          <span>👥</span><small>Clientes</small>
        </a>
      </nav>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      --sb: #160c26;
      --sb-hover: rgba(255,255,255,.07);
      --sb-active: rgba(201,54,79,.2);
      --ad-bg: #f4f3fa;
      --ad-border: rgba(95,52,120,.12);
      --ad-soft: #6b637a;
      --ad-card: #ffffff;
    }

    .shell {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: 100vh;
      background: var(--ad-bg);
    }

    /* ── Sidebar ── */
    .sidebar {
      position: fixed;
      top: 0; left: 0; bottom: 0;
      width: 240px;
      background: var(--sb);
      display: flex;
      flex-direction: column;
      z-index: 60;
      overflow-y: auto;
    }

    .sb-head {
      padding: 18px 14px 14px;
      border-bottom: 1px solid rgba(255,255,255,.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .sb-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex: 1;
      min-width: 0;
    }

    .sb-logo img {
      width: 34px; height: 34px;
      border-radius: 9px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .sb-nombre {
      display: block;
      font-family: 'Playfair Display', serif;
      font-size: 13px;
      font-weight: 700;
      color: white;
      white-space: nowrap;
    }

    .sb-logo small {
      display: block;
      font-size: 9px;
      color: rgba(255,255,255,.45);
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }

    .sb-x {
      display: none;
      background: rgba(255,255,255,.1);
      color: rgba(255,255,255,.7);
      width: 26px; height: 26px;
      border-radius: 50%;
      font-size: 13px;
      flex-shrink: 0;
    }

    .sb-nav {
      flex: 1;
      padding: 10px 10px 0;
      display: flex;
      flex-direction: column;
    }

    .sb-grupo {
      color: rgba(255,255,255,.3);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1.8px;
      text-transform: uppercase;
      padding: 14px 10px 6px;
      margin: 0;
    }

    .sb-nav a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 9px;
      color: rgba(255,255,255,.68);
      font-size: 13.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all .18s;
      margin-bottom: 2px;
    }

    .sb-nav a span:first-child { font-size: 15px; width: 18px; text-align: center; }
    .sb-nav a:hover { background: var(--sb-hover); color: rgba(255,255,255,.92); }
    .sb-nav a.activo { background: var(--sb-active); color: white; font-weight: 600; }

    .pill-badge {
      margin-left: auto;
      background: var(--fresa-600);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      font-style: normal;
      padding: 2px 7px;
      border-radius: 999px;
    }

    .link-fresas {
      background: linear-gradient(135deg, rgba(201,54,79,.12), rgba(163,106,186,.08)) !important;
      border: 1px solid rgba(201,54,79,.18) !important;
      color: #ff9dba !important;
    }
    .link-fresas:hover { color: #ffbdd0 !important; background: rgba(201,54,79,.2) !important; }

    .sb-foot {
      padding: 12px 10px;
      border-top: 1px solid rgba(255,255,255,.08);
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .sb-tienda {
      padding: 9px 12px;
      border-radius: 9px;
      color: rgba(255,255,255,.5);
      font-size: 12.5px;
      text-decoration: none;
      transition: all .18s;
    }
    .sb-tienda:hover { color: rgba(255,255,255,.8); background: var(--sb-hover); }

    .sb-logout {
      padding: 9px 12px;
      border-radius: 9px;
      background: rgba(176,0,32,.12);
      color: #ff8da0;
      font-size: 12.5px;
      text-align: left;
      transition: all .18s;
    }
    .sb-logout:hover { background: rgba(176,0,32,.25); color: #ffb0be; }

    /* ── Main ── */
    .main {
      grid-column: 2;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* ── Topbar ── */
    .topbar {
      position: sticky;
      top: 0;
      z-index: 30;
      background: rgba(255,255,255,.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--ad-border);
      height: 58px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .tp-izq, .tp-der { display: flex; align-items: center; gap: 12px; }

    .hamb {
      display: none;
      flex-direction: column;
      gap: 5px;
      width: 36px; height: 36px;
      background: #fff;
      border: 1px solid var(--ad-border);
      border-radius: 9px;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .hamb span { display: block; width: 17px; height: 2px; background: var(--uva-900); border-radius: 2px; }

    .tp-fecha {
      color: var(--ad-soft);
      font-size: 13px;
      text-transform: capitalize;
    }

    .negocio-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11.5px;
      font-weight: 600;
      color: var(--hoja-700);
      background: var(--menta-50);
      border: 1px solid rgba(47,111,78,.18);
      padding: 4px 11px;
      border-radius: 999px;
    }

    .dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--hoja-600);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 12px 5px 5px;
      border-radius: 999px;
      border: 1px solid var(--ad-border);
      background: #fff;
      font-size: 13px;
      font-weight: 600;
      color: var(--uva-900);
    }

    .avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--gradiente-boton);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
    }

    .admin-badge {
      background: var(--gradiente-boton);
      color: #fff;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    /* ── Page ── */
    .page { flex: 1; padding: 28px; overflow-x: hidden; }

    /* ── Bottom nav ── */
    .bot-nav {
      display: none;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 40;
      background: white;
      border-top: 1px solid var(--ad-border);
      grid-template-columns: repeat(4, 1fr);
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .bot-nav a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 4px;
      color: var(--ad-soft);
      font-size: 9.5px;
      font-weight: 600;
      text-decoration: none;
    }
    .bot-nav a span { font-size: 20px; }
    .bot-nav a.bot-activo { color: var(--fresa-600); }

    /* ── Overlay ── */
    .sb-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.52);
      z-index: 55;
    }

    /* ── Responsive ── */
    @media (max-width: 960px) {
      .shell { grid-template-columns: 1fr; }
      .sidebar { transform: translateX(-100%); transition: transform .28s cubic-bezier(.2,.8,.2,1); }
      .sidebar.abierto { transform: translateX(0); }
      .main { grid-column: 1; }
      .hamb { display: inline-flex; }
      .sb-x { display: flex; }
      .negocio-badge { display: none; }
      .page { padding: 20px; }
    }

    @media (max-width: 640px) {
      .bot-nav { display: grid; }
      .page { padding: 16px; padding-bottom: 76px; }
      .topbar { padding: 0 14px; height: 52px; }
      .tp-fecha { display: none; }
      .user-chip span:not(.admin-badge) { display: none; }
    }

    @media (max-width: 380px) {
      .page { padding: 12px; padding-bottom: 72px; }
    }
  `]
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  router = inject(Router);
  abierto = signal(false);
  pendientes = signal(0);

  readonly hoy = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  inicial(): string {
    const n = this.auth.perfil()?.nombre;
    return n ? n[0].toUpperCase() : 'A';
  }

  nombre(): string {
    const n = this.auth.perfil()?.nombre;
    return n ? n.split(' ')[0] : 'Admin';
  }

  toggle() { this.abierto.update(v => !v); }
  cerrar() { this.abierto.set(false); }

  async salir() {
    this.cerrar();
    await this.auth.logout();
    this.router.navigate(['/']);
  }

  @HostListener('window:keydown.escape')
  onEsc() { this.cerrar(); }
}

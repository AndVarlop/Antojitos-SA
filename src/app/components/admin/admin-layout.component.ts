import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-shell">
      <aside class="sidebar">
        <a routerLink="/" class="brand-mini">🍓 <em>Admin</em></a>
        <nav class="menu">
          <a routerLink="/admin/dashboard" routerLinkActive="activo">📊 Dashboard</a>
          <a routerLink="/admin/pedidos" routerLinkActive="activo">📦 Pedidos</a>
          <a routerLink="/admin/clientes" routerLinkActive="activo">👥 Clientes</a>
          <a routerLink="/admin/productos" routerLinkActive="activo">🍓 Productos</a>
        </nav>
        <div class="bottom">
          <a routerLink="/" class="ver-tienda">← Ver tienda</a>
          <button class="logout" (click)="auth.logout()">Salir</button>
        </div>
      </aside>
      <main class="contenido">
        <header class="topbar">
          <span>{{ auth.perfil()?.nombre }}</span>
          <span class="badge">ADMIN</span>
        </header>
        <div class="cuerpo">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; background: #f5f3fb; }
    .admin-shell { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }

    .sidebar {
      background: var(--lila-700);
      color: white;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .brand-mini {
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700; color: white;
      padding-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,.15);
    }
    .brand-mini em { color: var(--verde-200); font-style: normal; }
    .menu { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .menu a {
      padding: 10px 14px; border-radius: 10px;
      color: rgba(255,255,255,.85);
      font-size: 14px; font-weight: 500;
      transition: all .2s;
    }
    .menu a:hover { background: rgba(255,255,255,.1); color: white; }
    .menu a.activo { background: rgba(255,255,255,.18); color: white; }

    .bottom { display: flex; flex-direction: column; gap: 8px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,.15); }
    .ver-tienda { color: rgba(255,255,255,.7); font-size: 13px; padding: 6px 14px; }
    .ver-tienda:hover { color: white; }
    .logout { background: rgba(255,255,255,.08); color: white; padding: 10px 14px; border-radius: 10px; font-size: 13px; text-align: left; }
    .logout:hover { background: #b00020; }

    .contenido { display: flex; flex-direction: column; }
    .topbar {
      background: white; padding: 14px 28px;
      display: flex; justify-content: flex-end; align-items: center; gap: 10px;
      border-bottom: 1px solid var(--lila-100);
    }
    .badge {
      background: var(--gradiente-boton); color: white;
      padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 1px;
    }
    .cuerpo { padding: 32px; flex: 1; }

    @media (max-width: 900px) {
      .admin-shell { grid-template-columns: 1fr; }
      .sidebar {
        position: sticky; top: 0; z-index: 30;
        flex-direction: column; padding: 12px 14px;
        gap: 10px;
      }
      .brand-mini { padding-bottom: 10px; font-size: 18px; }
      .menu {
        flex-direction: row;
        overflow-x: auto;
        gap: 6px;
        padding-bottom: 6px;
        -webkit-overflow-scrolling: touch;
      }
      .menu::-webkit-scrollbar { display: none; }
      .menu a {
        flex: 0 0 auto;
        padding: 8px 12px;
        font-size: 13px;
        white-space: nowrap;
      }
      .bottom { flex-direction: row; border: 0; padding-top: 0; gap: 10px; }
      .ver-tienda { padding: 6px 10px; font-size: 12px; }
      .logout { padding: 8px 12px; font-size: 12px; }
      .topbar { padding: 12px 18px; }
      .cuerpo { padding: 18px; }
    }
    @media (max-width: 480px) {
      .cuerpo { padding: 14px; }
      .bottom { flex-direction: column; }
      .ver-tienda, .logout { width: 100%; text-align: center; }
    }
  `]
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
}

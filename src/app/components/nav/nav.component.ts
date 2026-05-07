import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="nav">
      <div class="contenedor nav-row">
        <a class="brand" routerLink="/">
          <span class="brand-emoji">🍓</span>
          <span>Antojitos <em>S&amp;A</em></span>
        </a>
        <nav class="links">
          <a routerLink="/" fragment="catalogo">Menú</a>
          <a routerLink="/" fragment="contacto">Contacto</a>
          @if (auth.logueado()) {
            <a routerLink="/cuenta/pedidos">Mis pedidos</a>
          }
        </nav>
        <div class="acciones">
          @if (auth.esAdmin()) {
            <a routerLink="/admin/dashboard" class="admin-link">⚙ Admin</a>
          }
          @if (auth.logueado()) {
            <a routerLink="/cuenta/perfil" class="usuario">
              👤 {{ saludo() }}
            </a>
          } @else {
            <a routerLink="/auth/login" class="btn-fantasma compact">Entrar</a>
            <a routerLink="/auth/registro" class="btn-primario compact">Registrarse</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; position: sticky; top: 0; z-index: 40; }
    .nav {
      background: rgba(255, 250, 243, .9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--lila-100);
    }
    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 24px;
      gap: 14px;
    }
    .brand {
      display: inline-flex; align-items: center; gap: 10px;
      font-family: 'Playfair Display', serif;
      font-size: 22px; font-weight: 700;
      color: var(--lila-700);
    }
    .brand em { color: var(--verde-500); font-style: normal; }
    .brand-emoji { font-size: 26px; }

    .links { display: flex; gap: 20px; flex: 1; justify-content: center; }
    .links a {
      color: var(--texto); font-weight: 500; font-size: 14px;
      transition: color .2s;
    }
    .links a:hover { color: var(--lila-500); }

    .acciones { display: flex; gap: 10px; align-items: center; }
    .usuario {
      padding: 8px 14px; border-radius: 999px;
      background: var(--lila-100); color: var(--lila-700);
      font-size: 13px; font-weight: 600;
    }
    .compact { padding: 8px 16px; font-size: 13px; }
    .admin-link {
      padding: 8px 14px; border-radius: 999px;
      background: var(--lila-700); color: white;
      font-size: 13px; font-weight: 600;
    }
    .admin-link:hover { background: var(--lila-600); color: white; }

    @media (max-width: 720px) {
      .links { display: none; }
      .acciones .compact { padding: 6px 12px; }
    }
  `]
})
export class NavComponent {
  carrito = inject(CarritoService);
  auth = inject(AuthService);

  saludo(): string {
    const nombre = this.auth.perfil()?.nombre;
    if (!nombre) return 'Mi cuenta';
    return nombre.split(' ')[0];
  }
}

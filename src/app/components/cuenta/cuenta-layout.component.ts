import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-cuenta-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NavComponent, FooterComponent],
  template: `
    <app-nav />
    <main class="cuenta">
      <div class="contenedor">
        <header class="cuenta-head">
          <h1>Hola, {{ auth.perfil()?.nombre || 'cliente' }} 🍓</h1>
          <p>{{ auth.session()?.user?.email }}</p>
          @if (!auth.verificado()) {
            <div class="aviso">Tu correo aún no está verificado. <a routerLink="/auth/verificar">Verificar ahora</a></div>
          }
        </header>

        <div class="cuenta-grid">
          <nav class="cuenta-nav">
            <a routerLink="/cuenta/perfil" routerLinkActive="activo">Mi perfil</a>
            <a routerLink="/cuenta/pedidos" routerLinkActive="activo">Mis pedidos</a>
            <a routerLink="/cuenta/credito" routerLinkActive="activo">Mi crédito</a>
            <a routerLink="/cuenta/direcciones" routerLinkActive="activo">Direcciones</a>
            <button class="salir" (click)="salir()">Cerrar sesión</button>
          </nav>
          <section class="cuenta-cuerpo">
            <router-outlet />
          </section>
        </div>
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    :host { display: block; }
    .cuenta { padding: 40px 0 80px; min-height: 70vh; }
    .cuenta-head { margin-bottom: 32px; }
    .cuenta-head h1 { font-size: 36px; color: var(--lila-700); margin-bottom: 4px; }
    .cuenta-head p { color: var(--texto-suave); margin: 0; }
    .aviso { margin-top: 12px; padding: 10px 14px; background: #fff5e0; color: #8a6d00; border-radius: 10px; font-size: 14px; }
    .aviso a { color: var(--lila-600); font-weight: 600; }

    .cuenta-grid { display: grid; grid-template-columns: 220px 1fr; gap: 32px; }
    .cuenta-nav { display: flex; flex-direction: column; gap: 6px; }
    .cuenta-nav a {
      padding: 12px 16px; border-radius: 12px; color: var(--texto);
      font-weight: 500; transition: all .2s;
    }
    .cuenta-nav a:hover { background: var(--lila-50); color: var(--lila-700); }
    .cuenta-nav a.activo { background: var(--lila-100); color: var(--lila-700); font-weight: 600; }
    .salir {
      margin-top: 14px; padding: 12px 16px; border-radius: 12px;
      background: transparent; color: var(--texto-suave); text-align: left;
      transition: all .2s;
    }
    .salir:hover { background: #ffe5ec; color: #b00020; }

    .cuenta-cuerpo {
      background: white; border-radius: var(--radius);
      padding: 32px; box-shadow: var(--sombra-suave);
      border: 1px solid var(--lila-100); min-height: 400px;
    }

    @media (max-width: 768px) {
      .cuenta-grid { grid-template-columns: 1fr; }
      .cuenta-nav { flex-direction: row; overflow-x: auto; padding-bottom: 8px; }
      .cuenta-nav a, .salir { flex-shrink: 0; }
    }
  `]
})
export class CuentaLayoutComponent {
  auth = inject(AuthService);
  async salir() { await this.auth.logout(); }
}
